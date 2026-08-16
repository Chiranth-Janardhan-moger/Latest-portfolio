import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scaleHover?: number;
  glareEffect?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 5,
  scaleHover = 1.012,
  glareEffect = true,
  onClick,
  id,
  tabIndex,
  role,
  onKeyDown,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth 3D tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring physics matching HarmonyOS NEXT gravitational inertia
  const springConfig = { damping: 26, stiffness: 380, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform coordinates to 3D rotation angles
  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      style={{
        perspective: 1100,
      }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: scaleHover }}
        whileTap={{ scale: 0.985 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        id={id}
        tabIndex={tabIndex}
        role={role}
        onKeyDown={onKeyDown}
        className={`relative will-change-transform ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
}
