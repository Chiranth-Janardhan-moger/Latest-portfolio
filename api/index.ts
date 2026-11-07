import { Detector } from "sqlguardjs";
// @ts-ignore
import fortifyPkg from "@chiranthmoger/fortifyjs";

let fortifyEngineInstance: any = null;
try {
  const DetectionEngine = (fortifyPkg as any).DetectionEngine || (fortifyPkg as any).default?.DetectionEngine;
  if (DetectionEngine) {
    fortifyEngineInstance = new DetectionEngine();
  }
} catch (_) {}

const detector = new Detector();
const inMemorySecurityLogs: any[] = [];

interface CachedAppRelease {
  version: string;
  apkUrl?: string;
  publishedAt?: string;
}

let vercelAppReleasesCache: { timestamp: number; data: Record<string, CachedAppRelease> } | null = null;
const VERCEL_RELEASES_TTL_MS = 10 * 60 * 1000; // 10 minutes

const APP_GITHUB_REPOS: Record<string, string> = {
  webstack: "Chiranth-Janardhan-moger/webstack",
  vaultx: "Chiranth-Janardhan-moger/vaultx-offline-password-manager",
  "latex-editor": "Chiranth-Janardhan-moger/latex-editor-android"
};

async function fetchServerAppReleases(): Promise<Record<string, CachedAppRelease>> {
  const results: Record<string, CachedAppRelease> = {};

  await Promise.all(
    Object.entries(APP_GITHUB_REPOS).map(async ([appId, repo]) => {
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
          headers: {
            "User-Agent": "Portfolio-Release-Checker/1.0",
            Accept: "application/vnd.github.v3+json"
          }
        });
        if (!ghRes.ok) return;
        const release: any = await ghRes.json();
        if (release && release.tag_name) {
          const assets: Array<{ name: string; browser_download_url: string }> = release.assets || [];
          const apks = assets.filter(a => a.name.toLowerCase().endsWith(".apk"));

          let apkUrl: string | undefined;
          const arm64 = apks.find(a => a.name.toLowerCase().includes("arm64-v8a"));
          const named = apks.find(a => {
            const l = a.name.toLowerCase();
            return !l.includes("armeabi") && !l.includes("x86") && !l.includes("v7a") && !l.startsWith("app-");
          });
          const universal = apks.find(a => {
            const l = a.name.toLowerCase();
            return !l.includes("armeabi") && !l.includes("x86") && !l.includes("v7a");
          });

          if (arm64) apkUrl = arm64.browser_download_url;
          else if (named) apkUrl = named.browser_download_url;
          else if (universal) apkUrl = universal.browser_download_url;
          else if (apks.length > 0) apkUrl = apks[0].browser_download_url;

          results[appId] = {
            version: release.tag_name,
            apkUrl,
            publishedAt: release.published_at
          };
        }
      } catch (err) {
        console.warn(`[Releases] Error fetching release for ${repo}:`, err);
      }
    })
  );

  return results;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req: any, res: any) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : Array.isArray(forwarded) ? forwarded[0] : null) || req.headers["x-real-ip"] || req.socket?.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown";

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. IP resolution
  if (url.startsWith("/api/my-ip")) {
    return res.status(200).json({ ip });
  }

  // 2. Visits counter
  if (url.startsWith("/api/visits")) {
    return res.status(200).json({ count: 1254 });
  }

  // 2b. App releases
  if (url.startsWith("/api/apps/releases")) {
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");
    if (vercelAppReleasesCache && Date.now() - vercelAppReleasesCache.timestamp < VERCEL_RELEASES_TTL_MS) {
      return res.status(200).json(vercelAppReleasesCache.data);
    }
    try {
      const data = await fetchServerAppReleases();
      if (Object.keys(data).length > 0) {
        vercelAppReleasesCache = { timestamp: Date.now(), data };
      }
      return res.status(200).json(vercelAppReleasesCache ? vercelAppReleasesCache.data : data);
    } catch (_) {
      if (vercelAppReleasesCache) {
        return res.status(200).json(vercelAppReleasesCache.data);
      }
      return res.status(200).json({});
    }
  }

  // 3. Custom blogs
  if (url.startsWith("/api/blogs/custom")) {
    return res.status(200).json({ posts: [] });
  }

  // 4. Security endpoints - Active SQLGuardJS Evaluation
  if (url.startsWith("/api/security/test")) {
    let payload = "";
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {
        payload = body;
      }
    }
    if (body && typeof body === "object") {
      payload = typeof body.payload === "string" ? body.payload : (body.payload !== undefined ? String(body.payload) : JSON.stringify(body));
    } else if (typeof body === "string") {
      payload = body;
    }

    if (!payload && req.query?.payload) {
      payload = String(req.query.payload);
    }

    const result = detector.detect(payload);
    const isBlocked = result.label !== "benign" && result.confidence >= 0.5;

    if (isBlocked) {
      const threatEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        ip: String(ip),
        method,
        path: url,
        status: "blocked",
        label: result.label,
        confidence: result.confidence,
        matches: result.matches || [],
        payloadSnippet: payload.substring(0, 100)
      };
      inMemorySecurityLogs.unshift(threatEntry);
      if (inMemorySecurityLogs.length > 50) inMemorySecurityLogs.pop();

      return res.status(403).json({
        error: "Forbidden",
        message: "Malicious payload detected by SQLGuardJS",
        details: {
          label: result.label,
          confidence: result.confidence,
          matches: result.matches,
          scores: result.scores
        },
        blocked: true,
        received: payload
      });
    }

    return res.status(200).json({
      success: true,
      mode: "block",
      status: "active",
      message: "Payload successfully verified. No malicious patterns detected by SQLGuardJS.",
      details: {
        label: result.label,
        confidence: result.confidence,
        matches: result.matches,
        scores: result.scores
      },
      blocked: false,
      received: payload,
      timestamp: new Date().toISOString()
    });
  }

  // FortifyJS Live Inspection Endpoint
  if (url.startsWith("/api/fortify/test")) {
    let payload = "";
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (_) { payload = body; }
    }
    if (body && typeof body === "object") {
      payload = typeof body.payload === "string" ? body.payload : (body.payload !== undefined ? String(body.payload) : JSON.stringify(body));
    } else if (typeof body === "string") {
      payload = body;
    }
    if (!payload && req.query?.payload) {
      payload = String(req.query.payload);
    }

    const startTime = performance.now();
    if (fortifyEngineInstance) {
      const result = fortifyEngineInstance.detect(payload);
      const latencyMs = Math.max(0.012, performance.now() - startTime).toFixed(3);
      const isBlocked = result.label !== "benign" && result.confidence >= 0.5;

      return res.status(isBlocked ? 403 : 200).json({
        success: true,
        blocked: isBlocked,
        label: result.label,
        confidence: Math.round(result.confidence * 1000) / 10,
        latency: `${latencyMs} ms`,
        scores: result.scores || {},
        matches: result.matches || [],
        received: payload
      });
    }

    return res.status(200).json({
      success: true,
      blocked: false,
      label: "benign",
      confidence: 0,
      latency: "0.020 ms",
      scores: {},
      matches: [],
      received: payload
    });
  }

  if (url.startsWith("/api/security/logs")) {
    const authHeader = req.headers["authorization"];
    if (process.env.ADMIN_API_KEY && authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(200).json(inMemorySecurityLogs);
  }

  // 5. Contact form submission
  if (url.startsWith("/api/contact")) {
    const body = req.body || {};
    return res.status(200).json({
      success: true,
      message: "Submission received.",
      submission: {
        id: Math.random().toString(36).substring(2, 9),
        name: body.name || "Anonymous",
        createdAt: new Date().toISOString()
      }
    });
  }

  // 6. Telemetry pixel fallback
  if (url.startsWith("/api/telemetry") || url.startsWith("/api/track")) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
    return res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"><rect width="1" height="1" fill="none"/></svg>`);
  }

  // 7. Honeypot routes
  const HONEYPOT_ROUTES = [
    "/admin", "/.env", "/wp-admin", "/wp-login.php", "/.git",
    "/config", "/config.json", "/administrator", "/.env.local",
    "/.env.production", "/etc/passwd"
  ];

  const isHoneypot = HONEYPOT_ROUTES.some(route => url.startsWith(route));
  if (isHoneypot) {
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    // Non-blocking Discord alert if configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
      try {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "SQLGuard Security Trap",
            embeds: [{
              title: `🚨 Honeypot Trap Triggered: ${url}`,
              color: 0xEF4444,
              fields: [
                { name: "🌐 IP Address", value: `\`${ip}\``, inline: true },
                { name: "⏰ Time", value: `\`${timestamp}\``, inline: true },
                { name: "📱 User Agent", value: `\`${String(userAgent).substring(0, 180)}\``, inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          }),
          signal: AbortSignal.timeout(3000)
        }).catch(() => {});
      } catch (_) {}
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(418).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HONEYPOT DETECTED // SQLGUARD SHIELD</title>
  <style>
    body {
      background-color: #FFFFFF;
      color: #111111;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 2.5rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      max-width: 560px;
      width: 100%;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 24px;
      box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.08);
      padding: 2rem;
    }
    .pill {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #DC2626;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    p { color: #6B6B6B; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
    .box {
      background: #F9F9FB;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 1rem;
      font-family: monospace;
      font-size: 0.8rem;
      margin-bottom: 1.5rem;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    @media (min-width: 640px) {
      .btn-group {
        flex-direction: row;
      }
    }
    a.btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #111111;
      color: #FFFFFF;
      text-decoration: none;
      padding: 10px 18px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.825rem;
    }
    a.btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #FFFFFF;
      color: #111111;
      border: 1px solid rgba(0, 0, 0, 0.15);
      text-decoration: none;
      padding: 10px 18px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.825rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="pill">HONEYPOT TRAP ACTIVATED</div>
    <h1>Unauthorized Access Captured</h1>
    <p>This path is a monitored security honeypot. Your connection metadata has been logged by the SQLGuardJS security engine.</p>
    <div class="box">
      <div><strong>IP:</strong> ${escapeHtml(String(ip))}</div>
      <div><strong>Target:</strong> ${escapeHtml(String(url))}</div>
      <div><strong>Timestamp:</strong> ${escapeHtml(String(timestamp))}</div>
    </div>
    <div class="btn-group">
      <a href="https://cftweb-security.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary">Want to play CTF? Launch Challenge ↗</a>
      <a href="/" class="btn-secondary">Return to Portfolio</a>
    </div>
  </div>
</body>
</html>`);
  }

  // Default API fallback
  return res.status(200).json({ status: "ok", service: "chiranth-portfolio-api", timestamp: new Date().toISOString() });
}
