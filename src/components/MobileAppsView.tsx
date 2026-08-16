import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Github, 
  Download, 
  CheckCircle2, 
  ChevronLeft,
  Lock,
  AlertTriangle,
  Eye,
  Key,
  Clock,
  Radio,
  FileCode,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { MOBILE_APPS } from '../data';
import { MobileApp } from '../types';

interface MobileAppsViewProps {
  initialAppId?: string | null;
  onSelectApp?: (appId: string | null) => void;
}

export default function MobileAppsView({ initialAppId, onSelectApp }: MobileAppsViewProps = {}) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(() => {
    if (initialAppId) return initialAppId;
    const path = window.location.pathname.toLowerCase();
    if (path === '/app/vaultx' || path === '/apps/vaultx') return 'vaultx';
    if (path === '/app/connectme' || path === '/apps/connectme') return 'connectme';
    if (path.startsWith('/app/')) return path.split('/app/')[1] || null;
    if (path.startsWith('/apps/')) return path.split('/apps/')[1] || null;
    return null;
  });

  useEffect(() => {
    if (initialAppId !== undefined) {
      setSelectedAppId(initialAppId);
    }
  }, [initialAppId]);

  const handleSelectApp = (id: string | null) => {
    setSelectedAppId(id);
    if (onSelectApp) {
      onSelectApp(id);
    } else {
      const targetPath = id ? `/app/${id}` : '/apps';
      window.history.pushState({}, '', targetPath);
    }
  };

  // Sync with window scroll on open
  useEffect(() => {
    if (selectedAppId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedAppId]);

  const selectedApp = MOBILE_APPS.find(app => app.id === selectedAppId);

  // Custom Android Icon SVG Component
  const AndroidIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.1 12 8.1s-3.5902.3116-5.1368.8497L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
    </svg>
  );

  // Render simulated high-fidelity mobile UI screens
  const renderScreenMockup = (type: string, appId: string) => {
    if (appId === 'vaultx') {
      if (type === 'pin') {
        return (
          <div className="bg-[#0f141c] text-white p-5 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-sans">
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Encrypted</span>
              </div>
            </div>

            <div className="text-center my-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 mx-auto flex items-center justify-center">
                <Lock size={22} className="text-blue-400" />
              </div>
              <h4 className="text-sm font-bold tracking-tight">Enter Master PIN</h4>
              <p className="text-[11px] text-gray-400">AES-256 Memory Guard Active</p>
              
              {/* PIN Dots */}
              <div className="flex justify-center gap-3 pt-2">
                {[1, 2, 3, 4, 5, 6].map((dot, i) => (
                  <span 
                    key={dot} 
                    className={`w-3 h-3 rounded-full border border-blue-400/50 ${i < 4 ? 'bg-blue-400' : 'bg-transparent'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-400 pt-2 border-t border-white/10 font-mono">
              <span className="text-blue-400 cursor-pointer">Use Biometrics</span>
              <span>v1.3.4</span>
            </div>
          </div>
        );
      }

      if (type === 'vault') {
        return (
          <div className="bg-[#0f141c] text-white p-5 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-sans">
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
              <span className="font-bold text-white">Vault Items</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">18 Stored</span>
            </div>

            <div className="space-y-2.5 my-auto">
              {/* Item 1 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center font-bold text-xs text-red-400">
                    G
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-gray-200">Google Workspace</span>
                    <span className="text-[10px] text-gray-400 font-mono">chiranth@...com</span>
                  </div>
                </div>
                <Key size={13} className="text-gray-400" />
              </div>

              {/* Item 2 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400">
                    S
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-gray-200">SSH Server Key</span>
                    <span className="text-[10px] text-gray-400 font-mono">root@prod-01</span>
                  </div>
                </div>
                <Key size={13} className="text-gray-400" />
              </div>

              {/* Item 3 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
                    B
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-gray-200">Bank Portal PIN</span>
                    <span className="text-[10px] text-gray-400 font-mono">•••• ••••</span>
                  </div>
                </div>
                <Key size={13} className="text-gray-400" />
              </div>
            </div>

            <div className="text-[10px] text-center text-gray-400 font-mono">
              Auto-wipe clipboard in 30s
            </div>
          </div>
        );
      }

      if (type === 'totp') {
        return (
          <div className="bg-[#0f141c] text-white p-5 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-sans">
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
              <span className="font-bold text-white">2FA Authenticator</span>
              <Clock size={13} className="text-blue-400 animate-pulse" />
            </div>

            <div className="space-y-3 my-auto">
              <div className="bg-white/5 border border-blue-500/30 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-300">GitHub (Security)</span>
                  <span className="text-[10px] text-blue-400 font-mono">24s left</span>
                </div>
                <div className="text-2xl font-mono font-bold tracking-widest text-blue-400">
                  849 201
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-300">AWS Root Cloud</span>
                  <span className="text-[10px] text-emerald-400 font-mono">11s left</span>
                </div>
                <div className="text-2xl font-mono font-bold tracking-widest text-emerald-400">
                  312 994
                </div>
              </div>
            </div>

            <div className="text-[10px] text-center text-gray-400 font-mono">
              100% Offline HMAC-SHA1 Generation
            </div>
          </div>
        );
      }
    }

    // ConnectMe Mobile screens
    if (type === 'map') {
      return (
        <div className="bg-[#1a2332] text-white p-5 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-sans relative overflow-hidden">
          {/* Simulated Map Background Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Map Polyline Representation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full opacity-40" viewBox="0 0 300 300">
              <path d="M 30,220 Q 150,80 270,180" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="6 4" />
            </svg>
          </div>

          {/* Top Info Bar */}
          <div className="relative z-10 flex justify-between items-center bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <Radio size={12} className="text-emerald-400 animate-ping" />
              <span>Route 4: BMSIT Central</span>
            </div>
            <span className="text-emerald-400 font-bold">LIVE 1Hz</span>
          </div>

          {/* Bus Avatar Marker on Map */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
              <span className="text-white font-mono text-xs font-bold">BUS</span>
            </div>
            <span className="bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono mt-1 border border-white/20">
              Shuttle #02 · Kalman Smoothed
            </span>
          </div>

          {/* Bottom Card */}
          <div className="relative z-10 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400 text-[10px] block">Next Arrival</span>
              <span className="font-bold text-sm text-white">Academic Block A</span>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-sm">3 MINS</span>
          </div>
        </div>
      );
    }

    if (type === 'schedule') {
      return (
        <div className="bg-[#1a2332] text-white p-5 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-sans">
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
            <span className="font-bold text-white">Transit Timeline</span>
            <span className="text-blue-400">3 Active Shuttles</span>
          </div>

          <div className="space-y-3 my-auto font-mono text-xs">
            <div className="flex items-start gap-3 border-l-2 border-emerald-400 pl-3">
              <div>
                <span className="text-emerald-400 text-[10px] block font-bold">CURRENT STOP</span>
                <span className="font-semibold text-white">Main Campus Gate</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Departed: 9:42 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-l-2 border-blue-400 pl-3">
              <div>
                <span className="text-blue-400 text-[10px] block font-bold">NEXT STOP · 3 MIN</span>
                <span className="font-semibold text-white">ISE / CSE Block</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">ETA: 9:45 AM (Calculated)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-l-2 border-gray-600 pl-3 opacity-60">
              <div>
                <span className="text-gray-400 text-[10px] block">FINAL TERMINUS</span>
                <span className="font-semibold text-white">Hostel Complex</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">ETA: 9:52 AM</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-gray-400 font-mono">
            Offline SQLite Schedule Fallback Available
          </div>
        </div>
      );
    }

    if (type === 'editor') {
      return (
        <div className="bg-[#0e1117] text-white p-4 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-mono text-[11px]">
          {/* Top Code Editor Bar */}
          <div className="flex justify-between items-center text-gray-400 border-b border-gray-800 pb-2">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <FileCode size={13} />
              <span>paper.tex</span>
            </span>
            <span className="text-emerald-400 text-[10px] bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">AST SYNTAX OK</span>
          </div>

          {/* Code lines */}
          <div className="space-y-1 my-auto text-[10px] leading-relaxed overflow-hidden">
            <div className="text-gray-500"><span className="inline-block w-4 text-gray-600">1</span><span className="text-purple-400">\documentclass</span><span className="text-gray-300">{"{article}"}</span></div>
            <div className="text-gray-500"><span className="inline-block w-4 text-gray-600">2</span><span className="text-purple-400">\usepackage</span><span className="text-gray-300">{"{amsmath, amssymb}"}</span></div>
            <div className="text-gray-500"><span className="inline-block w-4 text-gray-600">3</span><span className="text-blue-400">\begin</span><span className="text-gray-300">{"{document}"}</span></div>
            <div className="text-gray-500"><span className="inline-block w-4 text-gray-600">4</span>  <span className="text-yellow-400">\section</span><span className="text-gray-300">{"{Tensor Field Theory}"}</span></div>
            <div className="text-gray-500"><span className="inline-block w-4 text-gray-600">5</span>  <span className="text-blue-400">\begin</span><span className="text-gray-300">{"{equation}"}</span></div>
            <div className="text-gray-300 bg-indigo-950/50 p-1 rounded border border-indigo-500/20"><span className="inline-block w-4 text-gray-600">6</span>    <span className="text-pink-400">R_{"\\mu\\nu"}</span> - <span className="text-cyan-400">{"\\frac{1}{2}"}</span>R g_{"\\mu\\nu"} = <span className="text-cyan-400">{"\\frac{8\\pi G}{c^4}"}</span> T_{"\\mu\\nu"}</div>
            <div className="text-gray-500"><span className="inline-block w-4 text-gray-600">7</span>  <span className="text-blue-400">\end</span><span className="text-gray-300">{"{equation}"}</span></div>
          </div>

          {/* Quick Math Toolbar */}
          <div className="flex items-center gap-1.5 border-t border-gray-800 pt-2 overflow-x-auto text-[10px]">
            {['\\frac', '\\sum', '\\int', '\\alpha', '\\beta', '\\partial', '$...$'].map((sym, idx) => (
              <span key={idx} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300 border border-gray-700/50 shrink-0">
                {sym}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (type === 'compiler') {
      return (
        <div className="bg-[#121824] text-white p-4 rounded-2xl border border-line/60 h-80 flex flex-col justify-between select-none shadow-inner font-sans">
          {/* Top status */}
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono border-b border-gray-800 pb-2">
            <span className="text-purple-400 font-bold flex items-center gap-1.5">
              <Zap size={13} />
              <span>TECTONIC ON-DEVICE</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">COMPILED (0.18s)</span>
          </div>

          {/* Vector PDF Preview Canvas */}
          <div className="bg-white text-black p-3.5 rounded-xl shadow-md my-auto space-y-2 border border-gray-300">
            <div className="text-center border-b border-gray-200 pb-1">
              <span className="font-serif font-bold text-xs block">Tensor Field Theory</span>
              <span className="text-[9px] text-gray-500 font-serif">Compiled locally · PDF/X-1a</span>
            </div>
            <div className="text-center py-2 font-serif text-sm">
              <span className="italic">R<sub>μν</sub> - ½ R g<sub>μν</sub> = 8πG/c⁴ T<sub>μν</sub></span>
            </div>
            <div className="text-[8px] text-gray-500 font-serif leading-tight">
              Where G represents Newton's constant and T_μν denotes the stress-energy tensor.
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
            <span>0 Network Requests</span>
            <span className="text-indigo-400 font-semibold">PDF Export Ready</span>
          </div>
        </div>
      );
    }

    return null;
  };

  // If an app is selected, display its comprehensive dedicated deep-dive page
  if (selectedApp) {
    return (
      <div className="py-8 space-y-12 animate-fade-in" id="app-detail-view">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-line/80 pb-4" id="app-detail-nav">
          <button
            onClick={() => handleSelectApp(null)}
            className="w-9 h-9 rounded-full border border-line/80 bg-white/80 backdrop-blur-md hover:bg-ink hover:text-paper flex items-center justify-center text-ink shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
            id="btn-back-to-apps"
            title="Back"
            aria-label="Back"
          >
            <ChevronLeft size={18} className="text-current transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
          <span className="font-mono text-xs text-ink-soft">
            Apps / <span className="text-ink font-semibold">{selectedApp.name}</span>
          </span>
        </div>

        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-line/80 pb-8" id="app-hero-header">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-line/80 bg-white p-2.5 shadow-md flex items-center justify-center shrink-0">
              {selectedApp.iconUrl ? (
                <img
                  src={selectedApp.iconUrl}
                  alt={`${selectedApp.name} icon`}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <Smartphone size={36} className="text-ink" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                  {selectedApp.name}
                </h1>
                {selectedApp.version && (
                  <span className="font-mono text-[11px] text-ink-soft border border-line/80 rounded-full px-2.5 py-0.5 bg-neutral-100 shadow-2xs select-none">
                    {selectedApp.version}
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-ink-soft mt-1">
                {selectedApp.category} · {selectedApp.tagline}
              </p>
            </div>
          </div>

          {/* Apple SF Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs w-full sm:w-auto">
            {selectedApp.githubUrl && (
              <a
                href={selectedApp.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-line/80 bg-white/80 backdrop-blur-md rounded-full px-4 py-2.5 hover:border-ink hover:bg-ink hover:text-paper hover:-translate-y-0.5 active:scale-95 shadow-2xs transition-all duration-200 ease-out btn-sweep"
                id="btn-app-source-detail"
              >
                <Github size={14} />
                <span>Source Code</span>
              </a>
            )}
            <a
              href={selectedApp.apkUrl || selectedApp.githubUrl + '/releases'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-ink text-paper rounded-full px-5 py-2.5 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out btn-sweep font-semibold"
              id="btn-app-apk-download"
            >
              <AndroidIcon size={14} className="text-paper shrink-0" />
              <span>Download APK</span>
            </a>
          </div>
        </div>

        {/* About the Application */}
        <section className="space-y-4" id="app-about-section">
          <h2 className="text-lg font-bold text-ink">
            About the Application
          </h2>
          <p className="text-sm sm:text-[15px] text-ink-soft leading-relaxed max-w-[70ch]">
            {selectedApp.detailedAbout || selectedApp.desc}
          </p>
        </section>

        {/* Problem Faced Card */}
        <section className="space-y-4" id="app-problem-faced-section">
          <div className="relative group/problem border border-line/80 rounded-2xl p-6 bg-white/80 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-ink shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] hover:shadow-md">
            {/* Animated Left Border Line */}
            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-ink scale-y-0 group-hover/problem:scale-y-100 origin-top transition-transform duration-500 ease-out pointer-events-none" />

            <div className="flex items-center gap-2 text-ink font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <AlertTriangle size={15} className="text-ink shrink-0" />
              <span>Problem Faced</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              {selectedApp.problemStatement}
            </p>
          </div>
        </section>

        {/* UI Screenshots / Gallery */}
        {((selectedApp.screenshots && selectedApp.screenshots.length > 0) || (selectedApp.screenMockups && selectedApp.screenMockups.length > 0)) && (
          <section className="space-y-4" id="app-screens-section">
            <h2 className="text-lg font-bold text-ink">
              Screenshots
            </h2>

            {selectedApp.screenshots && selectedApp.screenshots.length > 0 ? (
              selectedApp.id === 'vaultx' ? (
                <div className="flex flex-col gap-8 pt-2">
                  {selectedApp.screenshots.map((src, idx) => (
                    <div 
                      key={idx} 
                      className="w-full flex justify-center items-center"
                    >
                      <img
                        src={src}
                        alt={`${selectedApp.name} Interface Screenshot ${idx + 1}`}
                        className="w-full h-auto max-h-[680px] object-contain rounded-2xl transition-transform duration-300 hover:scale-[1.005]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {selectedApp.screenshots.map((src, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-2xl border border-line/80 bg-[#0B0F17] overflow-hidden shadow-sm hover:border-ink transition-all duration-300 group/img flex flex-col justify-center items-center p-1.5"
                    >
                      <img
                        src={src}
                        alt={`${selectedApp.name} Interface Screenshot ${idx + 1}`}
                        className="w-full h-auto max-h-[480px] object-contain rounded-xl transition-transform duration-300 group-hover/img:scale-[1.01]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
                {selectedApp.screenMockups?.map((screen) => (
                  <div key={screen.id} className="rounded-2xl border-2 border-line bg-ink p-1.5 shadow-md hover:border-ink/80 transition-all duration-300">
                    {renderScreenMockup(screen.type, selectedApp.id)}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Comprehensive Capabilities Checklist */}
        <section className="space-y-4" id="app-features-section">
          <h2 className="text-lg font-bold text-ink">
            Key Features & Capabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedApp.features.map((feature, fIdx) => (
              <div
                key={fIdx}
                className="border border-line/80 rounded-xl p-4 bg-white/90 backdrop-blur-sm flex items-start gap-3 text-xs text-ink shadow-2xs hover:border-ink/60 transition-colors"
              >
                <CheckCircle2 size={15} className="text-ink shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Full Tech Stack */}
        <section className="space-y-3 pt-2" id="app-stack-section">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink-soft">
            Technologies & Frameworks
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedApp.stack.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="font-mono text-xs text-ink border border-line/80 rounded-full px-3.5 py-1 bg-white shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Default Grid View: Clean Apple Cards with Logo, Name, and Tagline Description
  return (
    <div className="py-8 space-y-10 animate-fade-in" id="mobile-apps-container">
      {/* Header */}
      <div className="border-b border-line/80 pb-6" id="mobile-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3" id="mobile-title">
          Mobile Applications
        </h1>
        <p className="text-sm sm:text-base text-ink-soft max-w-[65ch] leading-relaxed" id="mobile-subtitle">
          Engineered React Native and Android systems specializing in offline-first persistence, hardware-backed cryptography, and sub-second transit telemetry. Click any card to explore full architecture and UI screens.
        </p>
      </div>

      {/* Grid: 2 Clean Cards in One Row on Desktop / Tablets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="mobile-apps-grid">
        {MOBILE_APPS.map((app: MobileApp) => (
          <div
            key={app.id}
            onClick={() => handleSelectApp(app.id)}
            className="group border border-line/80 rounded-3xl bg-white/80 backdrop-blur-md overflow-hidden flex flex-col hover:border-ink transition-all duration-300 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] cursor-pointer"
            id={`app-card-${app.id}`}
          >
            {/* Top Showcase Banner with Big Logo */}
            <div className="w-full h-48 sm:h-52 bg-[#F7F6F2]/80 border-b border-line/80 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {/* Category in Corner */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="font-mono text-[10px] text-ink-soft bg-white/90 border border-line/80 px-2.5 py-1 rounded-full shadow-2xs">
                  {app.category}
                </span>
              </div>

              {/* Big App Logo */}
              <div className="relative z-10 w-22 h-22 sm:w-24 sm:h-24 rounded-2xl border border-line/80 bg-white p-2.5 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {app.iconUrl ? (
                  <img
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <Smartphone size={36} className="text-ink" />
                )}
              </div>
            </div>

            {/* Content Body: Just Name, Version Pill, and Tagline Description */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-ink tracking-tight" id={`app-name-${app.id}`}>
                      {app.name}
                    </h2>
                    {app.version && (
                      <span className="font-mono text-[10px] text-ink-soft border border-neutral-200 rounded-full px-2.5 py-0.5 bg-neutral-100 shadow-2xs select-none">
                        {app.version}
                      </span>
                    )}
                  </div>
                  <span className="w-8 h-8 rounded-full border border-line/80 bg-white group-hover:bg-ink group-hover:text-paper flex items-center justify-center text-ink shrink-0 transition-all duration-200 shadow-2xs">
                    <ArrowUpRight size={14} />
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-ink-soft mt-2.5 leading-relaxed">
                  {app.tagline}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
