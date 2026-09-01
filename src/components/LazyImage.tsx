import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, RotateCcw } from 'lucide-react';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  placeholderClassName?: string;
  rootMargin?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  placeholderClassName = '',
  rootMargin = '200px',
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Use IntersectionObserver to start loading only when near/in viewport
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  // Check if image is already cached/complete once in view
  useEffect(() => {
    if (isInView && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [isInView, src]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoaded(false);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Animated Skeleton Shimmer Placeholder while waiting or loading */}
      {(!isLoaded || !isInView) && !hasError && (
        <div
          className={`absolute inset-0 bg-[#F0EDE6]/90 backdrop-blur-xs flex items-center justify-center z-10 select-none overflow-hidden rounded-[inherit] ${placeholderClassName}`}
          aria-hidden="true"
        >
          {/* Subtle moving shimmer highlight */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="w-5 h-5 rounded-full border-[1.5px] border-ink/15 border-t-ink animate-spin relative z-10" />
        </div>
      )}

      {/* Graceful Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-[#F7F6F2] border border-line/60 rounded-[inherit] flex flex-col items-center justify-center p-4 text-center z-10">
          <ImageOff size={22} className="text-ink-soft opacity-60 mb-1.5" />
          <span className="font-mono text-[11px] text-ink-soft block">Failed to load screenshot</span>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-ink bg-white border border-line/80 px-2.5 py-1 rounded-md shadow-2xs hover:bg-ink hover:text-paper transition-colors cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* The Image Element (Rendered with actual src only when in view) */}
      {isInView ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onContextMenu={(e) => {
            e.preventDefault();
            props.onContextMenu?.(e);
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`select-none pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLoaded
              ? 'opacity-100 scale-100 filter-none'
              : 'opacity-0 scale-[1.02] blur-xs'
          } ${className}`}
          {...props}
        />
      ) : null}
    </div>
  );
}
