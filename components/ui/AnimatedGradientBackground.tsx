import React from 'react';
import { AmbientGlow } from './AmbientGlow';
import { TechnicalGrid } from './TechnicalGrid';

export type GradientVariant =
  | 'corporate-blue' // Gradient A: Deep Navy (#0B2545) -> Technical Blue (#2563EB) -> Cyan (#06B6D4)
  | 'technical-innovation' // Gradient B: Technical Blue (#2563EB) -> Cyan (#06B6D4) -> Teal (#0D9488)
  | 'premium-dark' // Gradient C: Deep Navy (#0B2545) -> Slate (#202B36) -> Steel Blue (#315B7D)
  | 'light-corporate'; // Gradient D: White (#FFFFFF) -> Cool Grey (#F1F5F9) -> subtle blue/cyan tint

interface AnimatedGradientBackgroundProps {
  variant?: GradientVariant;
  showGrid?: boolean;
  showNodes?: boolean;
  showParticles?: boolean;
  showOrbs?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_SURFACE_MAP: Record<GradientVariant, string> = {
  'corporate-blue': 'bg-gradient-corporate-blue text-white',
  'technical-innovation': 'bg-gradient-technical-innovation text-white',
  'premium-dark': 'bg-gradient-premium-dark text-white',
  'light-corporate': 'bg-gradient-light-corporate text-[#202B36]',
};

export const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  variant = 'light-corporate',
  showGrid = true,
  showNodes = false,
  showParticles = false,
  showOrbs = true,
  className = '',
  children,
}) => {
  const isDark = variant !== 'light-corporate';

  return (
    <div
      className={`relative overflow-hidden ${VARIANT_SURFACE_MAP[variant]} ${className}`}
    >
      {showOrbs && (
        <>
          <AmbientGlow
            tone="blue"
            position="top-right"
            sizeClass="w-[320px] h-[320px] sm:w-[540px] sm:h-[540px]"
          />
          <AmbientGlow
            tone="cyan"
            position="bottom-left"
            hideOnMobile
            sizeClass="w-[460px] h-[460px]"
          />
        </>
      )}

      {showGrid && (
        <TechnicalGrid
          theme={isDark ? 'dark' : 'light'}
          showNodes={showNodes}
          showParticles={showParticles}
          opacityClass={isDark ? 'opacity-65' : 'opacity-75'}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

