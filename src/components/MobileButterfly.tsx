import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SectionAnchor {
  sectionId: string;
  headingId: string;
  name: string;
  defaultOffset: number;
  offsetY: number;
}

const SECTIONS: SectionAnchor[] = [
  { sectionId: 'hero', headingId: 'name-header', name: 'Hero Name', defaultOffset: 0.62, offsetY: -26 },
  { sectionId: 'education', headingId: 'edu-label', name: 'Education', defaultOffset: 0.22, offsetY: -22 },
  { sectionId: 'experience', headingId: 'exp-label', name: 'Experience', defaultOffset: 0.22, offsetY: -22 },
  { sectionId: 'hackathons', headingId: 'hackathons-label', name: 'Hackathons', defaultOffset: 0.20, offsetY: -22 },
  { sectionId: 'leadership', headingId: 'leadership-label', name: 'Leadership', defaultOffset: 0.20, offsetY: -22 },
  { sectionId: 'projects', headingId: 'projects-label', name: 'Projects', defaultOffset: 0.22, offsetY: -22 },
  { sectionId: 'certifications', headingId: 'certifications-label', name: 'Certifications', defaultOffset: 0.22, offsetY: -22 },
  { sectionId: 'cta-connect', headingId: 'cta-title', name: 'Ready to Connect', defaultOffset: 0.72, offsetY: -26 }
];

/** Clamp coordinates strictly within the visible mobile screen */
function clampToViewport(x: number, y: number): { x: number; y: number } {
  const minX = 35;
  const maxX = (typeof window !== 'undefined' ? window.innerWidth : 390) - 35;
  const minY = 50;
  const maxY = (typeof window !== 'undefined' ? window.innerHeight : 844) - 60;
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y))
  };
}

/** Get viewport-relative coordinates for a heading ONLY if it is genuinely visible on screen */
function getVisibleHeadingCoords(headingId: string, customOffset?: number): { x: number; y: number } | null {
  const container = document.getElementById(headingId);
  if (!container) return null;

  const textEl = container.querySelector('span') || container;
  const rect = textEl.getBoundingClientRect();
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Heading MUST be on the visible screen
  if (rect.top < 10 || rect.top > innerHeight - 50) {
    return null;
  }

  const config = SECTIONS.find(s => s.headingId === headingId) || SECTIONS[0];
  const offset = customOffset !== undefined ? customOffset : config.defaultOffset;

  const rawX = rect.left + rect.width * offset;
  const rawY = rect.top + config.offsetY;
  return clampToViewport(rawX, rawY);
}

/** Generate a natural randomized letter offset along a heading string */
function getRandomLetterOffset(): number {
  const presets = [0.14, 0.26, 0.42, 0.58, 0.74, 0.86];
  return presets[Math.floor(Math.random() * presets.length)];
}

/** Generate a natural subtle perched tilt angle */
function getRandomPerchTilt(): number {
  const tiltOptions = [-12, -8, -4, 0, 4, 8, 12];
  return tiltOptions[Math.floor(Math.random() * tiltOptions.length)];
}

