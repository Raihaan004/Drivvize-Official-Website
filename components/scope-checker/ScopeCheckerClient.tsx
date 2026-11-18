'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  ArrowLeft,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { Reveal } from '@/components/premium-home/hooks';
import {
  ANNEX_OPTIONS,
  CATALOG,
  CatalogItem,
  EXAMPLE_CHIPS,
  normalizeQuery,
  ScopeCategory,
  searchCatalog,
  TIMELINE_MILESTONES,
  VERDICTS,
  WIZARD_QUESTIONS,
} from './scopeCheckerData';

type WizardOutcome =
  | {
      type: 'out';
      reason: string;
    }
  | {
      type: 'in';
      category: ScopeCategory;
    };

const TABS = [
  { id: 'catalog-lookup', label: 'Catalog Lookup' },
  { id: 'screening-wizard', label: 'Screening Wizard' },
  { id: 'cra-timeline', label: 'Timeline' },
  { id: 'full-catalog', label: `Full Catalog (${CATALOG.length})` },
];

const CATEGORY_FILTERS: Array<{ key: 'all' | ScopeCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'in', label: 'Default' },
  { key: 'c1', label: 'Class I' },
  { key: 'c2', label: 'Class II' },
  { key: 'cr', label: 'Critical' },
  { key: 'ou', label: 'Out of scope' },
  { key: 'co', label: 'Conditional' },
];

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="10" viewBox="0 0 18 10" className={className}>
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const ScopeCheckerClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [query, setQuery] = useState('');
  const [step, setStep] = useState(0);
  const [wizardOutcome, setWizardOutcome] = useState<WizardOutcome | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<'all' | ScopeCategory>('all');

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 150);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      let current = TABS[0].id;
      TABS.forEach((t) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = t.id;
        }
      });
      setActiveTab(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id: string) => {
    window.history.replaceState({}, '', `/scope-checker#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const trimmedNormalized = useMemo(() => normalizeQuery(query), [query]);
  const hasActiveSearch = trimmedNormalized.length >= 2;
  const searchResults = useMemo(() => searchCatalog(query), [query]);

  const filteredCatalog = useMemo(() => {
    if (catalogFilter === 'all') return CATALOG;
    return CATALOG.filter((item) => item.category === catalogFilter);
  }, [catalogFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<'all' | ScopeCategory, number> = {
      all: CATALOG.length,
      in: 0,
      c1: 0,
      c2: 0,
      cr: 0,
      ou: 0,
      co: 0,
    };
    for (const item of CATALOG) {
      counts[item.category] += 1;
    }
    return counts;
  }, []);

  const handleWizardYesNo = (answer: 'yes' | 'no') => {
    const currentQ = WIZARD_QUESTIONS[step];
    if (!currentQ) return;
    if (answer === currentQ.triggerAnswer) {
      setWizardOutcome({ type: 'out', reason: currentQ.outReason });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleAnnexSelect = (key: 'none' | 'c1' | 'c2' | 'cr') => {
    const category: ScopeCategory = key === 'none' ? 'in' : key;
    setWizardOutcome({ type: 'in', category });
  };

  const handleWizardBack = () => {
    if (wizardOutcome) {
      setWizardOutcome(null);
      return;
    }
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleWizardReset = () => {
    setWizardOutcome(null);
    setStep(0);
  };

  const totalWizardSteps = WIZARD_QUESTIONS.length + 1;

  const renderResultCard = (item: CatalogItem) => {
    const verdict = VERDICTS[item.category];
    return (
      <article
        key={item.name}
        className="relative overflow-hidden bg-white p-6 sm:p-8 shadow-lg shadow-ink/5 ring-1 ring-ink/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10"
      >
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${verdict.accentBarClass}`}
        />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${verdict.badgeClass}`}
          >
            {verdict.label}
          </span>
          <span className="border border-ink/10 bg-paper px-3 py-1 font-mono text-[12px] font-medium text-ink/70">
            Basis: {item.basis}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-ink">
          {item.name}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
          {item.description}
        </p>
        <p className="mt-4 border-t border-ink/10 pt-4 text-[14px] leading-relaxed text-ink/60">
          {verdict.guidance}
        </p>
      </article>
    );
  };

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* HERO */}
        <section
          aria-labelledby="scope-checker-heading"
          className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-ink text-white"
        >
          <img
            src={IMG.servers}
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.92),rgba(10,16,24,0.48)),linear-gradient(0deg,rgba(10,16,24,0.75),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">
              Regulation (EU) 2024/2847 · Cyber Resilience Act
            </p>
            <h1
              id="scope-checker-heading"
              className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white"
            >
              {['EU', 'CRA', 'Scope', 'Checker.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 2 || i === 3 ? 'font-semibold text-white' : 'text-white/80'
                    }
                    style={{ animationDelay: `${150 + i * 100}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-up mt-8 max-w-xl text-[17px] leading-relaxed text-white/75"
              style={{ animationDelay: '0.85s' }}
            >
              Type a product name for an instant catalog lookup across Art. 2, Annex III and
              Annex IV, or use the screening wizard below for anything not in the catalog.
            </p>
            <div
              className="fade-up mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: '1.05s' }}
            >
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => jump(t.id)}
                  className={`rounded-full px-6 py-3.5 text-[14px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
                    i === 0
                      ? 'bg-signal text-ink'
                      : 'border border-white/40 font-semibold text-white hover:bg-white hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STICKY TABS */}
        <div className="sticky top-16 sm:top-20 z-30 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1320px] gap-8 overflow-x-auto px-6 lg:px-10">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => jump(t.id)}
                className={`relative whitespace-nowrap py-4 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  activeTab === t.id ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {t.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-signal transition-transform duration-500 ${
                    activeTab === t.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 1. CATALOG LOOKUP */}
        <section
          id="catalog-lookup"
          aria-labelledby="lookup-heading"
          className="scroll-mt-32 bg-white py-24 lg:py-36"
        >
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow mb-6 text-brand">Catalog lookup</p>
                <h2
                  id="lookup-heading"
                  className="title text-[clamp(2.4rem,5.4vw,4.6rem)]"
                >
                  Search the <b>catalog.</b>
                </h2>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-ink/60">
                Instant lookup across {CATALOG.length} mapped product categories under Art. 2,
                Annex III and Annex IV.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <div className="relative bg-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-ink/10 ring-1 ring-ink/5">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-sky to-signal" />

                <div className="group relative flex items-center gap-3 border-b border-ink/20 focus-within:border-ink transition-colors">
                  <label htmlFor="cra-search-input" className="sr-only">
                    Search product name or category
                  </label>
                  <Search className="h-5 w-5 shrink-0 text-ink/40 transition-colors group-focus-within:text-deep" />
                  <input
                    id="cra-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. smart door lock, pacemaker, password manager, SaaS CRM…"
                    autoComplete="off"
                    className="w-full bg-transparent py-4 text-[17px] sm:text-[19px] font-light text-ink outline-none placeholder:text-ink/30"
                  />
                  {query && (
                    <button
                      type="button"
                      aria-label="Clear search query"
                      onClick={() => setQuery('')}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/45 transition-colors hover:bg-paper hover:text-ink cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <span className="absolute -bottom-px left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-focus-within:w-full" />
                </div>

                {/* Example Chips */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">
                    Try:
                  </span>
                  {EXAMPLE_CHIPS.map((chip) => {
                    const isSelected = normalizeQuery(query) === normalizeQuery(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setQuery(chip)}
                        className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-ink text-white'
                            : 'border border-ink/15 bg-paper text-ink/75 hover:border-ink hover:text-ink'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>

                {/* Search Results */}
                {hasActiveSearch && (
                  <div className="mt-8 space-y-4" aria-live="polite">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map(renderResultCard)}
                        <p className="flex items-center gap-2.5 pt-2 text-[13.5px] text-ink/60">
                          <Info className="h-4 w-4 shrink-0 text-brand" />
                          <span>
                            Not an exact match? Confirm with the{' '}
                            <button
                              type="button"
                              onClick={() => jump('screening-wizard')}
                              className="font-bold text-ink underline decoration-signal decoration-2 underline-offset-4 cursor-pointer"
                            >
                              screening wizard below
                            </button>
                            , since classification depends on actual functionality.
                          </span>
                        </p>
                      </>
                    ) : (
                      <div className="border-l-[3px] border-signal bg-paper p-5 text-[15px] text-ink/75">
                        No catalog match for “{query}”.{' '}
                        <button
                          type="button"
                          onClick={() => jump('screening-wizard')}
                          className="font-bold text-ink underline decoration-signal decoration-2 underline-offset-4 cursor-pointer"
                        >
                          Use the screening wizard below
                        </button>
                        .
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. SCREENING WIZARD */}
        <section
          id="screening-wizard"
          aria-labelledby="wizard-heading"
          className="scroll-mt-32 bg-paper py-24 lg:py-36"
        >
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow mb-6 text-brand">Screening wizard</p>
                <h2
                  id="wizard-heading"
                  className="title text-[clamp(2.4rem,5.4vw,4.6rem)]"
                >
                  Not in the catalog? <b>Screen it.</b>
                </h2>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-ink/60">
                Walk through the Art. 2 exclusions and Annex III / IV product tiers step by
                step.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative bg-white p-8 shadow-2xl shadow-ink/10 ring-1 ring-ink/5 sm:p-12 lg:p-16">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-sky to-signal" />

                {wizardOutcome ? (
                  wizardOutcome.type === 'out' ? (
                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] ${VERDICTS.ou.badgeClass}`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {VERDICTS.ou.label}
                      </span>
                      <h3 className="mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-snug tracking-tight text-ink">
                        {wizardOutcome.reason}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/65">
                        {VERDICTS.ou.guidance}
                      </p>
                      <div className="mt-10 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleWizardBack}
                          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[14px] font-bold text-ink transition-colors hover:border-ink hover:bg-paper cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleWizardReset}
                          className="inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Start over
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] ${VERDICTS[wizardOutcome.category].badgeClass}`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {VERDICTS[wizardOutcome.category].label}
                      </span>
                      <h3 className="mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-snug tracking-tight text-ink">
                        Passed all exclusion tests; connected, commercially supplied product.
                      </h3>
                      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/70">
                        {VERDICTS[wizardOutcome.category].guidance}
                      </p>
                      <p className="mt-6 border-l-[3px] border-signal bg-paper p-5 text-[14px] leading-relaxed text-ink/65">
                        Note: Annex III/IV classification follows Implementing Regulation (EU)
                        2025/2392; confirm the product&apos;s core functionality fits the
                        technical description.
                      </p>
                      <div className="mt-10 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleWizardBack}
                          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[14px] font-bold text-ink transition-colors hover:border-ink hover:bg-paper cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleWizardReset}
                          className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3.5 text-[14px] font-bold text-ink transition-colors hover:bg-ink hover:text-white cursor-pointer"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Start over
                        </button>
                        <Link
                          href="/contact"
                          className="group inline-flex items-center gap-3 rounded-full bg-signal px-7 py-3.5 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5"
                        >
                          Discuss EU-CRA compliance
                          <Arrow className="transition-transform group-hover:translate-x-1.5" />
                        </Link>
                      </div>
                    </div>
                  )
                ) : step < WIZARD_QUESTIONS.length ? (
                  <div>
                    <div className="mb-8 flex items-center justify-between gap-4">
                      <span className="eyebrow !text-[11px] text-brand">
                        Step {String(step + 1).padStart(2, '0')} of{' '}
                        {String(totalWizardSteps).padStart(2, '0')}
                      </span>
                      <div className="h-1 flex-1 max-w-[260px] overflow-hidden bg-ink/10">
                        <div
                          className="h-full bg-signal transition-all duration-500 ease-out"
                          style={{
                            width: `${((step + 1) / totalWizardSteps) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="max-w-3xl text-[clamp(1.45rem,2.6vw,2.2rem)] font-light leading-snug tracking-tight text-ink">
                      {WIZARD_QUESTIONS[step].question}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink/60">
                      {WIZARD_QUESTIONS[step].hint}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleWizardYesNo('yes')}
                        className="rounded-full bg-ink px-9 py-3.5 text-[14px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-deep cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWizardYesNo('no')}
                        className="rounded-full border border-ink px-9 py-3.5 text-[14px] font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-white cursor-pointer"
                      >
                        No
                      </button>
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={handleWizardBack}
                          className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[14px] font-semibold text-ink/55 transition-colors hover:text-ink cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-8 flex items-center justify-between gap-4">
                      <span className="eyebrow !text-[11px] text-brand">
                        Step {String(totalWizardSteps).padStart(2, '0')} of{' '}
                        {String(totalWizardSteps).padStart(2, '0')}
                      </span>
                      <div className="h-1 flex-1 max-w-[260px] overflow-hidden bg-ink/10">
                        <div className="h-full w-full bg-signal" />
                      </div>
                    </div>

                    <h3 className="max-w-3xl text-[clamp(1.45rem,2.6vw,2.2rem)] font-light leading-snug tracking-tight text-ink">
                      Does it match an Annex III / IV category? Pick the closest.
                    </h3>
                    <p className="mt-3 text-[15.5px] text-ink/60">
                      Pick “None” if it is an ordinary connected product.
                    </p>

                    <div className="mt-8 space-y-3">
                      {ANNEX_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleAnnexSelect(opt.key)}
                          className="group relative flex w-full items-center justify-between gap-4 border border-ink/15 bg-paper/60 px-6 py-4 text-left text-[15px] font-medium text-ink transition-all hover:border-ink hover:bg-white cursor-pointer"
                        >
                          <span>{opt.label}</span>
                          <Arrow className="shrink-0 text-ink/40 transition-all group-hover:translate-x-1.5 group-hover:text-ink" />
                          <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-hover:w-full" />
                        </button>
                      ))}
                    </div>

                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={handleWizardBack}
                        className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-[14px] font-bold text-ink transition-colors hover:border-ink hover:bg-paper cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. TIMELINE */}
        <section
          id="cra-timeline"
          aria-labelledby="timeline-heading"
          className="scroll-mt-32 bg-ink py-28 text-white lg:py-36"
        >
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 lg:mb-20">
              <p className="eyebrow mb-6 text-signal">Compliance roadmap</p>
              <h2
                id="timeline-heading"
                className="title text-[clamp(2.4rem,5.4vw,4.6rem)] text-white"
              >
                Key EU CRA <b>milestones.</b>
              </h2>
            </Reveal>

            <div className="grid gap-px bg-white/10 md:grid-cols-3">
              {TIMELINE_MILESTONES.map((milestone, i) => (
                <Reveal key={milestone.date} delay={i * 100} className="bg-ink">
                  <div className="group relative flex h-full flex-col p-8 transition-colors hover:bg-white/[0.04] lg:p-12">
                    <p className="mb-6 text-sm font-bold tabular-nums text-signal">
                      0{i + 1}
                    </p>
                    <p className="title text-[clamp(1.8rem,3vw,2.6rem)] text-white">
                      {milestone.date}
                    </p>
                    <h3 className="mt-4 text-[15px] font-bold uppercase tracking-[0.12em] text-signal">
                      {milestone.title}
                    </h3>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-white/60">
                      {milestone.detail}
                    </p>
                    <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={180}>
              <p className="mt-10 border-t border-white/10 pt-8 text-[15px] leading-relaxed text-white/65">
                Entered into force <b className="font-semibold text-white">10 Dec 2024</b> ·
                Reporting obligations (Art. 14) and notified-body provisions apply from{' '}
                <b className="font-semibold text-white">11 Sep 2026</b> · All other obligations
                apply from <b className="font-semibold text-white">11 Dec 2027</b>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 4. FULL CATALOG */}
        <section
          id="full-catalog"
          aria-labelledby="catalog-heading"
          className="scroll-mt-32 bg-white py-24 lg:py-36"
        >
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow mb-6 text-brand">Reference index</p>
                <h2
                  id="catalog-heading"
                  className="title text-[clamp(2.4rem,5.4vw,4.6rem)]"
                >
                  Full <b>catalog.</b>
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((f) => {
                  const active = catalogFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setCatalogFilter(f.key)}
                      className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors cursor-pointer ${
                        active
                          ? 'bg-ink text-white'
                          : 'border border-ink/15 bg-white text-ink/60 hover:border-ink hover:text-ink'
                      }`}
                    >
                      {f.label} ({categoryCounts[f.key]})
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="overflow-hidden bg-white shadow-xl shadow-ink/5 ring-1 ring-ink/10">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[14px]">
                    <thead>
                      <tr className="border-b border-ink/10 bg-paper text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Result</th>
                        <th className="px-6 py-4">Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {filteredCatalog.map((item) => {
                        const verdict = VERDICTS[item.category];
                        return (
                          <tr
                            key={item.name}
                            className="transition-colors hover:bg-paper/70"
                          >
                            <td className="px-6 py-4 align-top font-medium text-ink">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 align-top whitespace-nowrap">
                              <span
                                className={`inline-block rounded-full px-3 py-1 text-[11.5px] font-bold ${verdict.badgeClass}`}
                              >
                                {verdict.shortLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top font-mono text-[12.5px] text-ink/60">
                              {item.basis}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>

            {/* DISCLAIMER */}
            <div className="mt-12 border-t border-ink/10 pt-8 text-[13px] leading-relaxed text-ink/55">
              Indicative screening aid, not legal advice. Based on Art. 2, Art. 3, Art. 7,
              Annexes III and IV of Regulation (EU) 2024/2847 and Implementing Regulation (EU)
              2025/2392 (technical descriptions of important and critical categories).
              Classification depends on the product&apos;s actual functionality and intended
              purpose, so confirm against{' '}
              <a
                href="https://eur-lex.europa.eu/eli/reg/2024/2847/oj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-deep"
              >
                EUR-Lex (eur-lex.europa.eu/eli/reg/2024/2847/oj)
                <ExternalLink className="h-3 w-3" />
              </a>
              , the Commission&apos;s CRA guidance and the delegated acts, which may have
              changed since this was compiled.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
