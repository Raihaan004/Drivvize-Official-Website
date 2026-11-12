'use client';

import React from 'react';
import { UserCheck } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FounderProfile {
  id: string;
  indexLabel: string;
  name: string;
  initials: string;
  rolePlaceholder: string;
  biography: string;
}

const FOUNDERS: FounderProfile[] = [
  {
    id: 'founder-01',
    indexLabel: 'FOUNDER 01',
    name: 'Nageswaran Jayaraman',
    initials: 'NJ',
    rolePlaceholder: 'Founder Role Placeholder',
    biography:
      'Nagesh has over 22 years of experience in the Automotive. He is a visionary leader who has successfully built FuSa and Cybersecurity teams globally and successfully delivered over 30 ASIL programs and 5 Cybersecurity programs.',
  },
  {
    id: 'founder-02',
    indexLabel: 'FOUNDER 02',
    name: 'Sridharan Subramani',
    initials: 'SS',
    rolePlaceholder: 'Founder Role Placeholder',
    biography:
      'Sridhar has over 20 years of experience in Automotive and is an expert in FuSa across Systems, SW, HW, Manufacturing and Safety Management. He builds simple, scalable, efficient and certifiable processes for Functional Safety and Cybersecurity.',
  },
  {
    id: 'founder-03',
    indexLabel: 'FOUNDER 03',
    name: 'Sowmya Radhakrishnan',
    initials: 'SR',
    rolePlaceholder: 'Founder Role Placeholder',
    biography:
      'Sowmya has over 22 years of experience in Automotive and is an Expert in Systems and Software Safety. Her experience as a SW Architect gives her an edge in offering practical and customized solutions to SW and System Safety challenges. She is also an expert in training technical teams and regularly performs technical FuSa audits and assessments.',
  },
];

export const FoundersSection: React.FC = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="founders"
      aria-labelledby="founders-heading"
      className="relative bg-gradient-light-corporate py-16 sm:py-20 lg:py-24 border-b border-[#DCE3EA]/80"
    >
      <div
        ref={ref}
        className={`max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 reveal-hidden ${
          isVisible ? 'reveal-visible' : ''
        }`}
      >
        {/* Section Header */}
        <div className="max-w-[740px] mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white border border-[#DCE3EA] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
              EXECUTIVE LEADERSHIP
            </span>
          </div>
          <h2
            id="founders-heading"
            className="text-[32px] sm:text-[40px] lg:text-[46px] font-bold text-[#0B2545] leading-[1.12] tracking-[-0.022em]"
          >
            The Founders
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#202B36] mt-4 leading-[1.65]">
            Leadership driven by deep automotive engineering experience and a commitment to
            making products safe, secure and reliable.
          </p>
        </div>

        {/* Three Founder Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
          {FOUNDERS.map((founder, idx) => (
            <article
              key={founder.id}
              style={{ transitionDelay: `${idx * 75}ms` }}
              className="group rounded-[15px] bg-white border border-[#DCE3EA] hover:border-[#06B6D4] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-[0_2px_12px_-3px_rgba(11,37,69,0.04)] hover:shadow-[0_22px_44px_-12px_rgba(37,99,235,0.13)] flex flex-col"
            >
              {/* Replaceable Portrait Placeholder with Subtle Hover Treatment */}
              <div className="relative h-[280px] sm:h-[296px] bg-gradient-corporate-blue overflow-hidden border-b border-[#DCE3EA]">
                {/* Subtle Engineering Grid Background inside Portrait Frame */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 engineering-grid-dark opacity-65 transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Soft Blue & Cyan Radial Illumination */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] h-[180px] rounded-full bg-[#06B6D4]/25 blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-95"
                />

                {/* Corner Architectural Crop Marks */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur-xs border border-white/15 text-[10.5px] font-mono font-semibold tracking-wider text-white">
                    {founder.indexLabel}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur-xs border border-dashed border-white/25 text-[10px] font-mono uppercase tracking-wider text-[#DCE3EA]">
                    Portrait Placeholder
                  </span>
                </div>

                {/* Architectural Silhouette & Monogram Avatar Placeholder */}
                <div className="relative z-10 h-full flex flex-col items-center justify-end pt-10 pb-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                  {/* Initials Badge */}
                  <div className="w-18 h-18 rounded-full bg-white/10 border-2 border-[#06B6D4] flex items-center justify-center shadow-lg mb-2 relative">
                    <span
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="text-[22px] font-extrabold tracking-wider text-white"
                    >
                      {founder.initials}
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FACC15] border-2 border-[#0B2545]" />
                  </div>

                  {/* Minimalist Shoulders Silhouette SVG */}
                  <svg
                    viewBox="0 0 220 90"
                    className="w-[210px] h-[84px] text-white/12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M25 90 C32 42, 72 24, 110 24 C148 24, 188 42, 195 90 Z"
                      fill="currentColor"
                      stroke="#06B6D4"
                      strokeOpacity="0.55"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Optional Role Placeholder Badge */}
                  <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.06em] uppercase text-[#2563EB] mb-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{founder.rolePlaceholder}</span>
                  </div>

                  {/* Founder Name */}
                  <h3 className="text-[22px] sm:text-[24px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-snug transition-colors">
                    {founder.name}
                  </h3>

                  {/* Divider */}
                  <div className="w-10 h-[2px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#FACC15] my-4 group-hover:w-16 transition-all duration-300" />

                  {/* Exact Biography */}
                  <p className="text-[15px] text-[#202B36]/90 leading-[1.68]">
                    {founder.biography}
                  </p>
                </div>

                {/* Subtle Footer Line */}
                <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                  <span>DRIVVIZE LEADERSHIP</span>
                  <span className="w-2 h-2 rounded-full bg-[#DCE3EA] group-hover:bg-[#06B6D4] transition-colors" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

