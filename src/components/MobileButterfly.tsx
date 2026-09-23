import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PerchAnchor {
  id: string;
  name: string;
  defaultOffset: number;
  offsetY: number;
  type: 'heading' | 'button' | 'badge';
}

/** Perching targets strictly bounded between Hero and Education */
const PERCH_ANCHORS: PerchAnchor[] = [
  { id: 'hero-name-chiranth', name: 'Chiranth Name', defaultOffset: 0.50, offsetY: -16, type: 'heading' },
  { id: 'hero-name-moger', name: 'Moger Name', defaultOffset: 0.50, offsetY: -16, type: 'heading' },
  { id: 'link-github', name: 'GitHub Button', defaultOffset: 0.50, offsetY: -16, type: 'button' },
  { id: 'link-linkedin', name: 'LinkedIn Button', defaultOffset: 0.50, offsetY: -16, type: 'button' },
  { id: 'link-resume', name: 'Resume Button', defaultOffset: 0.50, offsetY: -16, type: 'button' },
  { id: 'prompt-line', name: 'Terminal Prompt', defaultOffset: 0.40, offsetY: -18, type: 'heading' },
  { id: 'role-badge-0', name: 'Software Dev Badge', defaultOffset: 0.50, offsetY: -18, type: 'badge' },
  { id: 'edu-label', name: 'Education Header', defaultOffset: 0.35, offsetY: -16, type: 'heading' },
  { id: 'edu-inst-0', name: 'BMSIT Education Card', defaultOffset: 0.25, offsetY: -16, type: 'heading' }
];

/** Clamp coordinates strictly within visible screen boundaries */
function clampToViewport(x: number, y: number): { x: number; y: number } {
  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 390;
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 844;
  const minX = 35;
  const maxX = innerWidth - 35;
  const minY = 45;
  const maxY = innerHeight - 50;
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y))
  };
}

/** Compute natural body tilt from flight direction.
 *  Returns { facing, tilt } — tilt already accounts for scaleX mirror. */
function getFlightOrientation(
  fromX: number, fromY: number, toX: number, toY: number
): { facing: 'left' | 'right'; tilt: number } {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const facing: 'left' | 'right' = dx >= 0 ? 'right' : 'left';
  // Flight angle from vertical (head-up = 0°), clockwise positive
  const angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);
  // Scale to max ±20° so the tilt stays natural, not extreme
  const scaled = angleDeg * (20 / 180);
  // scaleX(-1) mirrors rotation visually, so negate for left-facing
  const tilt = facing === 'left' ? -scaled : scaled;
  return { facing, tilt: Math.round(tilt * 10) / 10 };
}