/** Find the best target heading on screen based on natural scroll position */
function findBestScrollTarget(): { section: SectionAnchor; pos: { x: number; y: number } } {
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const scrollY = window.scrollY;
  const focalY = innerHeight * 0.36;

  // 1. Bottom of page -> always Ready to Connect!
  if (scrollY + innerHeight >= docHeight - 90) {
    const last = SECTIONS[SECTIONS.length - 1];
    const pos = getVisibleHeadingCoords(last.headingId, getRandomLetterOffset()) || {
      x: window.innerWidth * 0.72,
      y: innerHeight * 0.70
    };
    return { section: last, pos };
  }

  // 2. Top of page -> Hero Name
  if (scrollY <= 40) {
    const first = SECTIONS[0];
    const pos = getVisibleHeadingCoords(first.headingId, 0.62) || {
      x: window.innerWidth * 0.62,
      y: 120
    };
    return { section: first, pos };
  }

  // 3. Scan all 8 headings in document order for those on the visible screen
  const onScreenHeadings: { section: SectionAnchor; pos: { x: number; y: number }; top: number }[] = [];

  for (const s of SECTIONS) {
    const pos = getVisibleHeadingCoords(s.headingId, getRandomLetterOffset());
    if (pos) {
      const el = document.getElementById(s.headingId);
      const top = el ? el.getBoundingClientRect().top : 0;
      onScreenHeadings.push({ section: s, pos, top });
    }
  }

  // If there are visible headings on screen:
  if (onScreenHeadings.length > 0) {
    // Pick the one closest to the reading focal sweet spot (~36% down screen)
    onScreenHeadings.sort((a, b) => Math.abs(a.top - focalY) - Math.abs(b.top - focalY));
    return onScreenHeadings[0];
  }

  // 4. If in the middle of a long section (e.g. projects list):
  // Keep the butterfly at natural reading height (~35% down screen) in the center/left
  const midScreenPos = {
    x: window.innerWidth * 0.35,
    y: innerHeight * 0.35
  };

  for (const s of SECTIONS) {
    const secEl = document.getElementById(s.sectionId);
    if (secEl) {
      const rect = secEl.getBoundingClientRect();
      if (rect.top <= focalY && rect.bottom >= focalY) {
        return { section: s, pos: midScreenPos };
      }
    }
  }

  return { section: SECTIONS[0], pos: midScreenPos };
}

