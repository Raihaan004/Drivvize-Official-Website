'use client';

import React, { useEffect, useState } from 'react';

interface GlassNavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  children,
  className = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'glass-navbar py-3'
          : 'bg-white/95 backdrop-blur-md border-b border-[#DCE3EA]/75 py-4'
      } ${className}`}
    >
      {/* Subtle top Technical Blue -> Cyan -> Teal hairline accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#0B2545] via-[#2563EB] to-[#06B6D4] opacity-85"
      />
      {children}
    </header>
  );
};

