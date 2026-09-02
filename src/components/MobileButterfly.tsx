import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AnchorConfig {
  id: string;
  name: string;
  letterOffsetX: number;
  offsetY: number;
}

const ANCHORS: AnchorConfig[] = [
  { id: 'name-header', name: 'Hero Name', letterOffsetX: 0.68, offsetY: -10 },
  { id: 'edu-label', name: 'Education', letterOffsetX: 0.08, offsetY: -8 },
  { id: 'exp-label', name: 'Experience', letterOffsetX: 0.08, offsetY: -8 },
  { id: 'projects-label', name: 'Projects', letterOffsetX: 0.08, offsetY: -8 },
  { id: 'certifications-label', name: 'Certifications', letterOffsetX: 0.08, offsetY: -8 },
  { id: 'cta-title', name: 'Ready to Connect', letterOffsetX: 0.88, offsetY: -10 }
];

export default function MobileButterfly() {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [isStartled, setIsStartled] = useState<boolean>(false);
  const [tilt, setTilt] = useState<number>(-10);
  const [activeAnchorId, setActiveAnchorId] = useState<string>('name-header');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const prevScrollY = useRef<number>(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flightLandingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAnchorCoords = useCallback((anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const config = ANCHORS.find(a => a.id === anchorId) || ANCHORS[0];
    const targetX = rect.left + rect.width * config.letterOffsetX;
    const targetY = rect.top + config.offsetY;

    return { x: targetX, y: targetY };
  }, []);

  const findClosestAnchor = useCallback(() => {
    const viewportFocalY = window.innerHeight * 0.38;
    let closestAnchor = ANCHORS[0];
    let minDistance = Infinity;

    for (const anchor of ANCHORS) {
      const el = document.getElementById(anchor.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - viewportFocalY);
        if (rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0) {
          if (dist < minDistance) {
            minDistance = dist;
            closestAnchor = anchor;
          }
        }
      }
    }

    return closestAnchor.id;
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 640) return;

    const hasWelcomed = sessionStorage.getItem('butterfly_welcomed_v1');
    const nameEl = document.getElementById('name-header');

    if (nameEl) {
      const rect = nameEl.getBoundingClientRect();
      const targetX = rect.left + rect.width * 0.68;
      const targetY = rect.top - 10;

      if (!hasWelcomed) {
        setCoords({ x: window.innerWidth + 20, y: -30 });
        setIsFlying(true);
        setIsVisible(true);

        const timer = setTimeout(() => {
          setCoords({ x: targetX, y: targetY });
          setTilt(8);
          sessionStorage.setItem('butterfly_welcomed_v1', 'true');

          flightLandingTimeoutRef.current = setTimeout(() => {
            setIsFlying(false);
            setTilt(-8);
          }, 800);
        }, 300);

        return () => clearTimeout(timer);
      } else {
        setCoords({ x: targetX, y: targetY });
        setIsFlying(false);
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 640) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - prevScrollY.current;
      prevScrollY.current = currentScrollY;

      setIsFlying(true);
      if (deltaY > 2) {
        setTilt(14);
      } else if (deltaY < -2) {
        setTilt(-14);
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (flightLandingTimeoutRef.current) clearTimeout(flightLandingTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        const targetId = findClosestAnchor();
        setActiveAnchorId(targetId);

        const newCoords = getAnchorCoords(targetId);
        if (newCoords) {
          setCoords(newCoords);
        }

        flightLandingTimeoutRef.current = setTimeout(() => {
          setIsFlying(false);
          setTilt(-6);
        }, 550);
      }, 160);
    };

    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
        const newCoords = getAnchorCoords(activeAnchorId);
        if (newCoords) setCoords(newCoords);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (flightLandingTimeoutRef.current) clearTimeout(flightLandingTimeoutRef.current);
      if (startleTimeoutRef.current) clearTimeout(startleTimeoutRef.current);
    };
  }, [activeAnchorId, findClosestAnchor, getAnchorCoords]);

  const handleButterflyTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isStartled) return;

    setIsStartled(true);
    setIsFlying(true);

    if (navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }

    startleTimeoutRef.current = setTimeout(() => {
      setIsStartled(false);
      setIsFlying(false);
      setTilt(-6);
    }, 700);
  };

  if (!isVisible || !coords) return null;

  return (
    <div
      className="fixed z-[60] pointer-events-none sm:hidden transition-all ease-out"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: `translate(-50%, -50%)`,
        transitionDuration: isFlying ? '520ms' : '280ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }}
      aria-hidden="true"
    >
      <div
        onClick={handleButterflyTap}
        onTouchStart={handleButterflyTap}
        className="relative w-9 h-9 flex items-center justify-center cursor-pointer pointer-events-auto select-none"
        title="Ink Companion"
      >
        <div
          className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
            isFlying
              ? 'w-4 h-1.5 bg-black/[0.04] blur-[2px] translate-y-3 opacity-30'
              : 'w-3 h-1 bg-black/[0.16] blur-[0.8px] translate-y-1.5 opacity-80'
          }`}
        />

        <div
          className={`relative flex items-center justify-center transform-gpu transition-transform duration-300 ${
            isStartled ? 'animate-butterfly-startle' : ''
          }`}
          style={{
            transform: `rotate(${tilt}deg) ${isFlying ? 'translateY(-2px)' : 'translateY(0)'}`,
            perspective: '500px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div
            className="origin-right transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              animation: isFlying
                ? 'butterflyFlapLeft 0.16s ease-in-out infinite alternate'
                : 'butterflyBreatheLeft 3.6s ease-in-out infinite'
            }}
          >
            <svg width="13" height="18" viewBox="0 0 20 30" fill="none" className="overflow-visible">
              <path
                d="M19 15 C16 4, 5 1, 1 7 C-2 12, 5 20, 19 17 Z"
                fill="rgba(17, 17, 17, 0.08)"
                stroke="#111111"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <path
                d="M19 16 C13 11, 7 10, 3 9 M19 16 C11 15, 6 17, 3 19"
                stroke="#111111"
                strokeWidth="0.7"
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
              <path
                d="M19 17 C14 21, 7 23, 6 27 C5 31, 14 30, 19 22 Z"
                fill="rgba(17, 17, 17, 0.05)"
                stroke="#111111"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="z-10 mx-[-2px] shrink-0">
            <svg width="6" height="22" viewBox="0 0 10 36" fill="none">
              <path
                d="M4 11 C2 5, 0 3, -1 4 M6 11 C8 5, 10 3, 11 4"
                stroke="#111111"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
              <circle cx="5" cy="11" r="1.5" fill="#111111" />
              <ellipse cx="5" cy="20" rx="1.5" ry="7" fill="#111111" />
            </svg>
          </div>

          <div
            className="origin-left transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              animation: isFlying
                ? 'butterflyFlapRight 0.16s ease-in-out infinite alternate'
                : 'butterflyBreatheRight 3.6s ease-in-out infinite'
            }}
          >
            <svg width="13" height="18" viewBox="0 0 20 30" fill="none" className="overflow-visible">
              <path
                d="M1 15 C4 4, 15 1, 19 7 C22 12, 15 20, 1 17 Z"
                fill="rgba(17, 17, 17, 0.08)"
                stroke="#111111"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <path
                d="M1 16 C7 11, 13 10, 17 9 M1 16 C9 15, 14 17, 17 19"
                stroke="#111111"
                strokeWidth="0.7"
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
              <path
                d="M1 17 C6 21, 13 23, 14 27 C15 31, 6 30, 1 22 Z"
                fill="rgba(17, 17, 17, 0.05)"
                stroke="#111111"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
