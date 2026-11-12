'use client';

import React, { useState } from 'react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';

type SystemCategory = 'all' | 'chassis' | 'powertrain' | 'adas' | 'cockpit';

interface AutomotiveSystemItem {
  id: number;
  code: string;
  name: string;
  category: Exclude<SystemCategory, 'all'>;
  categoryLabel: string;
  schematicType:
    | 'steer'
    | 'mcu'
    | 'epb'
    | 'cluster'
    | 'cockpit'
    | 'abs'
    | 'fuelcell'
    | 'seats'
    | 'camera'
    | 'radar'
    | 'adas'
    | 'inverter'
    | 'brake'
    | 'tyres'
    | 'bms';
}

const SYSTEMS_LIST: AutomotiveSystemItem[] = [
  { id: 1, code: 'SYS-01', name: 'Steer-by-wire', category: 'chassis', categoryLabel: 'Chassis & Motion', schematicType: 'steer' },
  { id: 2, code: 'SYS-02', name: 'Motor Control Units', category: 'powertrain', categoryLabel: 'Powertrain & Energy', schematicType: 'mcu' },
  { id: 3, code: 'SYS-03', name: 'Electronic Parking Brakes', category: 'chassis', categoryLabel: 'Chassis & Motion', schematicType: 'epb' },
  { id: 4, code: 'SYS-04', name: 'Instrument Clusters', category: 'cockpit', categoryLabel: 'Cockpit & Body', schematicType: 'cluster' },
  { id: 5, code: 'SYS-05', name: 'Cockpit Domain Controllers', category: 'cockpit', categoryLabel: 'Cockpit & Body', schematicType: 'cockpit' },
  { id: 6, code: 'SYS-06', name: 'Anti-lock Braking System', category: 'chassis', categoryLabel: 'Chassis & Motion', schematicType: 'abs' },
  { id: 7, code: 'SYS-07', name: 'Fuel-cell Compressors', category: 'powertrain', categoryLabel: 'Powertrain & Energy', schematicType: 'fuelcell' },
  { id: 8, code: 'SYS-08', name: 'Seats', category: 'cockpit', categoryLabel: 'Cockpit & Body', schematicType: 'seats' },
  { id: 9, code: 'SYS-09', name: 'Front Camera', category: 'adas', categoryLabel: 'ADAS & Perception', schematicType: 'camera' },
  { id: 10, code: 'SYS-10', name: 'Radars', category: 'adas', categoryLabel: 'ADAS & Perception', schematicType: 'radar' },
  { id: 11, code: 'SYS-11', name: 'ADAS Controllers', category: 'adas', categoryLabel: 'ADAS & Perception', schematicType: 'adas' },
  { id: 12, code: 'SYS-12', name: 'Inverters', category: 'powertrain', categoryLabel: 'Powertrain & Energy', schematicType: 'inverter' },
  { id: 13, code: 'SYS-13', name: 'Brake-by-wire', category: 'chassis', categoryLabel: 'Chassis & Motion', schematicType: 'brake' },
  { id: 14, code: 'SYS-14', name: 'Tyres', category: 'chassis', categoryLabel: 'Chassis & Motion', schematicType: 'tyres' },
  { id: 15, code: 'SYS-15', name: 'Battery Management Systems', category: 'powertrain', categoryLabel: 'Powertrain & Energy', schematicType: 'bms' },
];

const CATEGORY_FILTERS: { id: SystemCategory; label: string }[] = [
  { id: 'all', label: 'All 15 Systems' },
  { id: 'chassis', label: 'Chassis & Motion' },
  { id: 'powertrain', label: 'Powertrain & Energy' },
  { id: 'adas', label: 'ADAS & Perception' },
  { id: 'cockpit', label: 'Cockpit & Body' },
];

