'use client';

import React from 'react';
import { Globe2, Shield, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface StatMetric {
  targetValue: number;
  suffix: string;
  label: string;
  detail: string;
  highlightYellow?: boolean;
}

const STATISTICS: StatMetric[] = [
  {
    targetValue: 40,
    suffix: '+',
    label: 'Safety Projects end-to-end',
    detail: 'Concept phase through series production release',
    highlightYellow: true,
  },
  {
    targetValue: 35,
    suffix: '+',
    label: 'ASIL B Programs',
    detail: 'Delivered across global OEM & Tier-1 platforms',
  },
  {
    targetValue: 5,
    suffix: '+',
    label: 'ASIL D Programs',
    detail: 'Highest safety integrity level systems & actuators',
    highlightYellow: true,
  },
  {
    targetValue: 10,
    suffix: '+',
    label: 'Safety Assessments Held',
    detail: 'Independent technical audits, FSC/TSC & compliance reviews',
  },
  {
    targetValue: 15,
    suffix: '+',
    label: 'Safety-Critical Systems',
    detail: 'Steer-by-wire, braking, ADAS, BMS & domain controllers',
    highlightYellow: true,
  },
  {
    targetValue: 8,
    suffix: '+',
    label: 'Regions',
    detail: 'International engineering delivery & regulatory coverage',
  },
];

export const StatisticsSection: React.FC = () => {
  const { ref, isVisible, reducedMotion } = useScrollReveal<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      id="experience"
      aria-labelledby="statistics-heading"
      className="relative bg-gradient-premium-dark text-white py-16 sm:py-20 lg:py-24 border-b border-[#315B7D]/45 overflow-hidden"
    >
      <AmbientGlow
        tone="blue"
        position="top-left"
        sizeClass="w-[340px] h-[340px] sm:w-[540px] sm:h-[540px]"
      />
      <AmbientGlow
        tone="cyan"
        position="bottom-right"
        hideOnMobile
        sizeClass="w-[500px] h-[500px]"
      />

      <TechnicalGrid theme="dark" showNodes opacityClass="opacity-60" />

      <div
        ref={ref}
        className={`relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 reveal-hidden ${
          isVisible ? 'reveal-visible' : ''
        }`}
      >
        <SectionHeader
          headingId="statistics-heading"
          theme="dark"
          eyebrow="PROVEN TRACK RECORD"
          eyebrowDotClass="bg-[#FACC15]"
          title="Engineering Experience That Matters"
          className="mb-12"
          rightSlot={
            <div className="glass-panel-dark px-5 py-3.5 flex items-center gap-3.5 self-start lg:self-auto">
              <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center shrink-0">
                <Globe2 className="w-4 h-4 text-[#FACC15]" />
              </div>
              <div>
                <span className="block text-[10.5px] font-bold tracking-[0.1em] uppercase text-[#06B6D4]">
                  CROSS-SECTOR DOMAIN COVERAGE
                </span>
                <p className="text-[14.5px] sm:text-[15.5px] font-bold text-white">
                  Automotive, Agriculture and Marine Industry
                </p>
              </div>
            </div>
          }
        />

        {/* Structured Statistics Grid on Deep Navy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#0B2545]/75 backdrop-blur-md rounded-[16px] border border-white/14 shadow-[0_24px_52px_-16px_rgba(6,21,41,0.55)] overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/12">
          {STATISTICS.map((stat, index) => {
            const rowBorderClass =
              index >= 3
                ? 'lg:border-t lg:border-white/12 sm:border-t sm:border-white/12'
                : index >= 2
                ? 'sm:border-t sm:border-white/12 lg:border-t-0'
                : '';

            return (
              <div
                key={stat.label}
                className={`group p-7 sm:p-8 lg:p-9 bg-transparent hover:bg-white/[0.04] transition-colors duration-300 flex flex-col justify-between ${rowBorderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold text-[#94A3B8] tracking-wider">
                      METRIC // 0{index + 1}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        stat.highlightYellow
                          ? 'bg-[#FACC15]'
                          : 'bg-[#06B6D4] group-hover:bg-[#FACC15]'
                      }`}
                    />
                  </div>

                  <div
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-[44px] sm:text-[52px] lg:text-[56px] font-extrabold text-white leading-none tracking-[-0.03em] my-2"
                  >
                    <AnimatedCounter
                      target={stat.targetValue}
                      suffix={stat.suffix}
                      start={isVisible}
                      reducedMotion={reducedMotion}
                      suffixClassName={
                        stat.highlightYellow ? 'text-[#FACC15]' : 'text-[#06B6D4]'
                      }
                    />
                  </div>

                  <h3 className="text-[18px] sm:text-[19px] font-bold text-white group-hover:text-[#06B6D4] transition-colors mt-3 leading-snug">
                    {stat.label}
                  </h3>
                </div>

                <p className="text-[13.5px] text-[#DCE3EA]/75 mt-2.5 leading-relaxed">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar Highlighting Industry Statement */}
        <div className="mt-6 rounded-[14px] bg-white/8 backdrop-blur-md text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/14">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#FACC15] shrink-0" />
            <span className="text-[14px] sm:text-[15px] font-medium text-white">
              Trusted across the{' '}
              <strong className="font-bold text-[#FACC15]">
                Automotive, Agriculture and Marine Industry
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#DCE3EA]">
            <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
            <span>End-to-End Safety &amp; Cybersecurity Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};

