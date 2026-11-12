'use client';

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  reveal?: boolean;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  threshold = 0.14,
  reveal = true,
}) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold,
    triggerOnce: true,
  });

  return (
    <div
      ref={reveal ? ref : undefined}
      className={`relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 ${
        reveal ? `reveal-hidden ${isVisible ? 'reveal-visible' : ''}` : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

