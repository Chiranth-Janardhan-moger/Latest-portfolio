import React, { useState, useEffect } from 'react';
import { Terminal, Home, BookOpen, MessageSquare, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  invalidPath: string;
  onNavigate: (view: 'portfolio' | 'blog' | 'contact') => void;
}

export default function NotFoundView({ invalidPath, onNavigate }: NotFoundViewProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [ambient, setAmbient] = useState(0);

  // Hook up physical keyboard triggers for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'g' || key === 'h') {
        onNavigate('portfolio');
      } else if (key === 'b') {
        onNavigate('blog');
      } else if (key === 'c') {
        onNavigate('contact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  // Track mouse position relative to center of screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      // Scale coordinates to maximum displacement in pixels (up to 30px translation)
      setMouseOffset({ x: x * 35, y: y * 35 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Soft continuous ambient oscillation so it vibrates even when mouse is still
  useEffect(() => {
    let frame: number;
    const tick = () => {
      setAmbient(Math.sin(Date.now() / 120) * 1.5);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-10 animate-fade-in max-w-2xl mx-auto" id="not-found-container">
      {/* Hero Glitch 404 Outlined Text */}
      <div className="relative group select-none py-6 cursor-default" id="glitch-wrapper">
        {/* Underlay Chromatic Aberration 1: Red Glitch Offset (Mouse-controlled & Skewed) */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl font-black tracking-widest text-red-500/30 font-mono opacity-70 pointer-events-none"
          style={{ 
            WebkitTextStroke: '2px rgba(239, 68, 68, 0.4)',
            transform: `translate(${-mouseOffset.x + ambient}px, ${-mouseOffset.y - ambient}px) skew(${-mouseOffset.x * 0.6}deg) scale(${1 + Math.abs(mouseOffset.x) * 0.005})`,
            transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          aria-hidden="true"
        >
          404
        </div>

        {/* Underlay Chromatic Aberration 2: Cyan Glitch Offset (Mouse-controlled & Opposite Skew) */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl font-black tracking-widest text-cyan-400/30 font-mono opacity-70 pointer-events-none"
          style={{ 
            WebkitTextStroke: '2px rgba(34, 211, 238, 0.4)',
            transform: `translate(${mouseOffset.x - ambient}px, ${mouseOffset.y + ambient}px) skew(${mouseOffset.x * 0.6}deg) scale(${1 + Math.abs(mouseOffset.y) * 0.005})`,
            transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          aria-hidden="true"
        >
          404
        </div>

        {/* Main Clean Outline 404 text - crisp and fully legible */}
        <div 
          className="relative text-8xl sm:text-9xl font-black tracking-widest text-transparent font-mono transition-transform duration-300 group-hover:scale-105"
          style={{ 
            WebkitTextStroke: '2px var(--color-ink, currentColor)',
            color: 'transparent'
          }}
          id="main-outlined-404"
        >
          404
        </div>
      </div>

      {/* Diagnostic Message */}
      <div className="space-y-4 px-4" id="diagnostic-header">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full font-mono text-[10px] uppercase tracking-wider" id="panic-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>Error: Segmentation Fault</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink" id="not-found-title">
          Address Space Dereferenced
        </h1>

        <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed" id="not-found-desc">
          The requested memory segment or route <code className="bg-line/20 px-1.5 py-0.5 rounded text-ink font-mono font-bold break-all">"{invalidPath || '/'}"</code> points to an unmapped memory page.
        </p>
      </div>

      {/* Safe Navigation & Recovery Menu */}
      <div className="w-full pt-4 space-y-6" id="navigation-menu">
        <div className="flex items-center justify-center gap-2 text-ink-soft border-b border-line/40 pb-2 max-w-xs mx-auto" id="diagnostic-footer-label">
          <Terminal size={12} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
            Recovery Subsystem
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 w-full" id="navigation-grid">
          <button
            onClick={() => onNavigate('portfolio')}
            className="border border-line hover:border-ink rounded-lg p-4 bg-paper hover:bg-cream/20 text-left transition-all duration-300 group cursor-pointer flex flex-col justify-between h-28"
            id="btn-recover-portfolio"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink uppercase tracking-wider text-[10px] font-mono">
                  [G] - Safe Reboot
                </span>
                <Home size={14} className="text-ink-soft group-hover:text-ink transition-colors" />
              </div>
              <p className="text-[10px] text-ink-soft leading-normal">
                Restart the virtual page registry and boot safely back into the primary Portfolio dashboard.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('blog')}
            className="border border-line hover:border-ink rounded-lg p-4 bg-paper hover:bg-cream/20 text-left transition-all duration-300 group cursor-pointer flex flex-col justify-between h-28"
            id="btn-recover-blog"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink uppercase tracking-wider text-[10px] font-mono">
                  [B] - View Logs
                </span>
                <BookOpen size={14} className="text-ink-soft group-hover:text-ink transition-colors" />
              </div>
              <p className="text-[10px] text-ink-soft leading-normal">
                Bypass routing checks to load developer logs, journals, and security research dossiers.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="border border-line hover:border-ink rounded-lg p-4 bg-paper hover:bg-cream/20 text-left transition-all duration-300 group cursor-pointer flex flex-col justify-between h-28"
            id="btn-recover-contact"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink uppercase tracking-wider text-[10px] font-mono">
                  [C] - Ping Admin
                </span>
                <MessageSquare size={14} className="text-ink-soft group-hover:text-ink transition-colors" />
              </div>
              <p className="text-[10px] text-ink-soft leading-normal">
                Establish a telemetry bridge to transmit error parameters and send a message directly to Chiranth.
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={() => onNavigate('portfolio')}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider hover:underline text-ink-soft hover:text-ink transition-colors"
          id="btn-back-to-home"
        >
          <ArrowLeft size={12} />
          Return to root
        </button>
      </div>
    </div>
  );
}
