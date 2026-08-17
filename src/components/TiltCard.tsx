import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'motion/react';

interface TiltCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scaleHover?: number;
  glareEffect?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 4,
  scaleHover = 1.01,
  glareEffect = true,
  onClick,
  id,
  tabIndex,
  role,
  onKeyDown,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth 3D tracking centered at 0.5
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Silky smooth spring physics to prevent any micro-jitter or glitching
  const springConfig = { damping: 32, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform coordinates to gentle 3D rotation angles
  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
      }}
      className="relative will-change-transform"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: scaleHover,
        }}
        whileTap={{ scale: 0.99 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 26,
          mass: 0.5
        }}
        onClick={onClick}
        id={id}
        tabIndex={tabIndex}
        role={role}
        onKeyDown={onKeyDown}
        className={`relative ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
}
