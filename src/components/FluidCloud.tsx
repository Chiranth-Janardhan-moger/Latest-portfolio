import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, AlertTriangle, Sparkles, Shield, Smartphone, Newspaper, MessageSquare, Download, User } from 'lucide-react';
import { FluidCloudPayload } from '../utils/fluidCloud';

export default function FluidCloud() {
  const [activeAlert, setActiveAlert] = useState<FluidCloudPayload | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Keep live time updated every 1 second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to fluid cloud events across the application
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<FluidCloudPayload>;
      if (customEvent.detail) {
        clearTimeout(timeoutId);
        setActiveAlert(customEvent.detail);

        const duration = customEvent.detail.duration || 3200;
        timeoutId = setTimeout(() => {
          setActiveAlert(null);
        }, duration);
      }
    };

    window.addEventListener('fluid-cloud-event', handleEvent);
    return () => {
      window.removeEventListener('fluid-cloud-event', handleEvent);
      clearTimeout(timeoutId);
    };
  }, []);

  const getIcon = (type?: string, iconKey?: string) => {
    if (iconKey === 'user') return <User size={13} className="text-ink shrink-0" />;
    if (iconKey === 'check' || type === 'success') return <Check size={13} className="text-emerald-600 shrink-0" />;
    if (iconKey === 'shield') return <Shield size={13} className="text-blue-600 shrink-0" />;
    if (iconKey === 'smartphone') return <Smartphone size={13} className="text-purple-600 shrink-0" />;
    if (iconKey === 'newspaper') return <Newspaper size={13} className="text-amber-600 shrink-0" />;
    if (iconKey === 'contact') return <MessageSquare size={13} className="text-emerald-600 shrink-0" />;
    if (iconKey === 'download') return <Download size={13} className="text-indigo-600 shrink-0" />;
    if (iconKey === 'alert' || type === 'warning') return <AlertTriangle size={13} className="text-amber-600 shrink-0" />;
    if (iconKey === 'sparkles') return <Sparkles size={13} className="text-amber-500 shrink-0" />;
    return <Info size={13} className="text-ink-soft shrink-0" />;
  };

  return (
    <div className="fixed top-3.5 sm:top-4.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-center items-center select-none font-mono">
      <motion.div
        layout
        initial={{ y: -32, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          layout: { type: "spring", stiffness: 350, damping: 28, mass: 0.5 },
          y: { type: "spring", stiffness: 420, damping: 26 },
          scale: { type: "spring", stiffness: 420, damping: 26 },
          opacity: { duration: 0.2 }
        }}
        whileHover={{ scale: 1.02 }}
        className={`pointer-events-auto relative flex items-center justify-center border border-black/[0.07] text-ink overflow-hidden transition-all duration-300 ${
          activeAlert 
            ? 'px-4 py-2 rounded-full gap-2.5 min-w-[210px]' 
            : 'px-3.5 py-1.5 rounded-full gap-2 text-xs'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.84) 50%, rgba(248, 247, 244, 0.9) 100%)',
          backdropFilter: 'blur(28px) saturate(190%) contrast(105%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%) contrast(105%)',
          boxShadow: `
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.98),
            inset 0 -1px 1px 0 rgba(0, 0, 0, 0.03),
            0 18px 40px -10px rgba(0, 0, 0, 0.09),
            0 6px 16px -4px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(255, 255, 255, 0.8)
          `
        }}
        id="fluid-cloud-capsule"
      >
        {/* Subtle Specular Light Crescent Top Overlay */}
        <div 
          className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none opacity-80" 
        />

        <AnimatePresence mode="popLayout" initial={false}>
          {activeAlert ? (
            <motion.div
              key="alert-mode"
              layout
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 28, mass: 0.5 },
                opacity: { duration: 0.2, ease: "easeInOut" },
                scale: { duration: 0.22, ease: "easeOut" }
              }}
              className="flex items-center gap-2.5 max-w-[85vw] sm:max-w-md whitespace-nowrap relative z-10"
            >
              <div className="w-5.5 h-5.5 rounded-full bg-black/[0.04] border border-black/[0.06] flex items-center justify-center shadow-2xs shrink-0">
                {getIcon(activeAlert.type, activeAlert.icon)}
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-[11px] sm:text-xs font-bold text-ink leading-tight truncate">
                  {activeAlert.title}
                </span>
                {activeAlert.subtitle && (
                  <span className="text-[10px] text-ink-soft leading-tight truncate font-sans">
                    {activeAlert.subtitle}
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ambient-mode"
              layout
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 28, mass: 0.5 },
                opacity: { duration: 0.2, ease: "easeInOut" },
                scale: { duration: 0.22, ease: "easeOut" }
              }}
              className="flex items-center gap-2 text-[10.5px] text-ink-soft whitespace-nowrap relative z-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-bold text-ink tracking-tight">Bengaluru, IN</span>
              <span className="text-black/20">·</span>
              <span className="font-mono text-ink font-medium tracking-wide">{currentTime || 'IST'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
