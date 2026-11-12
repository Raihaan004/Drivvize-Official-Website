import React from 'react';

export type GlowTone = 'blue' | 'cyan' | 'teal' | 'navy';
export type GlowPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

interface AmbientGlowProps {
  tone?: GlowTone;
  position?: GlowPosition;
  sizeClass?: string;
  hideOnMobile?: boolean;
  className?: string;
}

const TONE_CLASS_MAP: Record<GlowTone, string> = {
  blue: 'orb-blue-primary',
  cyan: 'orb-cyan-ambient',
  teal: 'orb-cyan-ambient',
  navy: 'orb-navy-secondary',
};

const POSITION_CLASS_MAP: Record<GlowPosition, string> = {
  'top-right': '-top-28 -right-20',
  'top-left': '-top-28 -left-20',
  'bottom-left': '-bottom-28 -left-20',
  'bottom-right': '-bottom-28 -right-20',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  tone = 'blue',
  position = 'top-right',
  sizeClass = 'w-[340px] h-[340px] sm:w-[520px] sm:h-[520px]',
  hideOnMobile = false,
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${TONE_CLASS_MAP[tone]} ${POSITION_CLASS_MAP[position]} ${sizeClass} ${
        hideOnMobile ? 'hidden sm:block' : ''
      } ${className}`}
    />
  );
};