/** Get viewport-relative coordinates for an anchor ONLY if it is genuinely visible on screen */
function getVisibleAnchorCoords(anchorId: string, customOffset?: number): { x: number; y: number } | null {
  const el = document.getElementById(anchorId);
  if (!el) return null;

  const anchor = PERCH_ANCHORS.find(a => a.id === anchorId);
  let targetEl: Element = el;

  // Resolve genuinely visible text span (handles responsive sm:hidden / hidden sm:inline tags)
  if (anchor?.type === 'heading' && el.tagName !== 'SPAN') {
    const spans = Array.from(el.querySelectorAll('span'));
    const visibleSpan = spans.find(s => {
      const r = s.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (visibleSpan) targetEl = visibleSpan;
  }

  const rect = targetEl.getBoundingClientRect();
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Element MUST be visible in viewport
  if (rect.bottom < 15 || rect.top > innerHeight - 35) {
    return null;
  }

  const defaultOffset = anchor ? anchor.defaultOffset : 0.5;
  const offsetY = anchor ? anchor.offsetY : -16;
  const offset = customOffset !== undefined ? customOffset : defaultOffset;

  const rawX = rect.left + rect.width * offset;
  const rawY = rect.top + offsetY;
  return clampToViewport(rawX, rawY);
}

/** Find the best target on screen strictly bounded between Hero and Education */
function findBestScrollTarget(activeId?: string): { anchor: PerchAnchor; pos: { x: number; y: number } } | null {
  const innerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const scrollY = window.scrollY;
  const focalY = innerHeight * 0.35;

  // Education is the absolute last section: if user scrolled past education, stop following
  const eduSection = document.getElementById('education');
  if (eduSection) {
    const eduRect = eduSection.getBoundingClientRect();
    if (eduRect.bottom < 30) {
      return null;
    }
  }

  // 1. Top of page: stay firmly on Chiranth
  if (scrollY <= 80) {
    const heroAnchor = PERCH_ANCHORS.find(a => a.id === 'hero-name-chiranth') || PERCH_ANCHORS[0];
    const pos = getVisibleAnchorCoords(heroAnchor.id);
    if (pos) {
      return { anchor: heroAnchor, pos };
    }
  }

  // 2. Scan all visible anchors in Hero and Education and pick closest to reading focal point
  const onScreenAnchors: { anchor: PerchAnchor; pos: { x: number; y: number }; top: number }[] = [];
  for (const a of PERCH_ANCHORS) {
    const pos = getVisibleAnchorCoords(a.id);
    if (pos) {
      const el = document.getElementById(a.id);
      const top = el ? el.getBoundingClientRect().top : 0;
      onScreenAnchors.push({ anchor: a, pos, top });
    }
  }

  if (onScreenAnchors.length > 0) {
    if (activeId) {
      const currentActive = onScreenAnchors.find(a => a.anchor.id === activeId);
      if (currentActive && Math.abs(currentActive.top - focalY) < 140) {
        return currentActive;
      }
    }
    onScreenAnchors.sort((a, b) => Math.abs(a.top - focalY) - Math.abs(b.top - focalY));
    return onScreenAnchors[0];
  }

  return null;
}

export default function MobileButterfly() {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [isStartled, setIsStartled] = useState<boolean>(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [tilt, setTilt] = useState<number>(0);
  const [wingPose, setWingPose] = useState<'open' | 'folded'>('open');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [flightDuration, setFlightDuration] = useState<number>(1800);

  const coordsRef = useRef<{ x: number; y: number } | null>(null);
  const activeAnchorRef = useRef<string>('hero-name-chiranth');
  const prevAnchorRef = useRef<string>('');
  const flyingLockRef = useRef<boolean>(false);
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
    const innerW = typeof window !== 'undefined' ? window.innerWidth : 390;
    const isDesktop = innerW >= 768;
    const startX = isDesktop ? (innerW / 2 - 140) : innerW * 0.45;
    const startY = -70;
    updateCoords({ x: startX, y: startY });
    setIsFlying(true);
    setIsVisible(true);
    setFlightDuration(1800);

    // Give DOM time to settle layout
    const timer = setTimeout(() => {
      const heroAnchor = PERCH_ANCHORS.find(a => a.id === 'hero-name-chiranth') || PERCH_ANCHORS[0];
      const landPos = getVisibleAnchorCoords(heroAnchor.id) || {
        x: isDesktop ? (innerW / 2 - 140) : 195,
        y: 120
      };

      setFlightDuration(1800);
      updateCoords(landPos);
      activeAnchorRef.current = heroAnchor.id;

      landingTimeoutRef.current = setTimeout(() => {
        setIsFlying(false);
        setWingPose('folded');
      }, 1800);
    }, 280);

    return () => clearTimeout(timer);
  }, [updateCoords]);

  // ----- SCROLL TRACKING STRICTLY BOUNDED BETWEEN HERO & EDUCATION -----
  useEffect(() => {
    const onScroll = () => {
      // Debounce scroll target evaluation to prevent state thrashing during active scrolling
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        // Check if user scrolled past Education: butterfly gracefully hides
        const eduSection = document.getElementById('education');
        if (eduSection && eduSection.getBoundingClientRect().bottom < 30) {
          setIsVisible(false);
          setIsFlying(false);
          return;
        }

        const target = findBestScrollTarget(activeAnchorRef.current);
        if (!target) {
          setIsVisible(false);
          setIsFlying(false);
          return;
        }

        const curX = coordsRef.current ? coordsRef.current.x : target.pos.x;
        const curY = coordsRef.current ? coordsRef.current.y : target.pos.y;
        const orient = getFlightOrientation(curX, curY, target.pos.x, target.pos.y);
        setFacing(orient.facing);
        setTilt(orient.tilt);
        setIsVisible(true);
        setIsFlying(true);
        setFlightDuration(1800);

        activeAnchorRef.current = target.anchor.id;
        updateCoords(target.pos);

        if (landingTimeoutRef.current) clearTimeout(landingTimeoutRef.current);
        landingTimeoutRef.current = setTimeout(() => {
          setIsFlying(false);
          setWingPose(Math.random() > 0.4 ? 'open' : 'folded');
          setTilt(0);
        }, 1800);
      }, 120);
    };

    const onResize = () => {
      const currentPos = getVisibleAnchorCoords(activeAnchorRef.current);
      if (currentPos) {
        updateCoords(currentPos);
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

  // ----- TAP / TOUCH / CLICK INTERACTION -----
  const onTap = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!coordsRef.current || flyingLockRef.current) return;

    // Clear any pending flights
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    if (landingTimeoutRef.current) clearTimeout(landingTimeoutRef.current);

    flyingLockRef.current = true;

    try {
      navigator.vibrate?.(18);
    } catch {}

    const curPos = coordsRef.current;

    // --- Pick destination FIRST so the entire flight is forward-facing ---
    const visibleList: { anchor: PerchAnchor; pos: { x: number; y: number } }[] = [];
    for (const a of PERCH_ANCHORS) {
      const jitter = (Math.random() - 0.5) * 0.2;
      const offset = Math.max(0.2, Math.min(0.8, a.defaultOffset + jitter));
      const pos = getVisibleAnchorCoords(a.id, offset);
      if (pos) {
        visibleList.push({ anchor: a, pos });
      }
    }

    if (visibleList.length === 0) {
      flyingLockRef.current = false;
      return;
    }

    // Exclude current and previous anchor to avoid loops
    const freshCandidates = visibleList.filter(
      v => v.anchor.id !== activeAnchorRef.current && v.anchor.id !== prevAnchorRef.current
    );
    const candidates = freshCandidates.length > 0
      ? freshCandidates
      : visibleList.filter(v => v.anchor.id !== activeAnchorRef.current);

    const nextTarget = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : visibleList[0];

    const destPos = nextTarget.pos;
    const newAnchorId = nextTarget.anchor.id;
    const nextPose: 'open' | 'folded' = Math.random() > 0.4 ? 'open' : 'folded';

    // --- PHASE 1: Startle dodge — random direction hop (any direction) ---
    const dodgeAngle = Math.random() * Math.PI * 2; // full 360° random
    const dodgeDist = 30 + Math.random() * 25;
    const dodgeX = Math.cos(dodgeAngle) * dodgeDist;
    const dodgeY = Math.sin(dodgeAngle) * dodgeDist - 20; // bias slightly upward
    const dodgePos = clampToViewport(curPos.x + dodgeX, curPos.y + dodgeY);

    // Orient body toward dodge position
    const dodgeOrient = getFlightOrientation(curPos.x, curPos.y, dodgePos.x, dodgePos.y);
    setIsStartled(true);
    setIsFlying(true);
    setFacing(dodgeOrient.facing);
    setTilt(dodgeOrient.tilt);
    setFlightDuration(350);
    updateCoords(dodgePos);

    // --- PHASE 2: Composed forward glide to destination ---
    tapTimeoutRef.current = setTimeout(() => {
      setIsStartled(false);

      // Re-orient body toward final destination
      const glideOrient = getFlightOrientation(dodgePos.x, dodgePos.y, destPos.x, destPos.y);
      setFacing(glideOrient.facing);
      setTilt(glideOrient.tilt);

      const glideTime = 1400 + Math.floor(Math.random() * 500);
      setFlightDuration(glideTime);

      prevAnchorRef.current = activeAnchorRef.current;
      activeAnchorRef.current = newAnchorId;
      updateCoords(destPos);

      // Touchdown: settle wings, neutralize tilt, release lock
      landingTimeoutRef.current = setTimeout(() => {
        setIsFlying(false);
        setWingPose(nextPose);
        setTilt(0);
        flyingLockRef.current = false;
      }, glideTime);
    }, 400);
  }, [updateCoords]);

  // Natural idle wandering: softly advance to next landmark every 20-28s when resting near top of page
  useEffect(() => {
    if (isFlying || !isVisible) return;
    const idleHopTimer = setInterval(() => {
      if (typeof window !== 'undefined' && window.scrollY <= 450) {
        onTap();
      }
    }, 20000 + Math.random() * 8000);
    return () => clearInterval(idleHopTimer);
  }, [isFlying, isVisible, onTap]);

  if (!coords) return null;

  return (
    <div
      className={`fixed z-[60] pointer-events-none transition-opacity duration-400 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        top: 0,
        left: 0,
        transform: `translate3d(${coords.x}px, ${coords.y}px, 0) translate(-50%, -50%)`,
        willChange: 'transform',
        transition: `transform ${isFlying ? `${flightDuration}ms` : '500ms'} cubic-bezier(0.33, 0.05, 0.15, 1), opacity 400ms ease`
      }}
      aria-hidden="true"
    >
      <div
        onClick={onTap}
        onTouchStart={onTap}
        className="relative w-14 h-14 flex items-center justify-center cursor-pointer pointer-events-auto select-none"
        style={{ touchAction: 'manipulation' }}
        title="Tap butterfly"
      >
        {/* Dynamic Grounding Bioluminescent Shadow */}
        <div
          className="absolute pointer-events-none transition-all duration-400"
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
            filter: isFlying ? 'blur(4px)' : 'blur(1.2px)'
          }}
        />

        {/* 3D Butterfly Container with Dynamic Facing, Stance & Glow */}
        <div
          className={`relative flex items-center justify-center transform-gpu ${
            isStartled ? 'animate-butterfly-startle' : isFlying ? 'animate-butterfly-bob' : ''
          }`}
          style={{
            transform: `scaleX(${facing === 'left' ? -1 : 1}) rotate(${tilt}deg)`,
            perspective: '600px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            filter: isFlying 
              ? 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.5)) drop-shadow(0 2px 8px rgba(37, 99, 235, 0.35))'
              : wingPose === 'open'
                ? 'drop-shadow(0 2px 6px rgba(0, 180, 255, 0.4))'
                : 'drop-shadow(0 1px 4px rgba(0, 160, 255, 0.3))'
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
