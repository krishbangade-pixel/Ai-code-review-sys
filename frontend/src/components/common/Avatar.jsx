import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

/**
 * Reusable Avatar component for profile pictures and fallback placeholders.
 * Ensures consistent circular styling and prevents stretching/distortion.
 * 
 * @param {Object} props
 * @param {string} props.src - The image URL path.
 * @param {string} props.alt - Alternate text/tooltip title.
 * @param {string} props.className - Tailwind dimension and border classes (defaults to w-9 h-9).
 * @param {function} props.onClick - Click callback.
 */
export default function Avatar({ src, alt = 'Avatar', className = 'w-9 h-9', onClick }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync state if source prop updates
  useEffect(() => {
    setImgSrc(src);
    setHasError(!src);
  }, [src]);

  // Handle broken/invalid image URLs by falling back to the placeholder icon
  const handleLoadError = () => {
    setHasError(true);
  };

  // Select appropriate Lucide User icon size based on dimensions of the container
  const getIconSize = () => {
    if (className.includes('w-7') || className.includes('h-7')) return 14;
    if (className.includes('w-8') || className.includes('h-8')) return 16;
    if (className.includes('w-9') || className.includes('h-9')) return 18;
    if (className.includes('w-10') || className.includes('h-10')) return 20;
    if (className.includes('w-32') || className.includes('h-32')) return 64;
    return 20;
  };

  // Fallback styling with a circular container and user icon placeholder
  if (hasError || !imgSrc) {
    return (
      <div 
        onClick={onClick}
        className={`rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0 overflow-hidden select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title={alt}
      >
        <User size={getIconSize()} />
      </div>
    );
  }

  // Circular, non-stretch cover-fit profile avatar
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleLoadError}
      onClick={onClick}
      className={`rounded-full object-cover shrink-0 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    />
  );
}
