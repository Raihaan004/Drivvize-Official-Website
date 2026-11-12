'use client';

import React, { useState } from 'react';
import {
  Check,
  Minus,
  Layers,
  ShieldCheck,
  Sliders,
  Users,
  ArrowRight,
  Sparkles,
  FileCheck2,
  ClipboardCheck,
  BookOpen,
  GitBranch,
} from 'lucide-react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { AnimatedGradientBackground } from '@/components/ui/AnimatedGradientBackground';
import { GradientButton } from '@/components/ui/GradientButton';
import { useNavigation } from '@/components/layout/NavigationContext';

type EditionKey = 'basic' | 'custom' | 'consultant';

interface EditionInfo {
  key: EditionKey;
  code: string;
  name: string;
  shortLabel: string;
  tagline: string;
  consultingHours: string;
  badge?: string;
  accentGradient: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
}

interface ComparisonRow {
  parameter: string;
  basic: string;
  custom: string;
  consultant: string;
}

const EDITIONS: EditionInfo[] = [
  {
    key: 'basic',
    code: 'BASIC',
    name: 'ISO 26262 Kit: Basic Edition',
    shortLabel: 'Basic Edition',
    tagline:
      'Foundational ISO 26262 process assets for engineering teams establishing structured functional safety workflows.',
    consultingHours: '0',
    accentGradient: 'from-[#315B7D] to-[#2563EB]',
    icon: ShieldCheck,
    highlights: [
      'Complete ISO 26262 Workflow',
      'Standardized Templates',
      'Verification & Audit Checklists',
      'Practitioner Guidelines',
    ],
  },
  {
    key: 'custom',
    code: 'CUSTOM',
    name: 'ISO 26262 Kit: Custom Edition',
    shortLabel: 'Custom Edition',
    badge: 'POPULAR',
    tagline:
      'Tailored organizational deployment with portal integration and dedicated onboarding engineering hours.',
    consultingHours: '40',
    accentGradient: 'from-[#2563EB] to-[#06B6D4]',
    icon: Sliders,
    highlights: [
      'Everything in Basic Edition',
      'Integration to Customer Portal',
      'Customization for Organization (upon deployment)',
      '40 Hours 1:1 Consulting (excl. review hours)',
    ],
  },
  {
    key: 'consultant',
    code: 'CONSULTANT',
    name: 'ISO 26262 Kit: Consultant Edition',
    shortLabel: 'Consultant Edition',
    badge: 'ENTERPRISE',
    tagline:
      'Continuous process evolution and ongoing lifetime functional safety advisory for scaling OEM and Tier-1 programs.',
    consultingHours: '40 per month (lifetime)',
    accentGradient: 'from-[#0B2545] via-[#2563EB] to-[#0D9488]',
    icon: Users,
    highlights: [
      'Everything in Custom Edition',
      'Ongoing Process Upgrades',
      'Full Organizational Customization',
      '40 Hours/Month (Lifetime) 1:1 Consulting',
    ],
  },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    parameter: 'Workflow',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
  },
  {
    parameter: 'Templates',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
  },
  {
    parameter: 'Checklists',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
  },
  {
    parameter: 'Guidelines',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
  },
  {
    parameter: 'Integration to Customer Portal',
    basic: 'No',
    custom: 'Yes',
    consultant: 'Yes',
  },
  {
    parameter: 'Process Upgrades',
    basic: 'No',
    custom: 'No',
    consultant: 'Yes',
  },
  {
    parameter: 'Customization for Organization (upon deployment)',
    basic: 'No',
    custom: 'Yes',
    consultant: 'Yes',
  },
  {
    parameter: '1:1 Consulting Hours (excluding review hours)',
    basic: '0',
    custom: '40',
    consultant: '40 per month (lifetime)',
  },
];

const CORE_ARTIFACTS = [
  {
    title: 'Workflow',
    description: 'End-to-end ISO 26262 lifecycle stages, gates, and role responsibilities.',
    icon: GitBranch,
  },
  {
    title: 'Templates',
    description: 'Audit-ready work product templates aligned with Part 2 through Part 9.',
    icon: FileCheck2,
  },
  {
    title: 'Checklists',
    description: 'Structured confirmation review and verification checklists for ASIL A–D.',
    icon: ClipboardCheck,
  },
  {
    title: 'Guidelines',
    description: 'Practical implementation guidance distilled from real OEM & Tier-1 audits.',
    icon: BookOpen,
  },
];

