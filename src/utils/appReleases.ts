import { MobileApp } from '../types';

export interface AppReleaseInfo {
  version: string;
  apkUrl?: string;
  publishedAt?: string;
}

const STORAGE_KEY = 'portfolio_app_releases_v1';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

export function getRepoFromGithubUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+\/[^/#?]+)/i);
  return match ? match[1].replace(/\.git$/, '') : null;
}

export function selectApkDownloadUrl(
  assets?: Array<{ name: string; browser_download_url: string }>,
  fallbackUrl?: string
): string | undefined {
  if (!assets || !assets.length) return fallbackUrl;

  const apks = assets.filter(a => a.name.toLowerCase().endsWith('.apk'));
  if (!apks.length) return fallbackUrl;

  // 1. Prefer arm64-v8a build (standard for modern Android)
  const arm64 = apks.find(a => a.name.toLowerCase().includes('arm64-v8a'));
  if (arm64) return arm64.browser_download_url;

  // 2. Prefer app-named release build (not 32-bit armeabi or x86)
  const appNamed = apks.find(a => {
    const l = a.name.toLowerCase();
    return !l.includes('armeabi') && !l.includes('x86') && !l.includes('v7a') && !l.startsWith('app-');
  });
  if (appNamed) return appNamed.browser_download_url;

  // 3. Prefer universal build
  const universal = apks.find(a => {
    const l = a.name.toLowerCase();
    return !l.includes('armeabi') && !l.includes('x86') && !l.includes('v7a');
  });
  if (universal) return universal.browser_download_url;

  return apks[0].browser_download_url;
}

export function isVersionNewerOrEqual(newVer: string, currentVer?: string): boolean {
  if (!currentVer) return true;
  const cleanNew = newVer.replace(/^v/i, '').trim();
  const cleanCurr = currentVer.replace(/^v/i, '').trim();
  if (cleanNew === cleanCurr) return true;

  const parseParts = (v: string) => v.split(/[-.+]/)[0].split('.').map(n => parseInt(n, 10) || 0);
  const pNew = parseParts(cleanNew);
  const pCurr = parseParts(cleanCurr);

  for (let i = 0; i < Math.max(pNew.length, pCurr.length); i++) {
    const a = pNew[i] || 0;
    const b = pCurr[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
}

export function getCachedAppReleases(): Record<string, AppReleaseInfo> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.timestamp === 'number' && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.data || {};
    }
  } catch (_) {}
  return {};
}

export function saveCachedAppReleases(data: Record<string, AppReleaseInfo>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (_) {}
}

export async function fetchLatestAppReleases(apps: MobileApp[]): Promise<Record<string, AppReleaseInfo>> {
  // 1. Try internal backend API endpoint first (which has in-memory + edge caching)
  try {
    const res = await fetch('/api/apps/releases');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        saveCachedAppReleases(data);
        return data;
      }
    }
  } catch (_) {
    // If backend is unavailable, fall back to direct GitHub API
  }

  // 2. Direct GitHub API fallback
  const results: Record<string, AppReleaseInfo> = {};
  await Promise.allSettled(
    apps.map(async (app) => {
      const repo = getRepoFromGithubUrl(app.githubUrl);
      if (!repo) return;

      try {
        const ghRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        });
        if (!ghRes.ok) return;

        const release = await ghRes.json();
        if (release && release.tag_name) {
          const apkUrl = selectApkDownloadUrl(release.assets, app.apkUrl);
          results[app.id] = {
            version: release.tag_name,
            apkUrl,
            publishedAt: release.published_at
          };
        }
      } catch (_) {}
    })
  );

  if (Object.keys(results).length > 0) {
    saveCachedAppReleases(results);
  }

  return results;
}

export function mergeAppReleases(
  apps: MobileApp[],
  releases: Record<string, AppReleaseInfo>
): MobileApp[] {
  if (!releases || Object.keys(releases).length === 0) return apps;

  return apps.map(app => {
    const rel = releases[app.id];
    if (!rel || !rel.version) return app;

    // Do not downgrade if current version in code is newer
    if (!isVersionNewerOrEqual(rel.version, app.version)) {
      return app;
    }

    return {
      ...app,
      version: rel.version,
      apkUrl: rel.apkUrl || app.apkUrl
    };
  });
}
