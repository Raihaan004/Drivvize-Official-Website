import React from 'react';
import Image from 'next/image';

interface DrivvizeLogoProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
}

export const DrivvizeLogo: React.FC<DrivvizeLogoProps> = ({
  variant = 'light',
  compact = false,
  className = '',
}) => {
  const isDarkSurface = variant === 'dark';

  const imageClasses = compact
    ? 'h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]'
    : 'h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]';

  return (
    <span
      className={`inline-flex items-center select-none group ${
        isDarkSurface
          ? 'rounded-[12px] bg-white/95 px-3.5 py-2 border border-white/20 shadow-[0_8px_22px_-6px_rgba(0,0,0,0.45)]'
          : ''
      } ${className}`}
      aria-label="Drivvize Home"
    >
      <Image
        src="/images/logo/Drivvize_logo.png"
        alt="Drivvize — Drive. Vision. Realize."
        width={6563}
        height={2228}
        sizes="(max-width: 640px) 130px, 150px"
        loading={isDarkSurface ? 'lazy' : 'eager'}
        className={imageClasses}
      />
    </span>
  );
};