function renderCellValue(value: string, isHighlightedCol: boolean) {
  if (value === 'Yes') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12.5px] font-semibold ${
          isHighlightedCol
            ? 'bg-[#2563EB] text-white'
            : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
        }`}
      >
        <Check className="w-3.5 h-3.5" />
        Yes
      </span>
    );
  }
  if (value === 'No') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12.5px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#DCE3EA]">
        <Minus className="w-3.5 h-3.5" />
        No
      </span>
    );
  }
  return (
    <span
      className={`inline-block font-bold text-[13.5px] ${
        isHighlightedCol ? 'text-[#2563EB]' : 'text-[#0B2545]'
      }`}
    >
      {value}
    </span>
  );
}

export const ProductsClient: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedEdition, setSelectedEdition] = useState<EditionKey>('custom');

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section
        aria-labelledby="products-heading"
        className="relative overflow-hidden bg-gradient-corporate-blue text-white border-b border-[#315B7D]/45"
      >
        <AmbientGlow
          tone="blue"
          position="top-right"
          sizeClass="w-[360px] h-[360px] sm:w-[560px] sm:h-[560px]"
        />
        <AmbientGlow
          tone="cyan"
          position="bottom-left"
          hideOnMobile
          sizeClass="w-[460px] h-[460px]"
        />
        <TechnicalGrid theme="dark" showNodes showParticles opacityClass="opacity-60" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
          <div className="max-w-[780px]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.09em] uppercase text-white">
                DRIVVIZE PRODUCTS <span className="text-[#06B6D4] mx-1">|</span> ISO 26262
                FUNCTIONAL SAFETY KIT
              </span>
            </div>

            <h1
              id="products-heading"
              className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-[-0.025em]"
            >
              Products &amp;{' '}
              <span className="text-gradient-innovation">ISO 26262 Kit</span> Editions
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] text-[#DCE3EA] leading-[1.68] max-w-[680px]">
              Accelerate ISO 26262 compliance with structured engineering workflows,
              audit-ready templates, verification checklists, and practitioner guidelines —
              available in Basic, Custom, and Consultant editions.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <GradientButton
                href="#comparison-matrix"
                variant="primary-gradient"
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('comparison-matrix')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Layers className="w-4 h-4" />
                <span>Compare Editions</span>
              </GradientButton>

              <GradientButton
                href="/contact"
                variant="secondary-glass-dark"
                size="md"
                onClick={(e) =>
                  navigate(
                    {
                      label: 'Contact Us',
                      href: '/contact',
                      sectionAnchor: 'cta-contact',
                    },
                    e
                  )
                }
              >
                <span>Request Deployment</span>
                <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </div>
        </div>
      </section>

      {/* EDITIONS + COMPARISON TABLE */}
      <AnimatedGradientBackground
        variant="light-corporate"
        showGrid
        showOrbs
        className="py-14 sm:py-18 lg:py-20"
      >
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* CORE INCLUDED ARTIFACTS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORE_ARTIFACTS.map((artifact) => {
              const IconComp = artifact.icon;
              return (
                <div
                  key={artifact.title}
                  className="rounded-[14px] bg-white border border-[#DCE3EA] p-5 shadow-[0_4px_16px_-6px_rgba(11,37,69,0.06)] flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] border border-[#DCE3EA] flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h2 className="text-[15.5px] font-bold text-[#0B2545]">
                      {artifact.title}
                    </h2>
                    <p className="text-[13px] text-[#315B7D] mt-1 leading-[1.5]">
                      {artifact.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* THREE EDITION CARDS */}
          <section aria-labelledby="editions-heading">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-2.5 px-3 py-1 rounded-full bg-white border border-[#DCE3EA] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
                    ISO 26262 KIT LINEUP
                  </span>
                </div>
                <h2
                  id="editions-heading"
                  className="text-[28px] sm:text-[36px] font-bold text-[#0B2545] leading-[1.15]"
                >
                  Choose Your ISO 26262 Kit Edition
                </h2>
              </div>
              <p className="text-[14.5px] text-[#315B7D] max-w-[420px]">
                Select an edition below to highlight its specification column in the
                parameter comparison matrix.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {EDITIONS.map((edition) => {
                const IconComp = edition.icon;
                const isSelected = selectedEdition === edition.key;

                return (
                  <article
                    key={edition.key}
                    onClick={() => setSelectedEdition(edition.key)}
                    className={`group relative overflow-hidden rounded-[16px] bg-white border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-[#2563EB] ring-4 ring-[#2563EB]/10 shadow-[0_20px_42px_-12px_rgba(37,99,235,0.18)] -translate-y-1'
                        : 'border-[#DCE3EA] hover:border-[#06B6D4] shadow-[0_4px_16px_-6px_rgba(11,37,69,0.06)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-0 h-[3.5px] bg-gradient-to-r ${edition.accentGradient}`}
                    />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-[10px] flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white'
                                : 'bg-[#F1F5F9] border border-[#DCE3EA] text-[#2563EB]'
                            }`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span className="text-[11.5px] font-bold tracking-[0.1em] uppercase text-[#315B7D] bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#DCE3EA]">
                            {edition.code}
                          </span>
                        </div>

                        {edition.badge && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B2545] text-[#FACC15] text-[10.5px] font-bold tracking-[0.08em] uppercase">
                            <Sparkles className="w-3 h-3" />
                            {edition.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0B2545] leading-[1.25]">
                        {edition.name}
                      </h3>

                      <p className="mt-2.5 text-[14.5px] text-[#202B36]/85 leading-[1.6]">
                        {edition.tagline}
                      </p>

                      <div className="mt-5 p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#DCE3EA]">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#315B7D]">
                          1:1 Consulting Hours (excl. review hours)
                        </div>
                        <div className="text-[18px] font-bold text-[#0B2545] mt-0.5">
                          {edition.consultingHours}
                        </div>
                      </div>

                      <ul className="mt-5 space-y-2.5">
                        {edition.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-[14px] text-[#202B36]"
                          >
                            <Check className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 pt-4 border-t border-[#F1F5F9]">
                      <a
                        href="/contact"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            {
                              label: `Inquire: ${edition.name}`,
                              href: '/contact',
                              sectionAnchor: 'cta-contact',
                            },
                            e
                          );
                        }}
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] text-[14px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.45)]'
                            : 'bg-[#F1F5F9] hover:bg-[#0B2545] text-[#0B2545] hover:text-white'
                        }`}
                      >
                        <span>Select {edition.shortLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* COMPARISON MATRIX TABLE */}
          <section id="comparison-matrix" aria-labelledby="matrix-heading">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-2.5 px-3 py-1 rounded-full bg-white border border-[#DCE3EA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
                  EDITION SPECIFICATIONS
                </span>
              </div>
              <h2
                id="matrix-heading"
                className="text-[26px] sm:text-[32px] font-bold text-[#0B2545]"
              >
                Parameter Comparison Matrix
              </h2>
            </div>

            <div className="rounded-[16px] bg-white border border-[#DCE3EA] overflow-hidden shadow-[0_12px_32px_-12px_rgba(11,37,69,0.09)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#DCE3EA]">
                      <th className="py-4 px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#0B2545] min-w-[260px]">
                        Parameters
                      </th>
                      {EDITIONS.map((ed) => {
                        const isHighlighted = selectedEdition === ed.key;
                        return (
                          <th
                            key={ed.key}
                            onClick={() => setSelectedEdition(ed.key)}
                            className={`py-4 px-5 text-[13px] font-bold uppercase tracking-[0.08em] text-center cursor-pointer transition-colors min-w-[150px] ${
                              isHighlighted
                                ? 'bg-[#EFF6FF] text-[#2563EB] border-x border-[#BFDBFE]'
                                : 'text-[#0B2545] hover:bg-[#F1F5F9]'
                            }`}
                          >
                            {ed.code}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE3EA]/70 text-[14.5px]">
                    {COMPARISON_ROWS.map((row) => (
                      <tr
                        key={row.parameter}
                        className="hover:bg-[#F8FAFC]/70 transition-colors"
                      >
                        <td className="py-3.5 px-5 font-semibold text-[#0B2545]">
                          {row.parameter}
                        </td>
                        <td
                          className={`py-3.5 px-5 text-center transition-colors ${
                            selectedEdition === 'basic'
                              ? 'bg-[#EFF6FF]/65 border-x border-[#BFDBFE]/60'
                              : ''
                          }`}
                        >
                          {renderCellValue(row.basic, selectedEdition === 'basic')}
                        </td>
                        <td
                          className={`py-3.5 px-5 text-center transition-colors ${
                            selectedEdition === 'custom'
                              ? 'bg-[#EFF6FF]/65 border-x border-[#BFDBFE]/60'
                              : ''
                          }`}
                        >
                          {renderCellValue(row.custom, selectedEdition === 'custom')}
                        </td>
                        <td
                          className={`py-3.5 px-5 text-center transition-colors ${
                            selectedEdition === 'consultant'
                              ? 'bg-[#EFF6FF]/65 border-x border-[#BFDBFE]/60'
                              : ''
                          }`}
                        >
                          {renderCellValue(
                            row.consultant,
                            selectedEdition === 'consultant'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </AnimatedGradientBackground>
    </div>
  );
};

