'use client';

import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { NavRouteItem } from '@/constants/tokens';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AmbientGlow } from './ui/AmbientGlow';
import { TechnicalGrid } from './ui/TechnicalGrid';
import { GradientButton } from './ui/GradientButton';

interface CTASectionProps {
  onNavigate: (item: NavRouteItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate }) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="cta-contact"
      aria-labelledby="final-cta-heading"
      className="relative bg-gradient-corporate-blue py-20 sm:py-24 lg:py-28 overflow-hidden border-b border-white/10"
    >
      {/* Animated Blue & Cyan Radial Gradients */}
      <AmbientGlow
        tone="blue"
        position="center"
        sizeClass="w-[420px] h-[300px] sm:w-[720px] sm:h-[420px]"
      />
      <AmbientGlow
        tone="cyan"
        position="top-right"
        hideOnMobile
        sizeClass="w-[460px] h-[460px]"
      />

      {/* Subtle Animated Engineering Grid + Connected Nodes + Particles */}
      <TechnicalGrid
        theme="dark"
        showNodes
        showParticles
        opacityClass="opacity-70"
      />

      <div
        ref={ref}
        className={`relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 reveal-hidden ${
          isVisible ? 'reveal-visible' : ''
        }`}
      >
        <div className="max-w-[880px] mx-auto text-center">
          {/* Minimal Safety Yellow Accent Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
            <span className="text-[11.5px] font-bold tracking-[0.12em] uppercase text-white">
              PARTNER WITH DRIVVIZE
            </span>
          </div>

          {/* Headline */}
          <h2
            id="final-cta-heading"
            className="text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold text-white leading-[1.1] tracking-[-0.025em]"
          >
            Building the Future of Automotive Safety?
          </h2>

          {/* Description */}
          <p className="text-[17px] sm:text-[19px] text-[#DCE3EA] mt-5 max-w-[660px] mx-auto leading-[1.65]">
            Let&apos;s work together to make your automotive products safe, secure and ready
            for the future.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <GradientButton
              href="/contact"
              variant="primary-gradient"
              size="lg"
              onClick={(e) =>
                onNavigate(
                  { label: 'Talk to Our Experts', href: '/contact', sectionAnchor: 'cta-contact' },
                  e
                )
              }
              className="px-8"
            >
              <span>Talk to Our Experts</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1" />
            </GradientButton>

            <GradientButton
              href="/functional-safety-services"
              variant="secondary-glass-dark"
              size="lg"
              onClick={(e) =>
                onNavigate(
                  {
                    label: 'Explore Our Services',
                    href: '/functional-safety-services',
                    sectionAnchor: 'capabilities',
                  },
                  e
                )
              }
              className="px-8"
            >
              <Layers className="w-4 h-4 text-[#FACC15]" />
              <span>Explore Our Services</span>
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
};

