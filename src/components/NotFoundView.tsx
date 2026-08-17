import React, { useState, useEffect } from 'react';
import { Terminal, Home, BookOpen, MessageSquare, ArrowUpRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import TiltCard from './TiltCard';

interface NotFoundViewProps {
  invalidPath: string;
  onNavigate: (view: 'portfolio' | 'apps' | 'blog' | 'contact') => void;
}

export default function NotFoundView({ invalidPath, onNavigate }: NotFoundViewProps) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Keyboard shortcut recovery listener
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

  // Subtle interactive parallax offset
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMouseOffset({ x: x * 20, y: y * 20 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="py-8 sm:py-12 animate-fade-in max-w-2xl mx-auto space-y-8" id="not-found-container">
      {/* Apple-Style Frosted Glass Hero Container */}
      <div className="aquamorphic-card rounded-3xl border border-line/80 bg-white/80 backdrop-blur-2xl p-7 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] flex flex-col items-center text-center relative overflow-hidden">
        
        {/* macOS Traffic Light Status Capsule */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 shadow-2xs mb-8">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
          </div>
          <span className="text-[10.5px] font-mono font-semibold text-ink-soft">
            system_panic // 404_page_not_found
          </span>
        </div>

        {/* 404 Spatial Typography with Chromatic Glitch Effect */}
        <div 
          className="relative select-none py-2 transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`
          }}
          id="glitch-wrapper"
        >
          <div 
            className="glitch-text text-8xl sm:text-9xl font-black tracking-tight text-ink font-mono opacity-90 select-none cursor-pointer"
            data-text="404"
          >
            404
          </div>
        </div>

        {/* Diagnostic Heading & Details */}
        <div className="space-y-3 max-w-lg mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-600 rounded-full font-mono text-[10.5px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Unmapped Memory Address</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink" id="not-found-title">
            Page Not Found
          </h1>

          <p className="text-xs sm:text-[13px] text-ink-soft leading-relaxed" id="not-found-desc">
            The requested destination <code className="bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md text-ink font-mono text-[11px] font-semibold">{invalidPath || '/'}</code> does not exist on this server or has been relocated.
          </p>
        </div>

        {/* Primary Apple Pill Button */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-2 bg-ink text-paper rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-200 cursor-pointer btn-sweep"
            id="btn-return-home-pill"
          >
            <Home size={14} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Recovery Navigation Cluster (3 Apple Glass Mini Cards) */}
      <div className="space-y-3" id="navigation-menu">
        <div className="flex items-center justify-between px-2 text-ink-soft">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            Quick Recovery Shortcuts
          </span>
          <span className="font-mono text-[10px] text-ink-soft/70">
            Press [G], [B], or [C] on keyboard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5" id="navigation-grid">
          {/* Card 1: Safe Reboot */}
          <TiltCard
            onClick={() => onNavigate('portfolio')}
            className="aquamorphic-card border border-line/80 rounded-2xl p-4 sm:p-4.5 bg-white/80 backdrop-blur-md hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            id="btn-recover-portfolio"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-ink shadow-2xs group-hover:scale-105 transition-transform">
                <Home size={15} />
              </div>
              <kbd className="font-mono text-[10px] font-semibold bg-white border border-line/80 px-2 py-0.5 rounded-md text-ink shadow-2xs">
                G
              </kbd>
            </div>

            <div className="pt-2.5 border-t border-line/60 flex items-center justify-between text-ink gap-2">
              <h2 className="text-sm font-bold text-ink group-hover:text-ink-soft transition-colors truncate">
                Portfolio Home
              </h2>
              <span className="w-6 h-6 rounded-full border border-line/80 bg-white group-hover:bg-ink group-hover:text-paper flex items-center justify-center transition-all shadow-2xs shrink-0">
                <ArrowUpRight size={11} />
              </span>
            </div>
          </TiltCard>

          {/* Card 2: Research Logs */}
          <TiltCard
            onClick={() => onNavigate('blog')}
            className="aquamorphic-card border border-line/80 rounded-2xl p-4 sm:p-4.5 bg-white/80 backdrop-blur-md hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            id="btn-recover-blog"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-ink shadow-2xs group-hover:scale-105 transition-transform">
                <BookOpen size={15} />
              </div>
              <kbd className="font-mono text-[10px] font-semibold bg-white border border-line/80 px-2 py-0.5 rounded-md text-ink shadow-2xs">
                B
              </kbd>
            </div>

            <div className="pt-2.5 border-t border-line/60 flex items-center justify-between text-ink gap-2">
              <h2 className="text-sm font-bold text-ink group-hover:text-ink-soft transition-colors truncate">
                Research & Blog
              </h2>
              <span className="w-6 h-6 rounded-full border border-line/80 bg-white group-hover:bg-ink group-hover:text-paper flex items-center justify-center transition-all shadow-2xs shrink-0">
                <ArrowUpRight size={11} />
              </span>
            </div>
          </TiltCard>

          {/* Card 3: Direct Channel */}
          <TiltCard
            onClick={() => onNavigate('contact')}
            className="aquamorphic-card border border-line/80 rounded-2xl p-4 sm:p-4.5 bg-white/80 backdrop-blur-md hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            id="btn-recover-contact"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-ink shadow-2xs group-hover:scale-105 transition-transform">
                <MessageSquare size={15} />
              </div>
              <kbd className="font-mono text-[10px] font-semibold bg-white border border-line/80 px-2 py-0.5 rounded-md text-ink shadow-2xs">
                C
              </kbd>
            </div>

            <div className="pt-2.5 border-t border-line/60 flex items-center justify-between text-ink gap-2">
              <h2 className="text-sm font-bold text-ink group-hover:text-ink-soft transition-colors truncate">
                Ping Chiranth
              </h2>
              <span className="w-6 h-6 rounded-full border border-line/80 bg-white group-hover:bg-ink group-hover:text-paper flex items-center justify-center transition-all shadow-2xs shrink-0">
                <ArrowUpRight size={11} />
              </span>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
