import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, AlertTriangle, Sparkles, Shield, Smartphone, Newspaper, MessageSquare, Download } from 'lucide-react';
import { FluidCloudPayload } from '../utils/fluidCloud';

export default function FluidCloud() {
  const [activeAlert, setActiveAlert] = useState<FluidCloudPayload | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Keep live time updated for ambient mode
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
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
    if (iconKey === 'check' || type === 'success') return <Check size={13} className="text-emerald-500 shrink-0" />;
    if (iconKey === 'shield') return <Shield size={13} className="text-blue-500 shrink-0" />;
    if (iconKey === 'smartphone') return <Smartphone size={13} className="text-purple-500 shrink-0" />;
    if (iconKey === 'newspaper') return <Newspaper size={13} className="text-amber-500 shrink-0" />;
    if (iconKey === 'contact') return <MessageSquare size={13} className="text-emerald-500 shrink-0" />;
    if (iconKey === 'download') return <Download size={13} className="text-indigo-500 shrink-0" />;
    if (iconKey === 'alert' || type === 'warning') return <AlertTriangle size={13} className="text-amber-500 shrink-0" />;
    if (iconKey === 'sparkles') return <Sparkles size={13} className="text-amber-400 shrink-0" />;
    return <Info size={13} className="text-ink-soft shrink-0" />;
  };

  return (
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-center items-center select-none font-mono">
      <motion.div
        layout
        initial={{ y: -30, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          layout: { type: "spring", stiffness: 340, damping: 30, mass: 0.5 },
          y: { type: "spring", stiffness: 450, damping: 28 },
          scale: { type: "spring", stiffness: 450, damping: 28 },
          opacity: { duration: 0.2 }
        }}
        className={`pointer-events-auto flex items-center justify-center border border-black/[0.08] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-2xl backdrop-saturate-200 bg-[#F6F5F2]/90 text-ink overflow-hidden ${
          activeAlert ? 'px-4 py-2 rounded-full gap-2.5 min-w-[210px]' : 'px-3.5 py-1.5 rounded-full gap-2 text-xs'
        }`}
        id="fluid-cloud-capsule"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {activeAlert ? (
            <motion.div
              key="alert-mode"
              layout
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{
                layout: { type: "spring", stiffness: 340, damping: 30, mass: 0.5 },
                opacity: { duration: 0.22, ease: "easeInOut" },
                scale: { duration: 0.25, ease: "easeOut" }
              }}
              className="flex items-center gap-2.5 max-w-[85vw] sm:max-w-md whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-2xs shrink-0">
                {getIcon(activeAlert.type, activeAlert.icon)}
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-[11px] sm:text-xs font-semibold text-ink leading-tight truncate">
                  {activeAlert.title}
                </span>
                {activeAlert.subtitle && (
                  <span className="text-[10px] text-ink-soft leading-tight truncate">
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
                layout: { type: "spring", stiffness: 340, damping: 30, mass: 0.5 },
                opacity: { duration: 0.22, ease: "easeInOut" },
                scale: { duration: 0.25, ease: "easeOut" }
              }}
              className="flex items-center gap-2 text-[10.5px] text-ink-soft whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-ink">Bengaluru, IN</span>
              <span className="opacity-40">·</span>
              <span>{currentTime || 'IST'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
