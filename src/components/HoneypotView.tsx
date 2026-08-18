import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Home } from 'lucide-react';

interface HoneypotViewProps {
  invalidPath: string;
  onNavigate: (view: 'portfolio' | 'apps' | 'blog' | 'contact') => void;
}

export default function HoneypotView({ invalidPath, onNavigate }: HoneypotViewProps) {
  const [clientIp, setClientIp] = useState<string>('127.0.0.1');
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    setTimestamp(new Date().toISOString());

    fetch('/api/my-ip')
      .then(res => res.json())
      .then(data => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch(() => setClientIp('127.0.0.1'));
  }, []);

  return (
    <div className="py-8 sm:py-12 animate-fade-in max-w-xl mx-auto space-y-8" id="honeypot-container">
      <div className="rounded-3xl border border-black/[0.08] bg-white p-7 sm:p-10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.08)] flex flex-col items-center text-center relative overflow-hidden">
        
        {/* macOS Traffic Lights Header */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 shadow-2xs mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
          </div>
          <span className="text-[10.5px] font-mono font-semibold text-ink-soft">
            honeypot_shield // telemetry_trap
          </span>
        </div>

        {/* Honeypot Triggered Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-600 rounded-full font-mono text-[11px] font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Honeypot Triggered</span>
        </div>

        {/* Heading & Description */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-2">
          Nice try. This is a honeypot.
        </h1>
        <p className="text-xs sm:text-[13px] text-ink-soft leading-relaxed max-w-md mb-6">
          Your request triggered our security honeypot trap. Resource probes targeting private administrative namespaces are logged and analyzed to harden our defenses.
        </p>

        {/* Telemetry Diagnostics Card */}
        <div className="w-full bg-black/[0.025] border border-line/80 rounded-2xl p-4 sm:p-5 font-mono text-xs text-left space-y-2.5 mb-7">
          <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
            <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider">Probed Route</span>
            <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">{invalidPath || '/admin'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
            <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider">Source IP</span>
            <span className="text-ink font-semibold">{clientIp}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
            <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider">Timestamp</span>
            <span className="text-ink-soft text-[11px]">{timestamp}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider">Defense Core</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SQLGuardJS Armed
            </span>
          </div>
        </div>

        {/* Action Button Cluster: Stacked on Mobile, 65%/35% on Desktop */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full">
          <a
            href="https://cftweb-security.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-[65%] shrink-0 inline-flex items-center justify-center gap-1.5 bg-ink text-paper rounded-full py-2.5 px-4 text-xs font-semibold hover:bg-neutral-800 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-200 cursor-pointer btn-sweep whitespace-nowrap group"
          >
            <span>Want to play CTF? Launch Challenge</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="w-full sm:w-[35%] shrink-0 inline-flex items-center justify-center gap-1.5 bg-white border border-line/80 text-ink rounded-full py-2.5 px-4 text-xs font-semibold hover:bg-neutral-50 active:scale-95 shadow-2xs transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Home size={13} className="shrink-0" />
            <span>Return to Portfolio</span>
          </button>
        </div>

      </div>
    </div>
  );
}
