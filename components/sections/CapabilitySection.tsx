'use client';

import React from 'react';
import {
  ShieldCheck,
  Compass,
  Lock,
  FileCheck2,
  RefreshCw,
  Network,
  Code2,
} from 'lucide-react';
import { AnimatedGradientBackground } from '@/components/ui/AnimatedGradientBackground';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  standardTag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    title: 'Build Automotive Products Safe and Secure from Scratch',
    description:
      'Build automotive products safe and secure from scratch following ISO 26262 and ISO 21434 standards.',
    standardTag: 'ISO 26262 & ISO 21434',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Navigate Evolving ADAS Regulations',
    description: 'Navigate the new evolving regulations for ADAS.',
    standardTag: 'ADAS REGULATORY',
    icon: Compass,
  },
  {
    number: '03',
    title: 'Strengthen Product Cyber Resilience',
    description: 'Make your products cyber resilient as per EU-CRA standards.',
    standardTag: 'EU-CRA COMPLIANCE',
    icon: Lock,
  },
  {
    number: '04',
    title: 'Develop Certification-Ready Processes',
    description:
      'Build certification-ready processes for functional safety and cybersecurity.',
    standardTag: 'PROCESS ARCHITECTURE',
    icon: FileCheck2,
  },
  {
    number: '05',
    title: 'Adapt Existing Automotive Products',
    description: 'Adapt pre-built Automotive products to become safe and secure.',
    standardTag: 'LEGACY TO SAFE',
    icon: RefreshCw,
  },
  {
    number: '06',
    title: 'Scale Systems and Vehicle Architectures',
    description:
      'Scale pre-defined Systems and vehicle architectures for future capabilities.',
    standardTag: 'SYSTEM SCALABILITY',
    icon: Network,
  },
  {
    number: '07',
    title: 'Build Certification-Ready Automotive Software and Tools',
    description: 'Build certification-ready Automotive SW and tools.',
    standardTag: 'SW & TOOL QUALIFICATION',
    icon: Code2,
  },
];

export const CapabilitySection: React.FC = () => {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative border-b border-[#DCE3EA]/80"
    >
      <AnimatedGradientBackground
        variant="light-corporate"
        showGrid
        showOrbs
        className="py-16 sm:py-20 lg:py-24"
      >
        <SectionContainer>
          <SectionHeader
            headingId="capabilities-heading"
            eyebrow="ENGINEERING PARTNERSHIP MODEL"
            title="We partner with you to:"
            description="Structured functional safety, cybersecurity, and systems engineering tailored to your product maturity and regulatory roadmap."
            className="mb-12 lg:mb-14"
          />

          {/* Seven-item Structured 12-Column Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 lg:gap-6">
            {CAPABILITIES.map((item, index) => {
              const IconComponent = item.icon;
              const lgColSpan = index < 4 ? 'lg:col-span-3' : 'lg:col-span-4';
              const mdColSpan = index === 6 ? 'md:col-span-6' : 'md:col-span-3';

              return (
                <article
                  key={item.number}
                  style={{ transitionDelay: `${index * 55}ms` }}
                  className={`${mdColSpan} ${lgColSpan} group relative overflow-hidden rounded-[14px] bg-white border border-[#DCE3EA] hover:border-[#06B6D4] p-6 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1 shadow-[0_2px_10px_-3px_rgba(11,37,69,0.04)] hover:shadow-[0_20px_38px_-12px_rgba(37,99,235,0.13)] flex flex-col justify-between`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#0D9488] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-11 h-11 rounded-[10px] bg-[#F1F5F9] group-hover:bg-gradient-to-br group-hover:from-[#2563EB] group-hover:to-[#06B6D4] border border-[#DCE3EA] group-hover:border-transparent flex items-center justify-center transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] group-hover:bg-[#06B6D4] transition-colors duration-300" />
                        <span
                          style={{ fontFamily: 'var(--font-heading)' }}
                          className="text-[13px] font-bold tracking-[0.08em] text-[#315B7D] group-hover:text-[#0B2545] transition-colors"
                        >
                          {item.number}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-[1.32] transition-colors duration-250">
                      {item.title}
                    </h3>

                    <p className="text-[14.5px] sm:text-[15px] text-[#202B36]/85 leading-[1.62] mt-2.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-[#F1F5F9] group-hover:border-[#DCE3EA] flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#315B7D] group-hover:text-[#0D9488] transition-colors">
                      {item.standardTag}
                    </span>
                    <span className="w-4 h-[2px] rounded-full bg-[#DCE3EA] group-hover:w-8 group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#06B6D4] transition-all duration-300" />
                  </div>
                </article>
              );
            })}
          </div>
        </SectionContainer>
      </AnimatedGradientBackground>
    </section>
  );
};

