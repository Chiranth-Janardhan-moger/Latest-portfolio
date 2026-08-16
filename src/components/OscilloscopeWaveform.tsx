import React, { useEffect, useRef } from 'react';

interface OscilloscopeWaveformProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export default function OscilloscopeWaveform({
  width = 110,
  height = 20,
  color = '#111111',
  strokeWidth = 1.5,
  className = ''
}: OscilloscopeWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const midY = height / 2;
      const points = 48;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const normalizedX = (i / points) * Math.PI * 4;

        // Envelope function to smoothly taper the wave ends to zero at edges
        const envelope = Math.sin((i / points) * Math.PI);

        // Combined dual-frequency harmonic wave
        const y1 = Math.sin(normalizedX - phase) * (height * 0.38);
        const y2 = Math.sin(normalizedX * 2 + phase * 1.5) * (height * 0.12);
        const y = midY + (y1 + y2) * envelope;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      phase += 0.065;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, color, strokeWidth]);

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="block"
        title="Live Signal Waveform"
        aria-hidden="true"
      />
    </div>
  );
}
