'use client';

import React from 'react';
import Image from 'next/image';
import { UserCheck, ArrowUpRight } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface FounderProfile {
  id: string;
  indexLabel: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  roleTitle: string;
  linkedinUrl: string;
  biography: string;
}

const FOUNDERS: FounderProfile[] = [
  {
    id: 'founder-01',
    indexLabel: 'FOUNDER 01',
    name: 'Nageswaran Jayaraman',
    imageSrc: '/images/founders/Nagesh_edited.jpg',
    imageAlt: 'Nageswaran Jayaraman — Co-Founder of Drivvize',
    roleTitle: 'Co-Founder & Leadership',
    linkedinUrl:
      'https://www.linkedin.com/search/results/people/?keywords=Nageswaran%20Jayaraman%20Drivvize',
    biography:
      'Nagesh has over 22 years of experience in the Automotive. He is a visionary leader who has successfully built FuSa and Cybersecurity teams globally and successfully delivered over 30 ASIL programs and 5 Cybersecurity programs.',
  },
  {
    id: 'founder-02',
    indexLabel: 'FOUNDER 02',
    name: 'Sridharan Subramani',
    imageSrc: '/images/founders/Sridhar_edited_edited.jpg',
    imageAlt: 'Sridharan Subramani — Co-Founder of Drivvize',
    roleTitle: 'Co-Founder & Leadership',
    linkedinUrl:
      'https://www.linkedin.com/search/results/people/?keywords=Sridharan%20Subramani%20Drivvize',
    biography:
      'Sridhar has over 20 years of experience in Automotive and is an expert in FuSa across Systems, SW, HW, Manufacturing and Safety Management. He builds simple, scalable, efficient and certifiable processes for Functional Safety and Cybersecurity.',
  },
  {
    id: 'founder-03',
    indexLabel: 'FOUNDER 03',
    name: 'Sowmya Radhakrishnan',
    imageSrc: '/images/founders/Sowmya_edited.jpg',
    imageAlt: 'Sowmya Radhakrishnan — Co-Founder of Drivvize',
    roleTitle: 'Co-Founder & Leadership',
    linkedinUrl:
      'https://www.linkedin.com/search/results/people/?keywords=Sowmya%20Radhakrishnan%20Drivvize',
    biography:
      'Sowmya has over 22 years of experience in Automotive and is an Expert in Systems and Software Safety. Her experience as a SW Architect gives her an edge in offering practical and customized solutions to SW and System Safety challenges. She is also an expert in training technical teams and regularly performs technical FuSa audits and assessments.',
  },
];

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const FoundersSection: React.FC = () => {
  return (
    <section
      id="founders"
      aria-labelledby="founders-heading"
      className="relative bg-gradient-light-corporate py-16 sm:py-20 lg:py-24 border-b border-[#DCE3EA]/80"
    >
      <SectionContainer>
        <SectionHeader
          headingId="founders-heading"
          layout="stacked"
          eyebrow="EXECUTIVE LEADERSHIP"
          eyebrowDotClass="bg-[#2563EB]"
          title="The Founders"
          description="Leadership driven by deep automotive engineering experience and a commitment to making products safe, secure and reliable."
          className="mb-12 lg:mb-14"
        />

        {/* Three Founder Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
          {FOUNDERS.map((founder, idx) => (
            <article
              key={founder.id}
              style={{ transitionDelay: `${idx * 75}ms` }}
              className="group rounded-[15px] bg-white border border-[#DCE3EA] hover:border-[#06B6D4] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-[0_2px_12px_-3px_rgba(11,37,69,0.04)] hover:shadow-[0_22px_44px_-12px_rgba(37,99,235,0.13)] flex flex-col"
            >
              {/* Founder Portrait Container */}
              <div className="relative h-[280px] sm:h-[296px] bg-[#F8FAFC] overflow-hidden border-b border-[#DCE3EA]">
                <Image
                  src={founder.imageSrc}
                  alt={founder.imageAlt}
                  width={806}
                  height={668}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                {/* Subtle edge & bottom vignette for uniform polish across portraits */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/18 via-transparent to-[#0B2545]/5 pointer-events-none"
                />

                {/* Founder Index Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 rounded bg-[#0B2545]/85 backdrop-blur-xs border border-white/20 text-[10.5px] font-mono font-semibold tracking-wider text-white shadow-xs">
                    {founder.indexLabel}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.06em] uppercase text-[#2563EB] mb-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{founder.roleTitle}</span>
                  </div>

                  <h3 className="text-[22px] sm:text-[24px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-snug transition-colors">
                    {founder.name}
                  </h3>

                  <div className="w-10 h-[2px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#FACC15] my-4 group-hover:w-16 transition-all duration-300" />

                  <p className="text-[15px] text-[#202B36]/90 leading-[1.68]">
                    {founder.biography}
                  </p>
                </div>

                {/* Card Footer with LinkedIn Button */}
                <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    DRIVVIZE LEADERSHIP
                  </span>

                  <a
                    href={founder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with ${founder.name} on LinkedIn`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#DCE3EA] bg-[#F8FAFC] hover:bg-[#0A66C2] text-[#0B2545] hover:text-white hover:border-[#0A66C2] text-[12px] font-semibold transition-all duration-200 shadow-2xs hover:shadow-[0_6px_16px_-4px_rgba(10,102,194,0.4)]"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
};