export default function MobileButterfly() {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [isStartled, setIsStartled] = useState<boolean>(false);
  const [tilt, setTilt] = useState<number>(-8);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [wingPose, setWingPose] = useState<'open' | 'folded'>('open');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const coordsRef = useRef<{ x: number; y: number } | null>(null);
  const activeHeadingRef = useRef<string>('name-header');
  const activeOffsetRef = useRef<number>(0.62);
  const prevScrollY = useRef<number>(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const landingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep coordsRef in sync with coords state
  const updateCoords = useCallback((newPos: { x: number; y: number }) => {
    coordsRef.current = newPos;
    setCoords(newPos);
  }, []);

  // Natural idle wing basking/folding while resting
  useEffect(() => {
    if (isFlying || !isVisible) return;
    const idleTimer = setInterval(() => {
      setWingPose(prev => (prev === 'open' ? 'folded' : 'open'));
    }, 6000 + Math.random() * 3000);
    return () => clearInterval(idleTimer);
  }, [isFlying, isVisible]);

  // ----- ENTRANCE ANIMATION (On portfolio load) -----
  useEffect(() => {
    if (window.innerWidth >= 640) return;

    // Start off-screen top right
    const startX = window.innerWidth * 0.85;
    const startY = -70;
    updateCoords({ x: startX, y: startY });
    setIsFlying(true);
    setIsVisible(true);
    setFacing('left'); // flying in leftward from top-right
    setTilt(14);

    // Give DOM 320ms to settle typography and hero layout
    const timer = setTimeout(() => {
      const initialOffset = Math.random() > 0.5 ? 0.65 : 0.22;
      const initialPose: 'open' | 'folded' = Math.random() > 0.45 ? 'open' : 'folded';
      const landPos = getVisibleHeadingCoords('name-header', initialOffset) || {
        x: window.innerWidth * initialOffset,
        y: 120
      };

      setFacing(initialOffset > 0.5 ? 'left' : 'right');
      updateCoords(landPos);
      setTilt(initialOffset > 0.5 ? -10 : 8);
      activeHeadingRef.current = 'name-header';
      activeOffsetRef.current = initialOffset;

      landingTimeoutRef.current = setTimeout(() => {
        setIsFlying(false);
        setWingPose(initialPose);
        setTilt(getRandomPerchTilt());
      }, 1100);
    }, 320);

    return () => clearTimeout(timer);
  }, [updateCoords]);

  // ----- SCROLL TRACKING ACROSS ALL SECTIONS -----
  useEffect(() => {
    if (window.innerWidth >= 640) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - prevScrollY.current;
      prevScrollY.current = currentY;

      // Butterfly lifts off and flaps wings gracefully
      setIsFlying(true);
      if (dy > 2) {
        setTilt(12); // gentle pitch downward with scroll
      } else if (dy < -2) {
        setTilt(-12); // gentle pitch upward against scroll
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (landingTimeoutRef.current) clearTimeout(landingTimeoutRef.current);

      // When user stops scrolling, locate the active heading in view
      scrollTimeoutRef.current = setTimeout(() => {
        const target = findBestScrollTarget();
        const randomFacing: 'left' | 'right' = Math.random() > 0.5 ? 'right' : 'left';
        const randomPose: 'open' | 'folded' = Math.random() > 0.45 ? 'open' : 'folded';
        const randomTilt = getRandomPerchTilt();

        activeHeadingRef.current = target.section.headingId;
        const currentX = coordsRef.current?.x || 0;
        setFacing(target.pos.x >= currentX ? 'right' : 'left');
        updateCoords(target.pos);
        setTilt(target.pos.x > currentX ? 8 : -8);

        // Land gently and choose posture (smooth 180-deg open unfurl vs folded side view)
        landingTimeoutRef.current = setTimeout(() => {
          setIsFlying(false);
          setFacing(randomFacing);
          setWingPose(randomPose);
          setTilt(randomTilt);
        }, 900);
      }, 180);
    };

    const onResize = () => {
      if (window.innerWidth >= 640) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
        const currentPos = getVisibleHeadingCoords(activeHeadingRef.current, activeOffsetRef.current);
        if (currentPos) updateCoords(currentPos);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (landingTimeoutRef.current) clearTimeout(landingTimeoutRef.current);
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, [updateCoords]);

  // ----- TAP / TOUCH INTERACTION -----
  const onTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!coordsRef.current || isStartled) return;

    setIsStartled(true);
    setIsFlying(true);

    try {
      navigator.vibrate?.(18);
    } catch {}

    const curPos = coordsRef.current;
    // Phase 1: Startle flutter jump (hops up and away, flips direction)
    const sideDir = Math.random() > 0.5 ? 1 : -1;
    const sideShift = sideDir * (35 + Math.random() * 30);
    const jumpPos = clampToViewport(curPos.x + sideShift, curPos.y - 65 - Math.random() * 25);

    setFacing(sideDir > 0 ? 'right' : 'left');
    updateCoords(jumpPos);
    setTilt(sideDir > 0 ? 16 : -16);

    // Phase 2: Pick a new visible landing spot ON THE SCREEN
    tapTimeoutRef.current = setTimeout(() => {
      // Collect headings currently visible in viewport
      const visibleHeadings: { section: SectionAnchor; pos: { x: number; y: number } }[] = [];
      for (const s of SECTIONS) {
        const pos = getVisibleHeadingCoords(s.headingId, getRandomLetterOffset());
        if (pos) {
          visibleHeadings.push({ section: s, pos });
        }
      }

      let destPos: { x: number; y: number };
      let newHeadingId = activeHeadingRef.current;
      let newOffset = activeOffsetRef.current;
      const nextFacing: 'left' | 'right' = Math.random() > 0.5 ? 'right' : 'left';
      const nextPose: 'open' | 'folded' = Math.random() > 0.45 ? 'open' : 'folded';
      const nextTilt = getRandomPerchTilt();

      // If another visible heading is on screen, fly to it
      const otherVisible = visibleHeadings.filter(v => v.section.headingId !== activeHeadingRef.current);
      if (otherVisible.length > 0) {
        const pick = otherVisible[Math.floor(Math.random() * otherVisible.length)];
        destPos = pick.pos;
        newHeadingId = pick.section.headingId;
        newOffset = pick.section.defaultOffset;
      } else {
        // Otherwise pick a different letter offset on the current heading
        newOffset = getRandomLetterOffset();
        const freshPos = getVisibleHeadingCoords(activeHeadingRef.current, newOffset);
        destPos = freshPos || clampToViewport(curPos.x + (Math.random() > 0.5 ? 60 : -60), curPos.y);
      }

      // Turn towards flight path
      setFacing(destPos.x >= jumpPos.x ? 'right' : 'left');
      updateCoords(destPos);
      activeHeadingRef.current = newHeadingId;
      activeOffsetRef.current = newOffset;
      setTilt(destPos.x > jumpPos.x ? 10 : -10);

      // Phase 3: Land smoothly, adopt new stance (open basking vs folded), pitch angle & facing
      landingTimeoutRef.current = setTimeout(() => {
        setIsStartled(false);
        setIsFlying(false);
        setFacing(nextFacing);
        setWingPose(nextPose);
        setTilt(nextTilt);
      }, 920);
    }, 400);
  }, [isStartled, updateCoords]);

  if (!isVisible || !coords) return null;

  return (
    <div
      className="fixed z-[60] pointer-events-none sm:hidden"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: `all ${isFlying ? '950ms' : '380ms'} cubic-bezier(0.25, 1, 0.4, 1)`
      }}
      aria-hidden="true"
    >
      <div
        onClick={onTap}
        onTouchStart={onTap}
        className="relative w-20 h-20 flex items-center justify-center cursor-pointer pointer-events-auto select-none"
        style={{ touchAction: 'manipulation' }}
        title="Tap butterfly"
      >
        {/* Dynamic Grounding Bioluminescent Shadow */}
        <div
          className="absolute pointer-events-none transition-all duration-500"
          style={{
            bottom: isFlying ? '-14px' : '-3px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isFlying ? '36px' : wingPose === 'open' ? '32px' : '22px',
            height: isFlying ? '9px' : '6px',
            background: isFlying
              ? 'radial-gradient(ellipse, rgba(0, 195, 255, 0.28) 0%, rgba(37, 99, 235, 0.12) 50%, transparent 75%)'
              : 'radial-gradient(ellipse, rgba(0, 0, 0, 0.28) 0%, rgba(37, 99, 235, 0.08) 55%, transparent 75%)',
            borderRadius: '50%',
            filter: isFlying ? 'blur(4.5px)' : 'blur(1.4px)'
          }}
        />

        {/* 3D Butterfly Container with Dynamic Facing, Stance & Glow */}
        <div
          className={`relative flex items-center justify-center transform-gpu ${
            isStartled ? 'animate-butterfly-startle' : ''
          }`}
          style={{
            transform: `scaleX(${facing === 'left' ? -1 : 1}) rotate(${tilt}deg) translateY(${isFlying ? '-4px' : '0'})`,
            perspective: '600px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
            filter: isFlying 
              ? 'drop-shadow(0 0 7px rgba(0, 210, 255, 0.65)) drop-shadow(0 2px 8px rgba(37, 99, 235, 0.45))'
              : wingPose === 'open'
                ? 'drop-shadow(0 2px 6px rgba(0, 180, 255, 0.45))'
                : 'drop-shadow(0 1px 4px rgba(0, 160, 255, 0.35))'
          }}
        >
          {/* LEFT WING (Iridescent Blue Morpho Forewing & Hindwing) */}
          <div
            className="origin-right transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              animation: isFlying
                ? 'butterflyFlapLeft 0.24s ease-in-out infinite alternate'
                : wingPose === 'open'
                  ? 'butterflyUnfurlAndBreatheLeft 5.5s ease-in-out infinite'
                  : 'butterflyBreatheFoldLeft 4.5s ease-in-out infinite'
            }}
          >
            <svg width="36" height="48" viewBox="0 0 30 42" fill="none" className="overflow-visible">
              <defs>
                {/* Iridescent Radiant Core Gradient */}
                <linearGradient id="morpho-wing-l-main" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.95" />   {/* Iridescent Aqua Shimmer */}
                  <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.95" />  {/* Vivid Cyan */}
                  <stop offset="55%" stopColor="#2563EB" stopOpacity="0.92" />  {/* Electric Cobalt Blue */}
                  <stop offset="82%" stopColor="#1E3A8A" stopOpacity="0.95" />  {/* Deep Royal Sapphire */}
                  <stop offset="100%" stopColor="#050B1A" stopOpacity="1" />    {/* Velvet Obsidian Edge */}
                </linearGradient>

                {/* Hindwing Glow Gradient */}
                <linearGradient id="morpho-wing-l-hind" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="45%" stopColor="#1D4ED8" stopOpacity="0.85" />
                  <stop offset="85%" stopColor="#0B132B" stopOpacity="0.95" />
                </linearGradient>

                {/* Specular Vein Highlight Gradient */}
                <linearGradient id="morpho-vein-l" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Forewing Outer Velvet Black Border Contour */}
              <path
                d="M29 20 C25 3, 8 0, 1 9 C-3 17, 8 28, 29 24 Z"
                fill="url(#morpho-wing-l-main)"
                stroke="#040814"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Forewing Inner Iridescent Structural Scales */}
              <path
                d="M28 20 C24 6, 11 3, 4 10 C1 16, 10 25, 28 23 Z"
                fill="url(#morpho-wing-l-main)"
                opacity="0.85"
              />

              {/* Primary Structural Veins */}
              <path
                d="M29 21 C19 14, 11 13, 4 12 M29 21 C17 20, 10 22, 5 26"
                stroke="url(#morpho-vein-l)"
                strokeWidth="0.8"
                strokeLinecap="round"
              />

              {/* Secondary Delicate Veins */}
              <path
                d="M22 17 C16 10, 10 8, 5 9 M20 21 C15 22, 10 24, 7 28"
                stroke="#0A1628"
                strokeWidth="0.5"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />

              {/* Hindwing with Velvet Margin */}
              <path
                d="M29 24 C22 31, 11 33, 8 38 C7 42, 21 41, 29 31 Z"
                fill="url(#morpho-wing-l-hind)"
                stroke="#040814"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Hindwing Veins */}
              <path
                d="M29 26 C20 32, 14 35, 10 38"
                stroke="#38BDF8"
                strokeWidth="0.6"
                strokeOpacity="0.75"
                strokeLinecap="round"
              />

              {/* Scalloped Margin Bioluminescent Pearls (Signature Morpho Spots) */}
              <circle cx="3" cy="11" r="1.1" fill="#E0F2FE" />
              <circle cx="2" cy="16" r="1.1" fill="#7DD3FC" />
              <circle cx="4" cy="21" r="1.1" fill="#E0F2FE" />
              <circle cx="7" cy="25" r="1.1" fill="#7DD3FC" />
              <circle cx="9" cy="38" r="1.0" fill="#E0F2FE" />
              <circle cx="15" cy="40" r="1.0" fill="#7DD3FC" />

              {/* Core Luminous Sapphire Glow Spot */}
              <circle cx="13" cy="14" r="3.2" fill="#38BDF8" fillOpacity="0.5" />
              <circle cx="15" cy="33" r="2.2" fill="#67E8F9" fillOpacity="0.45" />
            </svg>
          </div>

          {/* OBSIDIAN BODY & SAPPHIRE-TIPPED JEWEL ANTENNAE */}
          <div className="z-10 mx-[-4px] shrink-0">
            <svg width="12" height="46" viewBox="0 0 12 46" fill="none">
              {/* Antennae */}
              <path d="M5 15 C3 7, 0 3, -2 4" stroke="#060911" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M7 15 C9 7, 12 3, 14 4" stroke="#060911" strokeWidth="1.1" strokeLinecap="round" />
              {/* Glowing Turquoise Antenna Jewels */}
              <circle cx="-2" cy="4" r="1.4" fill="#38BDF8" />
              <circle cx="-2" cy="4" r="0.6" fill="#F0FDFA" />
              <circle cx="14" cy="4" r="1.4" fill="#38BDF8" />
              <circle cx="14" cy="4" r="0.6" fill="#F0FDFA" />

              {/* Faceted Sapphire Eyes */}
              <circle cx="4.5" cy="14.5" r="1.1" fill="#00D2FF" />
              <circle cx="7.5" cy="14.5" r="1.1" fill="#00D2FF" />

              {/* Head */}
              <circle cx="6" cy="15" r="2.3" fill="#060911" />
              {/* Thorax */}
              <ellipse cx="6" cy="21" rx="2.1" ry="4.2" fill="#0A0F1D" />
              {/* Dorsal Electric Blue Stripe on Thorax */}
              <ellipse cx="6" cy="20.5" rx="1.2" ry="2.6" fill="#38BDF8" fillOpacity="0.6" />

              {/* Abdomen Rings */}
              <ellipse cx="6" cy="31" rx="1.9" ry="7.5" fill="#060911" />
              <path d="M4.5 27 Q6 28 7.5 27 M4.5 31 Q6 32 7.5 31 M4.8 35 Q6 36 7.2 35" stroke="#1E3A8A" strokeWidth="0.6" strokeLinecap="round" />
            </svg>
          </div>

          {/* RIGHT WING (Iridescent Blue Morpho Forewing & Hindwing) */}
          <div
            className="origin-left transform-gpu"
            style={{
              transformStyle: 'preserve-3d',
              animation: isFlying
                ? 'butterflyFlapRight 0.24s ease-in-out infinite alternate'
                : wingPose === 'open'
                  ? 'butterflyUnfurlAndBreatheRight 5.5s ease-in-out infinite'
                  : 'butterflyBreatheFoldRight 4.5s ease-in-out infinite'
            }}
          >
            <svg width="36" height="48" viewBox="0 0 30 42" fill="none" className="overflow-visible">
              <defs>
                <linearGradient id="morpho-wing-r-main" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.95" />
                  <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#2563EB" stopOpacity="0.92" />
                  <stop offset="82%" stopColor="#1E3A8A" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#050B1A" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="morpho-wing-r-hind" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="45%" stopColor="#1D4ED8" stopOpacity="0.85" />
                  <stop offset="85%" stopColor="#0B132B" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="morpho-vein-r" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Forewing Outer Velvet Black Border Contour */}
              <path
                d="M1 20 C5 3, 22 0, 29 9 C33 17, 22 28, 1 24 Z"
                fill="url(#morpho-wing-r-main)"
                stroke="#040814"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Forewing Inner Iridescent Structural Scales */}
              <path
                d="M2 20 C6 6, 19 3, 26 10 C29 16, 20 25, 2 23 Z"
                fill="url(#morpho-wing-r-main)"
                opacity="0.85"
              />

              {/* Primary Structural Veins */}
              <path
                d="M1 21 C11 14, 19 13, 26 12 M1 21 C13 20, 20 22, 25 26"
                stroke="url(#morpho-vein-r)"
                strokeWidth="0.8"
                strokeLinecap="round"
              />

              {/* Secondary Delicate Veins */}
              <path
                d="M8 17 C14 10, 20 8, 25 9 M10 21 C15 22, 20 24, 23 28"
                stroke="#0A1628"
                strokeWidth="0.5"
                strokeOpacity="0.7"
                strokeLinecap="round"
              />

              {/* Hindwing with Velvet Margin */}
              <path
                d="M1 24 C8 31, 19 33, 22 38 C23 42, 9 41, 1 31 Z"
                fill="url(#morpho-wing-r-hind)"
                stroke="#040814"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Hindwing Veins */}
              <path
                d="M1 26 C10 32, 16 35, 20 38"
                stroke="#38BDF8"
                strokeWidth="0.6"
                strokeOpacity="0.75"
                strokeLinecap="round"
              />

              {/* Scalloped Margin Bioluminescent Pearls */}
              <circle cx="27" cy="11" r="1.1" fill="#E0F2FE" />
              <circle cx="28" cy="16" r="1.1" fill="#7DD3FC" />
              <circle cx="26" cy="21" r="1.1" fill="#E0F2FE" />
              <circle cx="23" cy="25" r="1.1" fill="#7DD3FC" />
              <circle cx="21" cy="38" r="1.0" fill="#E0F2FE" />
              <circle cx="15" cy="40" r="1.0" fill="#7DD3FC" />

              {/* Core Luminous Sapphire Glow Spot */}
              <circle cx="17" cy="14" r="3.2" fill="#38BDF8" fillOpacity="0.5" />
              <circle cx="15" cy="33" r="2.2" fill="#67E8F9" fillOpacity="0.45" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
