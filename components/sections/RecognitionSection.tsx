'use client';

import React from 'react';
import {
  ExternalLink,
  BookOpen,
  Mic2,
  Handshake,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface ConferenceRecognitionItem {
  id: string;
  title: string;
  description: string;
  roleBadge: 'MEDIA PARTNER' | 'SPEAKER';
  yearOrRegion: string;
}

const CONFERENCE_ITEMS: ConferenceRecognitionItem[] = [
  {
    id: 'REC-02',
    title: 'Auto IQ Safety Conference',
    description: 'Media partners for Auto IQ safety conference.',
    roleBadge: 'MEDIA PARTNER',
    yearOrRegion: 'INTERNATIONAL',
  },
  {
    id: 'REC-03',
    title: 'NEV Conference in Europe',
    description: 'Media partners for NEV conference in Europe.',
    roleBadge: 'MEDIA PARTNER',
    yearOrRegion: 'EUROPE',
  },
  {
    id: 'REC-04',
    title: 'CII Conference, 2024',
    description: 'Speaker at CII Conference, 2024.',
    roleBadge: 'SPEAKER',
    yearOrRegion: '2024',
  },
  {
    id: 'REC-05',
    title: 'Embedded Safety and Security Conference, 2024',
    description: 'Speaker at Embedded Safety and Security Conference, 2024.',
    roleBadge: 'SPEAKER',
    yearOrRegion: '2024',
  },
  {
    id: 'REC-06',
    title: 'SDV Conference, 2025',
    description: 'Speaker at SDV Conference, 2025 in IIT Chennai.',
    roleBadge: 'SPEAKER',
    yearOrRegion: '2025 // IIT CHENNAI',
  },
  {
    id: 'REC-07',
    title: 'Ansys Conference, 2025',
    description: 'Speaker at Ansys Conference, 2025.',
    roleBadge: 'SPEAKER',
    yearOrRegion: '2025',
  },
];

export const RecognitionSection: React.FC = () => {
  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="relative bg-white py-16 sm:py-20 lg:py-24 border-b border-[#DCE3EA]"
    >
      <SectionContainer>
        <SectionHeader
          headingId="recognition-heading"
          eyebrow="THOUGHT LEADERSHIP & CONFERENCES"
          eyebrowDotClass="bg-[#FACC15]"
          eyebrowBadgeClass="bg-[#F1F5F9] border border-[#DCE3EA]"
          title="Industry Recognition"
          description="Contributing to the global functional safety and automotive cybersecurity community through technical publications, media partnerships, and keynote sessions."
        />

        {/* Achievement 01 — Featured Card: Functional Safety First */}
        <div className="mb-8 rounded-[16px] bg-gradient-corporate-blue text-white border border-[#315B7D]/50 shadow-[0_20px_48px_-12px_rgba(11,37,69,0.28)] overflow-hidden relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 engineering-grid-dark opacity-60 pointer-events-none"
          />
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-[11px] font-bold tracking-[0.08em] uppercase">
                  <BookOpen className="w-3.5 h-3.5 text-[#FACC15]" />
                  01 // INDUSTRY KNOWLEDGE PLATFORM
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FACC15] text-[11px] font-bold tracking-[0.06em]">
                  <Eye className="w-3.5 h-3.5" />
                  More than 400K viewers till now.
                </span>
              </div>

              <h3 className="text-[26px] sm:text-[32px] font-bold text-white leading-tight">
                Functional Safety First
              </h3>

              <p className="text-[15.5px] sm:text-[16.5px] text-[#DCE3EA] leading-relaxed">
                Authors of the popular safety website:{' '}
                <a
                  href="https://www.functionalsafetyfirst.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold underline decoration-[#FACC15] decoration-2 underline-offset-4 hover:text-[#FACC15] transition-colors break-all"
                >
                  https://www.functionalsafetyfirst.com/
                </a>
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.functionalsafetyfirst.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:opacity-95 text-white text-[14px] font-semibold transition-all duration-250 shadow-[0_8px_22px_-4px_rgba(6,182,212,0.45)] group"
                >
                  <span>Visit Functional Safety First</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[13px] bg-white/8 backdrop-blur-md border border-white/15 p-5 sm:p-6 flex flex-col justify-between gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="px-2.5 py-1 rounded bg-white/10 border border-dashed border-white/30 text-[10px] font-mono uppercase tracking-wider text-[#DCE3EA]">
                      LOGO PLACEHOLDER
                    </div>
                    <span className="text-[12px] font-semibold text-white">
                      functionalsafetyfirst.com
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="text-[38px] sm:text-[44px] font-extrabold text-white leading-none"
                    >
                      400K<span className="text-[#FACC15]">+</span>
                    </span>
                    <p className="text-[13px] text-[#DCE3EA] mt-1.5">
                      More than 400K viewers till now.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#DCE3EA]/75">
                      PUBLICATION REACH
                    </span>
                    <div className="mt-1.5 flex items-center justify-end gap-1">
                      <span className="w-6 h-1.5 rounded-full bg-[#2563EB]" />
                      <span className="w-4 h-1.5 rounded-full bg-[#2563EB]/70" />
                      <span className="w-2 h-1.5 rounded-full bg-[#FACC15]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements 02 to 07 — Editorial Conference Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONFERENCE_ITEMS.map((item, idx) => {
            const isSpeaker = item.roleBadge === 'SPEAKER';
            return (
              <article
                key={item.id}
                className="group relative rounded-[14px] bg-white border border-[#DCE3EA] hover:border-[#06B6D4] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 shadow-[0_2px_10px_-3px_rgba(11,37,69,0.04)] hover:shadow-[0_18px_36px_-12px_rgba(37,99,235,0.12)] flex flex-col justify-between"
              >
                <div
                  aria-hidden="true"
                  className="h-[3px] w-full bg-gradient-to-r from-[#0B2545] via-[#2563EB] to-[#06B6D4] opacity-75 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative h-[156px] bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/65 border-b border-[#DCE3EA] p-4 flex flex-col justify-between overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 engineering-grid-light opacity-70 pointer-events-none"
                  />

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white/90 border border-dashed border-[#315B7D]/45 text-[10px] font-mono font-semibold text-[#315B7D] tracking-wider uppercase">
                      <span>CONF. LOGO PLACEHOLDER</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#0B2545] bg-white/85 px-2 py-0.5 rounded border border-[#DCE3EA]">
                      0{idx + 2}
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-xs border border-[#DCE3EA] text-[#315B7D] group-hover:border-[#2563EB]/50 group-hover:text-[#0B2545] transition-colors">
                      <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="text-[11px] font-medium tracking-wide">
                        Event Photograph Frame
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-[0.06em] uppercase ${
                        isSpeaker
                          ? 'bg-[#0B2545] text-white'
                          : 'bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white'
                      }`}
                    >
                      {isSpeaker ? (
                        <Mic2 className="w-3 h-3 text-[#FACC15]" />
                      ) : (
                        <Handshake className="w-3 h-3 text-[#FACC15]" />
                      )}
                      {item.roleBadge}
                    </span>

                    <span className="text-[10.5px] font-mono font-semibold text-[#315B7D]">
                      {item.yearOrRegion}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[18.5px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-[1.3] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[14.5px] text-[#202B36]/85 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#315B7D]">
                      DRIVVIZE REPRESENTATION
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#DCE3EA] group-hover:bg-[#FACC15] transition-colors" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
};

