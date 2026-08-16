import React, { useEffect, useRef } from 'react';

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export default function FluidDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 130,
      active: false,
    };

    const SPACING = 28;
    let dots: Dot[] = [];

    const initDots = () => {
      dots = [];
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * SPACING;
          const y = j * SPACING;
          dots.push({
            originX: x,
            originY: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            radius: 1.15,
            baseAlpha: 0.12,
          });
        }
      }
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initDots();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const waveTime = time * 0.0016;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Ambient fluid wave offset
        const waveX = Math.sin(waveTime + dot.originY * 0.007) * 2.2;
        const waveY = Math.cos(waveTime + dot.originX * 0.007) * 2.2;
        const targetX = dot.originX + waveX;
        const targetY = dot.originY + waveY;

        // Interactive mouse physics (elastic repulsion)
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && mouse.active) {
          const force = (1 - dist / mouse.radius) * 36;
          const angle = Math.atan2(dy, dx);
          dot.vx += Math.cos(angle) * force * 0.8;
          dot.vy += Math.sin(angle) * force * 0.8;
        }

        // Spring force returning to ambient wave target
        const springK = 0.08;
        const damping = 0.82;
        dot.vx += (targetX - dot.x) * springK;
        dot.vy += (targetY - dot.y) * springK;
        dot.vx *= damping;
        dot.vy *= damping;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Proximity dynamic styling
        let currentRadius = dot.radius;
        let alpha = dot.baseAlpha;

        if (dist < mouse.radius && mouse.active) {
          const proximityRatio = 1 - dist / mouse.radius;
          currentRadius = dot.radius + proximityRatio * 1.4;
          alpha = dot.baseAlpha + proximityRatio * 0.28;
        } else {
          // Subtle wave pulsing
          const wavePulse = (Math.sin(waveTime * 1.2 + (dot.originX + dot.originY) * 0.005) + 1) * 0.5;
          alpha = dot.baseAlpha + wavePulse * 0.04;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(18, 18, 18, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      id="fluid-dot-grid-container"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-80"
        id="fluid-dot-grid-canvas"
      />
      {/* Soft Vignette Mask to gracefully fade the dot grid at the screen perimeters */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(252, 251, 249, 0.6) 100%)'
        }}
      />
    </div>
  );
}
