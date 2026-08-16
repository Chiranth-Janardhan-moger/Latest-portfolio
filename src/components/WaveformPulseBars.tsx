import React from 'react';

interface WaveformPulseBarsProps {
  barCount?: number;
  className?: string;
}

export default function WaveformPulseBars({
  barCount = 5,
  className = ''
}: WaveformPulseBarsProps) {
  // Predefined staggered animation delays and base heights for smooth harmonic visualizer effect
  const bars = [
    { delay: '0ms', duration: '1100ms', minH: '4px', maxH: '16px' },
    { delay: '180ms', duration: '950ms', minH: '6px', maxH: '20px' },
    { delay: '350ms', duration: '1250ms', minH: '8px', maxH: '22px' },
    { delay: '120ms', duration: '850ms', minH: '5px', maxH: '18px' },
    { delay: '280ms', duration: '1050ms', minH: '3px', maxH: '14px' },
  ].slice(0, barCount);

  return (
    <div 
      className={`inline-flex items-end justify-center gap-[3px] h-5 px-1 select-none ${className}`}
      title="Live Audio / Telemetry Pulse"
      aria-hidden="true"
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          className="w-[2.5px] bg-ink rounded-full transition-all"
          style={{
            animation: `waveformPulse ${bar.duration} ease-in-out infinite alternate`,
            animationDelay: bar.delay,
            height: bar.minH,
          }}
        />
      ))}
      <style>{`
        @keyframes waveformPulse {
          0% {
            height: 4px;
            opacity: 0.45;
          }
          50% {
            height: 14px;
            opacity: 0.85;
          }
          100% {
            height: 20px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
