'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { CountUp, Photo, Reveal } from '@/components/premium-home/hooks';
import { IMG } from '@/components/premium-home/data';

type EditionKey = 'basic' | 'custom' | 'consultant';

interface Edition {
  key: EditionKey;
  code: string;
  name: string;
  badge?: string;
  tagline: string;
  consultingHours: string;
  isPopular?: boolean;
  features: string[];
}

interface ComparisonParam {
  parameter: string;
  basic: string;
  custom: string;
  consultant: string;
  category: 'core' | 'deployment' | 'advisory';
}

const EDITIONS: Edition[] = [
  {
    key: 'basic',
    code: 'BASIC',
    name: 'ISO 26262 Kit: Basic Edition',
    badge: 'FOUNDATION',
    tagline:
      'Foundational ISO 26262 process assets for engineering teams establishing internal functional safety capability from scratch.',
    consultingHours: '0 Hours',
    features: [
      'Complete ISO 26262 Workflow',
      'Standardized Work Product Templates',
      'Verification & Audit Checklists',
      'Practitioner Implementation Guidelines',
    ],
  },
  {
    key: 'custom',
    code: 'CUSTOM',
    name: 'ISO 26262 Kit: Custom Edition',
    badge: 'MOST POPULAR',
    isPopular: true,
    tagline:
      'Tailored organizational deployment integrated into your customer portal, with 40 dedicated hours of 1:1 expert support.',
    consultingHours: '40 Hours',
    features: [
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
    badge: 'ENTERPRISE LIFETIME',
    tagline:
      'Continuous process evolution, ongoing upgrades, and lifetime functional safety advisory for scaling OEM and Tier-1 programs.',
    consultingHours: '40 per month (lifetime)',
    features: [
      'Everything in Custom Edition',
      'Continuous Process Upgrades',
      'Full Customization for Organization',
      '40 Hours / Month (Lifetime) 1:1 Advisory',
    ],
  },
];

const COMPARISON_ROWS: ComparisonParam[] = [
  {
    parameter: 'Workflow',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
    category: 'core',
  },
  {
    parameter: 'Templates',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
    category: 'core',
  },
  {
    parameter: 'Checklists',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
    category: 'core',
  },
  {
    parameter: 'Guidelines',
    basic: 'Yes',
    custom: 'Yes',
    consultant: 'Yes',
    category: 'core',
  },
  {
    parameter: 'Integration to Customer Portal',
    basic: 'No',
    custom: 'Yes',
    consultant: 'Yes',
    category: 'deployment',
  },
  {
    parameter: 'Process Upgrades',
    basic: 'No',
    custom: 'No',
    consultant: 'Yes',
    category: 'deployment',
  },
  {
    parameter: 'Customization for Organization (upon deployment)',
    basic: 'No',
    custom: 'Yes',
    consultant: 'Yes',
    category: 'deployment',
  },
  {
    parameter: '1:1 Consulting Hours (excluding review hours)',
    basic: '0',
    custom: '40',
    consultant: '40 per month (lifetime)',
    category: 'advisory',
  },
];

const CORE_PILLARS = [
  {
    number: '01',
    title: 'Workflows',
    description:
      'End-to-end lifecycle gates spanning Item Definition, HARA, Functional Safety Concept (FSC), Technical Safety Concept (TSC), HW/SW development, and Confirmation Reviews.',
    tag: 'ISO 26262 Lifecycle',
  },
  {
    number: '02',
    title: 'Templates',
    description:
      'Over 30 audit-ready work product templates aligned with ISO 26262:2018 Parts 2–9, formatted for seamless adoption in Word, Excel, Polarion, Codebeamer, or Jira.',
    tag: 'Parts 2–9 Ready',
  },
  {
    number: '03',
    title: 'Checklists',
    description:
      'Comprehensive verification checklists and confirmation review criteria ensuring complete bidirectional traceability, ASIL A–D rigor, and flawless audit compliance.',
    tag: 'ASIL A–D Audit Gates',
  },
  {
    number: '04',
    title: 'Guidelines',
    description:
      'Step-by-step practitioner field guides distilled from 40+ delivered automotive programs, translating complex standard clauses into actionable engineering decisions.',
    tag: 'Field Proven',
  },
];

export function ProductsClient() {
  const [activeEdition, setActiveEdition] = useState<EditionKey>('custom');

  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderValueBadge = (val: string, isHighlighted: boolean) => {
    if (val === 'Yes') {
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
            isHighlighted
              ? 'bg-signal text-ink shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Yes
        </span>
      );
    }
    if (val === 'No') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink/40 border border-ink/10">
          <span className="h-0.5 w-2 bg-ink/30" />
          No
        </span>
      );
    }
    return (
      <span
        className={`inline-block rounded-lg px-2.5 py-1 text-xs sm:text-[13px] font-bold ${
          isHighlighted
            ? 'bg-signal/30 text-ink border border-signal font-extrabold'
            : val === '0'
            ? 'text-ink/40 font-medium'
            : 'text-ink bg-paper border border-ink/10'
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <div className="bg-white text-ink antialiased selection:bg-signal selection:text-ink">
      <Nav />

      {/* 1. HERO SECTION */}
      <section
        id="top"
        className="relative isolate overflow-hidden bg-ink pt-28 sm:pt-36 pb-20 sm:pb-28 lg:pt-44 lg:pb-36 text-white"
      >
        <Photo
          src={IMG.freeway}
          alt="Automotive highway at dusk"
          className="!absolute inset-0 -z-20 opacity-30"
          speed={0.06}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/90 via-ink/75 to-ink" />

        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-signal backdrop-blur-md mb-6">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                Drivvize Products &bull; ISO 26262
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="title text-[clamp(2.4rem,6vw,5.6rem)] leading-[1.06] text-white">
                ISO 26262 Kits <b>built for production.</b>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed text-white/75 max-w-2xl">
                Accelerate compliance with pre-built engineering workflows, audit-ready templates,
                verification checklists, and field guidelines — available across three flexible
                tiers: <b>Basic</b>, <b>Custom</b>, and <b>Consultant</b>.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('matrix')}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-signal px-7 py-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5 cursor-pointer shadow-md"
                >
                  <span>Compare Specifications</span>
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 18 10"
                    className="transition-transform group-hover:translate-x-1.5"
                  >
                    <path
                      d="M0 5h16M12 1l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-4 text-[14px] font-semibold text-white transition-colors hover:bg-white hover:text-ink text-center"
                >
                  Schedule Kit Walkthrough
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Quick Metrics Strip */}
          <Reveal delay={400} className="mt-14 sm:mt-20 pt-8 border-t border-white/15">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <div className="title text-3xl sm:text-4xl text-white !font-light">
                  <CountUp to={40} suffix="+" />
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/55">
                  Safety Programs Delivered
                </p>
              </div>
              <div>
                <div className="title text-3xl sm:text-4xl text-white !font-light">
                  <CountUp to={100} suffix="%" />
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/55">
                  Audit-Ready Work Products
                </p>
              </div>
              <div>
                <div className="title text-3xl sm:text-4xl text-white !font-light">
                  <span>Part 2–9</span>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/55">
                  Standard Lifecycle Coverage
                </p>
              </div>
              <div>
                <div className="title text-3xl sm:text-4xl text-white !font-light">
                  <CountUp to={20} suffix="+ yrs" />
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/55">
                  OEM &amp; Tier-1 Experience
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. THREE EDITIONS CARDS SECTION */}
      <section id="editions" className="bg-paper py-16 sm:py-24 lg:py-36">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
          <Reveal className="mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-4 text-brand">Product Lineup</p>
                <h2 className="title text-[clamp(2.1rem,5vw,4.2rem)]">
                  Three editions. <b>One standard of rigor.</b>
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-ink/65">
                Each edition provides the same battle-tested ISO 26262 core engineering foundation,
                scaled with organizational integration and dedicated consulting.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {EDITIONS.map((edition, idx) => {
              const isSelected = activeEdition === edition.key;
              return (
                <Reveal key={edition.key} delay={idx * 120} className="h-full">
                  <article
                    onClick={() => setActiveEdition(edition.key)}
                    className={`relative flex flex-col justify-between h-full rounded-2xl bg-white p-6 sm:p-8 transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? 'border-brand ring-2 ring-brand/20 shadow-xl -translate-y-1'
                        : 'border-line shadow-xs hover:border-ink/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Accent Line */}
                    <div
                      className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl transition-all ${
                        edition.isPopular
                          ? 'bg-signal'
                          : isSelected
                          ? 'bg-brand'
                          : 'bg-transparent'
                      }`}
                    />

                    <div>
                      {/* Header Badge */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className="rounded-md bg-paper px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink border border-line">
                          {edition.code}
                        </span>
                        {edition.badge && (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              edition.isPopular
                                ? 'bg-signal text-ink font-extrabold shadow-2xs'
                                : 'bg-ink text-white'
                            }`}
                          >
                            {edition.badge}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="title text-2xl sm:text-[26px] !font-medium text-ink leading-tight">
                        {edition.name}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-ink/65">
                        {edition.tagline}
                      </p>

                      {/* Consulting Hours Box */}
                      <div className="mt-6 rounded-xl bg-paper p-4 border border-line">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink/50">
                          1:1 Consulting Hours (excl. review hours)
                        </p>
                        <p className="mt-1 text-lg sm:text-xl font-extrabold text-ink">
                          {edition.consultingHours}
                        </p>
                      </div>

                      {/* Feature Bullet Points */}
                      <ul className="mt-6 space-y-3 text-sm text-ink/80">
                        {edition.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal text-ink">
                              <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-8 pt-6 border-t border-line">
                      <Link
                        href={`/contact?edition=${edition.key}`}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-bold transition-all ${
                          edition.isPopular
                            ? 'bg-signal text-ink hover:bg-yellow-400 shadow-xs'
                            : isSelected
                            ? 'bg-ink text-white hover:bg-deep'
                            : 'bg-paper text-ink hover:bg-ink hover:text-white'
                        }`}
                      >
                        <span>Inquire: {edition.code} Edition</span>
                        <svg
                          width="14"
                          height="9"
                          viewBox="0 0 18 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M0 5h16M12 1l4 4-4 4" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. COMPARISON MATRIX (EXACT SLIDE CONTENT) */}
      <section id="matrix" className="py-16 sm:py-24 lg:py-36 bg-white">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
          <Reveal className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-4 text-brand">Specifications Matrix</p>
                <h2 className="title text-[clamp(2.1rem,5vw,4.2rem)]">
                  Compare <b>Edition Parameters.</b>
                </h2>
              </div>
              <p className="text-sm sm:text-base text-ink/65 max-w-sm">
                Direct feature comparison across all three official ISO 26262 Kit editions.
              </p>
            </div>
          </Reveal>

          {/* Mobile Edition Filter Tabs */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 sm:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50 mr-1 shrink-0">
              Highlight:
            </span>
            {(['basic', 'custom', 'consultant'] as EditionKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveEdition(k)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  activeEdition === k
                    ? 'bg-ink text-white'
                    : 'bg-paper text-ink/70 hover:bg-ink/10'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* The Table */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-paper/80">
                    <th className="py-5 px-6 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink w-[40%]">
                      Parameters
                    </th>
                    {EDITIONS.map((ed) => {
                      const isHighlighted = activeEdition === ed.key;
                      return (
                        <th
                          key={ed.key}
                          onClick={() => setActiveEdition(ed.key)}
                          className={`py-5 px-6 text-center text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors cursor-pointer w-[20%] ${
                            isHighlighted
                              ? 'bg-signal/20 text-ink border-x border-signal/30'
                              : 'text-ink/70 hover:bg-paper hover:text-ink'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{ed.code}</span>
                            {ed.isPopular && (
                              <span className="rounded-full bg-signal px-2 py-0.5 text-[9px] font-bold text-ink">
                                Popular
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-sm sm:text-[15px]">
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row.parameter}
                      className="hover:bg-paper/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-ink">
                        <span className="font-semibold text-ink">{row.parameter}</span>
                      </td>
                      <td
                        className={`py-4 px-6 text-center transition-colors ${
                          activeEdition === 'basic' ? 'bg-signal/10 border-x border-signal/20' : ''
                        }`}
                      >
                        {renderValueBadge(row.basic, activeEdition === 'basic')}
                      </td>
                      <td
                        className={`py-4 px-6 text-center transition-colors ${
                          activeEdition === 'custom' ? 'bg-signal/10 border-x border-signal/20' : ''
                        }`}
                      >
                        {renderValueBadge(row.custom, activeEdition === 'custom')}
                      </td>
                      <td
                        className={`py-4 px-6 text-center transition-colors ${
                          activeEdition === 'consultant'
                            ? 'bg-signal/10 border-x border-signal/20'
                            : ''
                        }`}
                      >
                        {renderValueBadge(row.consultant, activeEdition === 'consultant')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Banner */}
            <div className="border-t border-line bg-paper px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/65">
              <span>
                All consulting hours are conducted 1:1 with Senior Functional Safety Leaders.
              </span>
              <Link
                href="/contact"
                className="font-bold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-deep"
              >
                Inquire about custom enterprise scopes &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE ARTIFACTS DEEP DIVE */}
      <section className="bg-paper py-16 sm:py-24 lg:py-36">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
          <Reveal className="mb-12 sm:mb-16">
            <p className="eyebrow mb-4 text-brand">Core Deliverables</p>
            <h2 className="title text-[clamp(2.1rem,5vw,4.2rem)]">
              Inside every <b>ISO 26262 Kit.</b>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-ink/65">
              Regardless of the edition chosen, your team receives our comprehensive four-pillar
              foundation that eliminates compliance guesswork.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} className="h-full">
                <article className="flex flex-col justify-between h-full rounded-2xl bg-white p-6 sm:p-7 border border-line shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold tabular-nums text-brand">
                        {p.number}
                      </span>
                      <span className="rounded-full bg-paper px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/60 border border-line">
                        {p.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-ink mb-2">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink/65">
                      {p.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line text-xs font-semibold text-brand flex items-center gap-1.5">
                    <span>Full Lifecycle Included</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ENGINEERING ASSURANCE & QUOTE */}
      <section className="bg-ink text-white py-16 sm:py-24 lg:py-36 relative isolate overflow-hidden">
        <Photo
          src={IMG.stage}
          alt="Engineering conference presentation"
          className="!absolute inset-0 -z-20 opacity-20"
          speed={0.05}
        />
        <div className="absolute inset-0 -z-10 bg-ink/80" />

        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow mb-6 text-signal">Engineering Leadership</p>
              <blockquote className="title text-[clamp(1.6rem,3.2vw,3rem)] !leading-[1.28] text-white/90">
                &ldquo;Starting functional safety from a blank document costs months of engineering
                churn. Our kits encapsulate <b>two decades of OEM audit experience</b> so your team
                can focus on shipping safe vehicles.&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-signal">
                  <img
                    src="/images/founders/Nagesh_edited.jpg"
                    alt="Nageswaran Jayaraman"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-base">Nageswaran Jayaraman</p>
                  <p className="text-xs uppercase tracking-wider text-signal font-semibold">
                    Co-Founder &bull; 22+ Years in Automotive FuSa
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="bg-white py-16 sm:py-24 lg:py-28 border-b border-line">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
          <Reveal className="rounded-3xl bg-paper p-8 sm:p-12 lg:p-16 border border-line flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3 text-brand">Ready to deploy?</p>
              <h2 className="title text-[clamp(2rem,4vw,3.6rem)]">
                Bring <b>ISO 26262 certainty</b> to your development pipeline.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/65">
                Speak directly with our Functional Safety and Cybersecurity architects to discuss
                your system boundaries, ASIL targets, and portal integration requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-signal px-8 py-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 shadow-xs text-center"
              >
                <span>Request Deployment</span>
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M0 5h16M12 1l4 4-4 4" />
                </svg>
              </Link>
              <a
                href="mailto:info@drivvize.com"
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-8 py-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white text-center"
              >
                info@drivvize.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
