import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Smartphone, Newspaper, MessageSquare } from 'lucide-react';
import PortfolioView from './components/PortfolioView';
import MobileAppsView from './components/MobileAppsView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import NotFoundView from './components/NotFoundView';
import FluidDotGrid from './components/FluidDotGrid';
import FluidCloud from './components/FluidCloud';
import { triggerFluidCloud } from './utils/fluidCloud';

type ViewMode = 'portfolio' | 'apps' | 'blog' | 'contact' | 'not-found';

// Path parsing helper
function parsePathToView(pathname: string, hash: string): { view: ViewMode; appId?: string | null; blogSlug?: string | null; invalidPath?: string } {
  // Check hash fallback first in case user arrived with a legacy #link
  const cleanHash = hash.replace('#', '').toLowerCase();
  if (cleanHash === 'portfolio') return { view: 'portfolio' };
  if (cleanHash === 'apps' || cleanHash === 'mobile') return { view: 'apps' };
  if (cleanHash === 'blog') return { view: 'blog' };
  if (cleanHash === 'contact') return { view: 'contact' };

  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

  if (cleanPath === '/' || cleanPath === '/portfolio' || cleanPath === '/index.html') {
    return { view: 'portfolio' };
  }
  if (cleanPath === '/apps' || cleanPath === '/app' || cleanPath === '/mobile') {
    return { view: 'apps', appId: null };
  }
  if (cleanPath.startsWith('/apps/') || cleanPath.startsWith('/app/')) {
    const segments = cleanPath.split('/');
    const appId = segments[segments.length - 1] || null;
    return { view: 'apps', appId };
  }
  if (cleanPath === '/blog') {
    return { view: 'blog', blogSlug: null };
  }
  if (cleanPath.startsWith('/blog/')) {
    const segments = cleanPath.split('/');
    const blogSlug = segments[segments.length - 1] || null;
    return { view: 'blog', blogSlug };
  }
  if (cleanPath === '/contact') {
    return { view: 'contact' };
  }
  if (cleanPath.startsWith('/api') || cleanPath.startsWith('/assets')) {
    return { view: 'portfolio' };
  }

  return { view: 'not-found', invalidPath: pathname };
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>(() => {
    return parsePathToView(window.location.pathname, window.location.hash).view;
  });

  const [activeAppId, setActiveAppId] = useState<string | null>(() => {
    return parsePathToView(window.location.pathname, window.location.hash).appId || null;
  });

  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(() => {
    return parsePathToView(window.location.pathname, window.location.hash).blogSlug || null;
  });

  const [invalidPath, setInvalidPath] = useState<string>(() => {
    return parsePathToView(window.location.pathname, window.location.hash).invalidPath || '';
  });

  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(() => !window.navigator.onLine);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Clean legacy hashes and normalize URL to clean paths on initial mount
  useEffect(() => {
    const { view, appId, blogSlug, invalidPath: badPath } = parsePathToView(window.location.pathname, window.location.hash);
    setActiveView(view);
    setActiveAppId(appId || null);
    setActiveBlogSlug(blogSlug || null);
    if (badPath) {
      setInvalidPath(badPath);
    } else {
      setInvalidPath('');
    }

    // Normalize URL path in browser address bar without hashes
    let targetPath = '/';
    if (view === 'apps') targetPath = appId ? `/app/${appId}` : '/apps';
    else if (view === 'blog') targetPath = blogSlug ? `/blog/${blogSlug}` : '/blog';
    else if (view === 'contact') targetPath = '/contact';
    else if (view === 'portfolio') targetPath = '/';

    if (window.location.hash || window.location.pathname === '/portfolio') {
      window.history.replaceState({}, '', targetPath);
    }
  }, []);

  // Handle browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const { view, appId, blogSlug, invalidPath: badPath } = parsePathToView(window.location.pathname, window.location.hash);
      setActiveView(view);
      setActiveAppId(appId || null);
      setActiveBlogSlug(blogSlug || null);
      if (badPath) {
        setInvalidPath(badPath);
      } else {
        setInvalidPath('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll direction detection for minimizing bottom dock
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      if (scrollY > lastScrollY && scrollY > 80) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Monitor network connection for offline reliability
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      triggerFluidCloud({
        title: "Connection Restored",
        subtitle: "Online and ready",
        icon: "check",
        type: "success"
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      triggerFluidCloud({
        title: "Connection Lost",
        subtitle: "Running offline via Service Worker",
        icon: "alert",
        type: "warning"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global clipboard copy event listener for Dynamic Island
  useEffect(() => {
    const handleGlobalCopy = () => {
      const selected = window.getSelection()?.toString().trim();
      const preview = selected
        ? selected.length > 32
          ? `"${selected.substring(0, 29)}..."`
          : `"${selected}"`
        : 'Copied to clipboard';

      triggerFluidCloud({
        title: "Copied successfully",
        subtitle: preview,
        icon: "check",
        type: "success",
        duration: 2600,
      });
    };

    document.addEventListener('copy', handleGlobalCopy);
    return () => document.removeEventListener('copy', handleGlobalCopy);
  }, []);

  // Visit counter & console badge
  useEffect(() => {
    console.log(
      "%c🕵️‍♂️ Ah, a fellow engineer. Looking for vulnerabilities or just checking my React structure? Either way, you can find the raw source code here: github.com/Chiranth-Janardhan-moger",
      "color: #10b981; font-size: 14px; font-weight: bold; font-family: monospace;"
    );

    fetch('/api/visits')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === 'number') {
          setVisitCount(data.count);
        }
      })
      .catch((err) => console.error('Failed to fetch visit count:', err));
  }, []);

  // Clean path-based navigation handler
  const handleNav = (view: ViewMode, appId?: string | null, blogSlug?: string | null) => {
    setActiveView(view);
    setActiveAppId(appId || null);
    setActiveBlogSlug(blogSlug || null);
    setInvalidPath('');

    // OxygenOS / OriginOS Fluid Cloud dynamic morphing status
    if (view === 'portfolio') triggerFluidCloud({ title: "Portfolio", subtitle: "Systems, Compilers & Security", icon: "user", type: "info" });
    else if (view === 'apps') triggerFluidCloud({ title: appId ? `App · ${appId.toUpperCase()}` : "Mobile Engineering", subtitle: "Offline Engines & Android Architecture", icon: "smartphone", type: "info" });
    else if (view === 'blog') triggerFluidCloud({ title: blogSlug ? `Blog · ${blogSlug.toUpperCase()}` : "Blog", subtitle: "Deep Dives & Technical Papers", icon: "newspaper", type: "info" });
    else if (view === 'contact') triggerFluidCloud({ title: "Direct Contact Gateway", subtitle: "chiranthmoger7@gmail.com", icon: "contact", type: "info" });

    let targetPath = '/';
    if (view === 'apps') targetPath = appId ? `/app/${appId}` : '/apps';
    else if (view === 'blog') targetPath = blogSlug ? `/blog/${blogSlug}` : '/blog';
    else if (view === 'contact') targetPath = '/contact';
    else if (view === 'portfolio') targetPath = '/';
    else if (view === 'not-found') targetPath = '/404';

    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-ink pb-28 font-sans selection:bg-ink selection:text-paper relative" id="app-root">

      {/* OriginOS & OxygenOS Fluid Cloud Dynamic Status Pill */}
      <FluidCloud />

      {/* Fluid Interactive Dot Grid Background */}
      <FluidDotGrid />

      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 font-mono text-[9px] sm:text-[10px] py-1.5 text-center select-none z-50 flex items-center justify-center gap-2" id="offline-banner">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span>SYSTEM_OFFLINE: LOCAL SERVICE_WORKER ACTIVE // OFFLINE_SANDBOX SHIELD ENGAGED</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16" id="content-wrapper">
        
        {/* View Router with native CSS-driven fade-in animations */}
        <main id="app-main-content">
          <div key={activeView} className="animate-fade-in" id={`view-wrapper-${activeView}`}>
            {activeView === 'portfolio' && (
              <PortfolioView 
                onNavigateToContact={() => handleNav('contact')} 
                onNavigateToApps={(appId) => handleNav('apps', appId)}
              />
            )}
            {activeView === 'apps' && (
              <MobileAppsView 
                initialAppId={activeAppId} 
                onSelectApp={(appId) => {
                  setActiveAppId(appId);
                  const targetPath = appId ? `/app/${appId}` : '/apps';
                  window.history.pushState({}, '', targetPath);
                }} 
              />
            )}
            {activeView === 'blog' && (
              <BlogView 
                initialBlogSlug={activeBlogSlug}
                onSelectBlog={(slug) => {
                  setActiveBlogSlug(slug);
                  const targetPath = slug ? `/blog/${slug}` : '/blog';
                  window.history.pushState({}, '', targetPath);
                }}
              />
            )}
            {activeView === 'contact' && (
              <ContactView />
            )}
            {activeView === 'not-found' && (
              <NotFoundView invalidPath={invalidPath} onNavigate={handleNav} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-line/60 flex flex-row justify-between items-center gap-3 font-mono text-[10px] text-ink-soft" id="app-footer">
          <span>© 2026 Chiranth Moger</span>
          {visitCount !== null && (
            <div className="flex items-center gap-1.5" id="visit-counter" title="Total visits counter">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
              <span>visits: {visitCount} {isOffline && '(cached offline)'}</span>
            </div>
          )}
        </footer>

      </div>

      {/* Floating Sticky Bottom Dock Navigation - Clean Path-Based Tabs */}
      <nav 
        className={`fixed bottom-6 left-1/2 bg-white/70 backdrop-blur-xl border border-line/80 rounded-full p-1.5 shadow-xl z-40 flex items-center gap-1 transition-all duration-300 ease-out ${
          isMinimized ? 'scale-95 px-2' : ''
        }`}
        style={{ 
          boxShadow: '0 10px 25px -5px rgba(17, 17, 17, 0.05), 0 8px 10px -6px rgba(17, 17, 17, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          transform: isMinimized ? 'translateX(-50%) translateY(20px)' : 'translateX(-50%) translateY(0px)',
          opacity: isMinimized ? 0.5 : 1
        }}
        id="sticky-bottom-dock"
      >
        {(['portfolio', 'apps', 'blog', 'contact'] as const).map((view) => {
          const isActive = activeView === view;
          const label = view === 'portfolio' ? 'Portfolio' : view === 'apps' ? 'Apps' : view === 'blog' ? 'Blog' : 'Contact';
          const Icon = view === 'portfolio' ? User : view === 'apps' ? Smartphone : view === 'blog' ? Newspaper : MessageSquare;
          
          return (
            <motion.button
              key={view}
              onClick={() => handleNav(view)}
              whileTap={{ scale: 0.92 }}
              className={`relative ${
                isMinimized ? 'px-3 py-2.5' : 'px-3.5 sm:px-4 pt-2.5 pb-3.5'
              } text-xs font-mono rounded-full transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer z-10 select-none ${
                isActive ? 'text-ink font-bold' : 'text-ink-soft hover:text-ink'
              }`}
              id={`dock-tab-${view}`}
              title={label}
              aria-label={`Navigate to ${label}`}
            >
              <div className="relative flex items-center justify-center">
                <Icon size={14} className={isActive ? 'text-ink' : 'text-ink-soft'} />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute top-[18px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ink animate-pulse"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              <span className={`transition-all duration-300 ease-out overflow-hidden flex items-center ${
                isMinimized 
                  ? 'max-w-0 opacity-0' 
                  : isActive 
                    ? 'max-w-[100px] opacity-100' 
                    : 'max-w-0 opacity-0 sm:max-w-[100px] sm:opacity-100'
              }`}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>

    </div>
  );
}
