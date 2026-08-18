import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Animated Skeleton Shimmer Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#F0EDE6]/80 animate-pulse rounded-[inherit] flex items-center justify-center z-10">
          <div className="w-5 h-5 rounded-full border-[1.5px] border-ink/15 border-t-ink animate-spin" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded 
            ? 'opacity-100 scale-100 filter-none' 
            : 'opacity-0 scale-[1.02] blur-xs'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
