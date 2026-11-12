'use client';

import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { GradientButton } from '@/components/ui/GradientButton';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { useNavigation } from '@/components/layout/NavigationContext';

export const CTASection: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <section
      id="cta-contact"
      aria-labelledby="final-cta-heading"
      className="relative bg-gradient-corporate-blue py-20 sm:py-24 lg:py-28 overflow-hidden border-b border-white/10"
    >
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

      <TechnicalGrid
        theme="dark"
        showNodes
        showParticles
        opacityClass="opacity-70"
      />

      <SectionContainer>
        <div className="max-w-[880px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
            <span className="text-[11.5px] font-bold tracking-[0.12em] uppercase text-white">
              PARTNER WITH DRIVVIZE
            </span>
          </div>

          <h2
            id="final-cta-heading"
            className="text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold text-white leading-[1.1] tracking-[-0.025em]"
          >
            Building the Future of Automotive Safety?
          </h2>

          <p className="text-[17px] sm:text-[19px] text-[#DCE3EA] mt-5 max-w-[660px] mx-auto leading-[1.65]">
            Let&apos;s work together to make your automotive products safe, secure and ready
            for the future.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <GradientButton
              href="/contact"
              variant="primary-gradient"
              size="lg"
              onClick={(e) =>
                navigate(
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
                navigate(
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
      </SectionContainer>
    </section>
  );
};