const SystemSchematicIcon: React.FC<{ type: AutomotiveSystemItem['schematicType'] }> = ({
  type,
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
    >
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="8"
        className="fill-[#F1F5F9] group-hover:fill-[#0B2545] transition-colors duration-300"
      />
      <rect
        x="2.5"
        y="2.5"
        width="35"
        height="35"
        rx="7.5"
        className="stroke-[#DCE3EA] group-hover:stroke-[#06B6D4] transition-colors duration-300"
      />

      {type === 'steer' && (
        <>
          <circle cx="20" cy="18" r="8" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M12.5 18H27.5M20 18V26M14 29H26" stroke="#06B6D4" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="20" cy="18" r="2" fill="#FACC15" />
        </>
      )}

      {type === 'mcu' && (
        <>
          <rect x="12" y="12" width="16" height="16" rx="2.5" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M16 9V12M20 9V12M24 9V12M16 28V31M20 28V31M24 28V31M9 16H12M9 20H12M9 24H12M28 16H31M28 20H31M28 24H31" stroke="#06B6D4" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="20" r="2.2" fill="#0D9488" />
        </>
      )}

      {type === 'epb' && (
        <>
          <circle cx="20" cy="20" r="8.5" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M9.5 14.5C7.8 17.8 7.8 22.2 9.5 25.5M30.5 14.5C32.2 17.8 32.2 22.2 30.5 25.5" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M18 23V17H21C22.2 17 23 17.7 23 18.8C23 19.9 22.2 20.6 21 20.6H18" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}

      {type === 'cluster' && (
        <>
          <path d="M10 25A10 10 0 0 1 30 25" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M20 24L25 16" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="20" cy="24" r="2" fill="#FACC15" />
          <path d="M12 28H28" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}

      {type === 'cockpit' && (
        <>
          <rect x="9" y="12" width="22" height="13" rx="2" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M14 29H26M20 25V29M13 18.5H18M21 16.5H27M21 20.5H25" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15" cy="18.5" r="1.5" fill="#FACC15" />
        </>
      )}

      {type === 'abs' && (
        <>
          <circle cx="20" cy="20" r="7.5" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="3" stroke="#2563EB" strokeWidth="1.6" />
          <path d="M10 12L13 15M30 12L27 15M10 28L13 25M30 28L27 25" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {type === 'fuelcell' && (
        <>
          <circle cx="20" cy="20" r="9" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M20 11L24 20L20 29L16 20L20 11Z" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="2" fill="#FACC15" />
        </>
      )}

      {type === 'seats' && (
        <>
          <path d="M15 11V22C15 23.1 15.9 24 17 24H25" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 27.5H26M18 14H23M18 18H22" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="15" cy="11" r="2" fill="#2563EB" />
        </>
      )}

      {type === 'camera' && (
        <>
          <rect x="10" y="14" width="14" height="12" rx="2" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M24 17.5L30 14V26L24 22.5" stroke="#2563EB" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="17" cy="20" r="2.2" fill="#2563EB" />
        </>
      )}

      {type === 'radar' && (
        <>
          <circle cx="13" cy="20" r="2.2" fill="#FACC15" />
          <path d="M18 15.5C20.5 18 20.5 22 18 24.5" stroke="#06B6D4" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M22.5 12.5C26.5 16.5 26.5 23.5 22.5 27.5" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M27 9.5C32.5 15 32.5 25 27 30.5" stroke="#0D9488" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}

      {type === 'adas' && (
        <>
          <polygon points="20,10 29,15 29,25 20,30 11,25 11,15" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <circle cx="20" cy="20" r="3.2" stroke="#2563EB" strokeWidth="1.6" />
          <path d="M20 10V16.8M29 15L23 18.5M29 25L23 21.5M20 30V23.2M11 25L17 21.5M11 15L17 18.5" stroke="#2563EB" strokeWidth="1.2" />
        </>
      )}

      {type === 'inverter' && (
        <>
          <rect x="10" y="11" width="20" height="18" rx="2.5" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M13 16H21" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M17 24C18.5 21.5 20.5 21.5 22 24C23.5 26.5 25.5 26.5 27 24" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12" y1="27" x2="28" y2="13" stroke="#FACC15" strokeWidth="1.3" />
        </>
      )}

      {type === 'brake' && (
        <>
          <circle cx="19" cy="20" r="8" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M24 13.5C27.5 16 28.5 21 25.5 25.5" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M9 20H14" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="19" cy="20" r="2" fill="#FACC15" />
        </>
      )}

      {type === 'tyres' && (
        <>
          <rect x="13" y="9" width="14" height="22" rx="4" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M16 14L24 16M16 19L24 21M16 24L24 26" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}

      {type === 'bms' && (
        <>
          <rect x="9" y="13" width="20" height="14" rx="2" className="stroke-[#0B2545] group-hover:stroke-white transition-colors" strokeWidth="1.6" />
          <path d="M29 17.5H31V22.5H29" stroke="#06B6D4" strokeWidth="1.6" />
          <path d="M14 17V23M19 17V23M24 17V23" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="19" cy="13" r="1.6" fill="#FACC15" />
        </>
      )}
    </svg>
  );
};

export const SystemsShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SystemCategory>('all');

  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="relative bg-gradient-light-corporate py-16 sm:py-20 lg:py-24 border-b border-[#DCE3EA]/80 overflow-hidden"
    >
      <AmbientGlow
        tone="cyan"
        position="top-right"
        hideOnMobile
        sizeClass="w-[460px] h-[460px]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/45 to-transparent"
      />

      <SectionContainer>
        <SectionHeader
          headingId="systems-heading"
          eyebrow="AUTOMOTIVE ELECTRONIC & MECHATRONIC ARCHITECTURE"
          eyebrowDotClass="bg-[#0D9488]"
          title="Systems We Made Safer"
          rightSlot={
            <div
              role="group"
              aria-label="Highlight systems by vehicle domain"
              className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-[12px] border border-[#DCE3EA] shadow-2xs"
            >
              {CATEGORY_FILTERS.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-[#0B2545] to-[#163B68] text-white shadow-xs'
                        : 'text-[#315B7D] hover:text-[#0B2545] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          }
        />

        {/* 15-System Technical Card Grid (5x3 on desktop, consistent card dimensions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SYSTEMS_LIST.map((system) => {
            const isMatch =
              selectedCategory === 'all' || selectedCategory === system.category;

            return (
              <div
                key={system.id}
                className={`group relative overflow-hidden h-[152px] rounded-[13px] p-5 border transition-all duration-300 ease-out flex flex-col justify-between ${
                  isMatch
                    ? 'bg-white border-[#DCE3EA] hover:border-[#06B6D4] hover:-translate-y-1 shadow-[0_2px_8px_-2px_rgba(11,37,69,0.04)] hover:shadow-[0_16px_32px_-10px_rgba(6,182,212,0.16)] opacity-100'
                    : 'bg-[#F1F5F9]/45 border-[#DCE3EA]/60 opacity-45 hover:opacity-90'
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#0D9488] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="flex items-start justify-between gap-2">
                  <SystemSchematicIcon type={system.schematicType} />

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-semibold text-[#94A3B8] group-hover:text-[#0B2545] transition-colors">
                      {system.code}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        selectedCategory !== 'all' && isMatch
                          ? 'bg-[#FACC15]'
                          : 'bg-[#06B6D4] group-hover:bg-[#FACC15]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-[15.5px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-[1.28] transition-colors">
                    {system.name}
                  </h3>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10.5px] font-medium text-[#315B7D] group-hover:text-[#0D9488] transition-colors tracking-wide">
                      {system.categoryLabel}
                    </span>
                    <span className="w-3 h-[1.5px] bg-[#DCE3EA] group-hover:w-6 group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#06B6D4] transition-all duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
};

