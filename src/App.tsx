import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Newspaper, MessageSquare } from 'lucide-react';
import PortfolioView from './components/PortfolioView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import NotFoundView from './components/NotFoundView';

type ViewMode = 'portfolio' | 'blog' | 'contact' | 'not-found';

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'portfolio' || hash === 'blog' || hash === 'contact') {
      return hash as ViewMode;
    } else if (hash) {
      return 'not-found';
    }
    const pathname = window.location.pathname;
    if (pathname !== '/' && pathname !== '/index.html' && !pathname.startsWith('/api')) {
      return 'not-found';
    }
    return 'portfolio';
  });

  const [invalidPath, setInvalidPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'portfolio' && hash !== 'blog' && hash !== 'contact') {
      return '#' + hash;
    }
    const pathname = window.location.pathname;
    if (pathname !== '/' && pathname !== '/index.html' && !pathname.startsWith('/api')) {
      return pathname;
    }
    return '';
  });

  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(() => !window.navigator.onLine);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

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

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Sync active view on external hash changes (e.g., forward/back button, page load)
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'portfolio' || hash === 'blog' || hash === 'contact') {
        setActiveView(hash as ViewMode);
        setInvalidPath('');
      } else if (hash) {
        setActiveView('not-found');
        setInvalidPath('#' + hash);
      } else {
        const pathname = window.location.pathname;
        if (pathname !== '/' && pathname !== '/index.html' && !pathname.startsWith('/api')) {
          setActiveView('not-found');
          setInvalidPath(pathname);
        } else {
          setActiveView('portfolio');
          setInvalidPath('');
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  // Switch navigation helper
  const handleNav = (view: ViewMode) => {
    setActiveView(view);
    if (view === 'not-found') {
      window.location.hash = '404';
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-ink pb-28 font-sans selection:bg-ink selection:text-paper" id="app-root">

      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 font-mono text-[9px] sm:text-[10px] py-1.5 text-center select-none z-50 flex items-center justify-center gap-2" id="offline-banner">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span>SYSTEM_OFFLINE: LOCAL SERVICE_WORKER ACTIVE // OFFLINE_SANDBOX SHIELD ENGAGED</span>
        </div>
      )}

      {/* Floating subtle coordinates in corners for tech theme aesthetics */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-red-500/80 pointer-events-none select-none hidden sm:block" id="coords-top-left">
        LAT: 13.0827° N / LON: 77.5806° E · BENGALURU
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] text-red-500/80 pointer-events-none select-none hidden sm:block" id="coords-top-right">
        {activeView === 'not-found' 
          ? 'SYS_STATUS: CRITICAL_PANIC // ε = NaN' 
          : isOffline 
            ? 'SYS_STATUS: OFFLINE_SANDBOX_ACTIVE // ε = 0.0' 
            : 'SYS_STATUS: ONLINE // ε = 0.1'}
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16" id="content-wrapper">
        
        {/* View Router with native CSS-driven fade-in animations */}
        <main id="app-main-content">
          <div key={activeView} className="animate-fade-in" id={`view-wrapper-${activeView}`}>
            {activeView === 'portfolio' && (
              <PortfolioView onNavigateToContact={() => handleNav('contact')} />
            )}
            {activeView === 'blog' && (
              <BlogView />
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

      {/* Floating Sticky Bottom Dock Navigation - Premium Interactive Sliding Pill Tabs */}
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
        {(['portfolio', 'blog', 'contact'] as const).map((view) => {
          const isActive = activeView === view;
          const label = view === 'portfolio' ? 'Portfolio' : view === 'blog' ? 'Blog' : 'Contact';
          const Icon = view === 'portfolio' ? User : view === 'blog' ? Newspaper : MessageSquare;
          
          return (
            <motion.button
              key={view}
              onClick={() => handleNav(view)}
              whileTap={{ scale: 0.92 }}
              className={`relative ${
                isMinimized ? 'px-3 py-2.5' : 'px-4 sm:px-5 pt-2.5 pb-3.5'
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
