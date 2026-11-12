'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  X,
  ShieldCheck,
  ArrowLeft,
  RotateCcw,
  CalendarClock,
  TableProperties,
  Compass,
  Info,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { AnimatedGradientBackground } from '@/components/ui/AnimatedGradientBackground';
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

const CATEGORY_FILTERS: Array<{ key: 'all' | ScopeCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'in', label: 'Default' },
  { key: 'c1', label: 'Class I' },
  { key: 'c2', label: 'Class II' },
  { key: 'cr', label: 'Critical' },
  { key: 'ou', label: 'Out of scope' },
  { key: 'co', label: 'Conditional' },
];

export const ScopeCheckerClient: React.FC = () => {
  const [query, setQuery] = useState('');
  const [step, setStep] = useState(0);
  const [wizardOutcome, setWizardOutcome] = useState<WizardOutcome | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<'all' | ScopeCategory>('all');

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
        className="relative overflow-hidden rounded-[14px] bg-white border border-[#DCE3EA] p-5 sm:p-6 shadow-[0_6px_20px_-8px_rgba(11,37,69,0.08)]"
      >
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${verdict.accentBarClass}`}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${verdict.badgeClass}`}
          >
            {verdict.label}
          </span>
          <span className="text-[12px] font-mono text-[#315B7D] bg-[#F1F5F9] px-2.5 py-1 rounded-md border border-[#DCE3EA]">
            Basis: {item.basis}
          </span>
        </div>

        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B2545]">
          {item.name}
        </h3>
        <p className="text-[14.5px] text-[#202B36] mt-1.5 leading-[1.6]">
          {item.description}
        </p>
        <p className="text-[13px] text-[#315B7D] mt-2.5 pt-2.5 border-t border-[#F1F5F9] leading-[1.55]">
          {verdict.guidance}
        </p>
      </article>
    );
  };

  return (
    <div className="bg-white">
      {/* HERO HEADER */}
      <section
        aria-labelledby="scope-checker-heading"
        className="relative overflow-hidden bg-gradient-corporate-blue text-white border-b border-[#315B7D]/45"
      >
        <AmbientGlow
          tone="blue"
          position="top-right"
          sizeClass="w-[340px] h-[340px] sm:w-[540px] sm:h-[540px]"
        />
        <AmbientGlow
          tone="cyan"
          position="bottom-left"
          hideOnMobile
          sizeClass="w-[460px] h-[460px]"
        />
        <TechnicalGrid theme="dark" showNodes opacityClass="opacity-55" />

        <div className="relative z-10 max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 shrink-0" />
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.09em] uppercase text-white">
              REGULATION (EU) 2024/2847 <span className="text-[#06B6D4] mx-1">|</span> CYBER
              RESILIENCE ACT
            </span>
          </div>

          <h1
            id="scope-checker-heading"
            className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold text-white leading-[1.1] tracking-[-0.025em]"
          >
            EU CRA{' '}
            <span className="text-gradient-innovation">Scope Checker</span>
          </h1>

          <p className="mt-4 text-[15.5px] sm:text-[17px] text-[#DCE3EA] leading-[1.68] max-w-[740px]">
            Regulation (EU) 2024/2847 (Cyber Resilience Act). Type a product name for a
            catalog lookup, or use the screening wizard below for anything not in the
            catalog.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[12.5px] text-[#DCE3EA]/90">
            <a
              href="#catalog-lookup"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/16 border border-white/15 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Catalog lookup</span>
            </a>
            <a
              href="#screening-wizard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/16 border border-white/15 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Screening wizard</span>
            </a>
            <a
              href="#cra-timeline"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/16 border border-white/15 transition-colors"
            >
              <CalendarClock className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Timeline</span>
            </a>
            <a
              href="#full-catalog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/16 border border-white/15 transition-colors"
            >
              <TableProperties className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Full catalog ({CATALOG.length})</span>
            </a>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKSPACE */}
      <AnimatedGradientBackground
        variant="light-corporate"
        showGrid
        showOrbs
        className="py-10 sm:py-14 lg:py-16"
      >
        <div className="relative z-10 max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* 1. CATALOG LOOKUP */}
          <section id="catalog-lookup" aria-labelledby="lookup-heading">
            <div className="rounded-[16px] bg-white border border-[#DCE3EA] p-5 sm:p-7 shadow-[0_10px_30px_-12px_rgba(11,37,69,0.09)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] border border-[#DCE3EA] flex items-center justify-center">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h2
                      id="lookup-heading"
                      className="text-[18px] sm:text-[20px] font-bold text-[#0B2545]"
                    >
                      Product Catalog Lookup
                    </h2>
                    <p className="text-[13px] text-[#315B7D]">
                      Search {CATALOG.length} mapped product categories across Art. 2, Annex
                      III, and Annex IV
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="cra-search-input" className="sr-only">
                  Search product name or category
                </label>
                <Search className="w-4.5 h-4.5 text-[#315B7D] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="cra-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. smart door lock, pacemaker, password manager, SaaS CRM…"
                  autoComplete="off"
                  className="w-full pl-11 pr-11 py-3.5 text-[15.5px] rounded-[12px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search query"
                    onClick={() => setQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[#315B7D] hover:text-[#0B2545] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Example Chips */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-[#315B7D] mr-1">
                  Try:
                </span>
                {EXAMPLE_CHIPS.map((chip) => {
                  const isSelected =
                    normalizeQuery(query) === normalizeQuery(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQuery(chip)}
                      className={`px-3 py-1 rounded-lg text-[12.5px] font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                          : 'bg-[#F8FAFC] text-[#0B2545] border-[#DCE3EA] hover:border-[#2563EB] hover:text-[#2563EB]'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* Search Results */}
              {hasActiveSearch && (
                <div className="mt-5 space-y-3" aria-live="polite">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map(renderResultCard)}
                      <p className="text-[13px] text-[#315B7D] flex items-center gap-2 pt-1">
                        <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <span>
                          Not an exact match? Confirm with the wizard below, since
                          classification depends on actual functionality.
                        </span>
                      </p>
                    </>
                  ) : (
                    <div className="rounded-[12px] bg-[#F8FAFC] border border-[#DCE3EA] p-4 text-[14.5px] text-[#202B36]">
                      No catalog match for “{query}”. Use the screening wizard below.
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* 2. SCREENING WIZARD */}
          <section id="screening-wizard" aria-labelledby="wizard-heading">
            <div className="flex items-center gap-2.5 mb-4">
              <Compass className="w-5 h-5 text-[#2563EB]" />
              <h2
                id="wizard-heading"
                className="text-[20px] sm:text-[22px] font-bold text-[#0B2545]"
              >
                Screening wizard (for products not in the catalog)
              </h2>
            </div>

            <div className="rounded-[16px] bg-white border border-[#DCE3EA] p-5 sm:p-7 shadow-[0_10px_30px_-12px_rgba(11,37,69,0.08)]">
              {wizardOutcome ? (
                wizardOutcome.type === 'out' ? (
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] font-semibold ${VERDICTS.ou.badgeClass}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {VERDICTS.ou.label}
                    </span>
                    <p className="mt-3 text-[16px] font-semibold text-[#0B2545]">
                      {wizardOutcome.reason}
                    </p>
                    <p className="mt-2 text-[14px] text-[#315B7D] leading-[1.6]">
                      {VERDICTS.ou.guidance}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={handleWizardBack}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#DCE3EA] bg-white hover:border-[#2563EB] text-[14px] font-medium text-[#0B2545] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleWizardReset}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-semibold transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Start over
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] font-semibold ${VERDICTS[wizardOutcome.category].badgeClass}`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {VERDICTS[wizardOutcome.category].label}
                    </span>
                    <p className="mt-3 text-[16px] font-semibold text-[#0B2545]">
                      Passed all exclusion tests; connected, commercially supplied product.
                    </p>
                    <p className="mt-2 text-[14px] text-[#202B36] leading-[1.6]">
                      {VERDICTS[wizardOutcome.category].guidance}
                    </p>
                    <p className="mt-2.5 text-[13px] text-[#315B7D] bg-[#F8FAFC] border border-[#DCE3EA] rounded-[10px] p-3">
                      Note: Annex III/IV classification follows Implementing Regulation
                      (EU) 2025/2392; confirm the product&apos;s core functionality fits
                      the technical description.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={handleWizardBack}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#DCE3EA] bg-white hover:border-[#2563EB] text-[14px] font-medium text-[#0B2545] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleWizardReset}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-semibold transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Start over
                      </button>
                    </div>
                  </div>
                )
              ) : step < WIZARD_QUESTIONS.length ? (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#2563EB]">
                      Step {step + 1} of {totalWizardSteps}
                    </span>
                    <div className="flex-1 max-w-[220px] h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-all duration-300"
                        style={{
                          width: `${((step + 1) / totalWizardSteps) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-[16px] sm:text-[17px] font-semibold text-[#0B2545] leading-[1.45]">
                    {WIZARD_QUESTIONS[step].question}
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-[#315B7D]">
                    {WIZARD_QUESTIONS[step].hint}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleWizardYesNo('yes')}
                      className="px-5 py-2.5 rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-[14.5px] font-semibold text-[#0B2545] transition-all cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWizardYesNo('no')}
                      className="px-5 py-2.5 rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-white hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-[14.5px] font-semibold text-[#0B2545] transition-all cursor-pointer"
                    >
                      No
                    </button>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handleWizardBack}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] border border-[#DCE3EA] bg-[#F8FAFC] hover:border-[#315B7D] text-[14px] font-medium text-[#315B7D] hover:text-[#0B2545] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#2563EB]">
                      Step {totalWizardSteps} of {totalWizardSteps}
                    </span>
                    <div className="flex-1 max-w-[220px] h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]" />
                    </div>
                  </div>

                  <p className="text-[16px] sm:text-[17px] font-semibold text-[#0B2545] leading-[1.45]">
                    Does it match an Annex III / IV category? Pick the closest.
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-[#315B7D]">
                    Pick “None” if it is an ordinary connected product.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {ANNEX_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleAnnexSelect(opt.key)}
                        className="w-full text-left px-4 py-3 rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] hover:bg-white hover:border-[#2563EB] text-[14px] sm:text-[14.5px] font-medium text-[#0B2545] transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleWizardBack}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#DCE3EA] bg-white hover:border-[#315B7D] text-[14px] font-medium text-[#315B7D] hover:text-[#0B2545] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. TIMELINE */}
          <section id="cra-timeline" aria-labelledby="timeline-heading">
            <div className="flex items-center gap-2.5 mb-4">
              <CalendarClock className="w-5 h-5 text-[#2563EB]" />
              <h2
                id="timeline-heading"
                className="text-[20px] sm:text-[22px] font-bold text-[#0B2545]"
              >
                Timeline
              </h2>
            </div>

            <div className="rounded-[16px] bg-white border border-[#DCE3EA] p-5 sm:p-6 shadow-[0_8px_24px_-12px_rgba(11,37,69,0.07)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIMELINE_MILESTONES.map((milestone) => (
                  <div
                    key={milestone.date}
                    className="rounded-[12px] bg-[#F8FAFC] border border-[#DCE3EA] p-4"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${milestone.accentClass}`}
                      />
                      <span className="text-[13.5px] font-bold text-[#0B2545]">
                        {milestone.date}
                      </span>
                    </div>
                    <div className="text-[14px] font-semibold text-[#2563EB]">
                      {milestone.title}
                    </div>
                    <p className="text-[13px] text-[#315B7D] mt-1 leading-[1.5]">
                      {milestone.detail}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 pt-3.5 border-t border-[#F1F5F9] text-[13.5px] text-[#202B36]">
                Entered into force <b>10 Dec 2024</b> · Reporting obligations (Art. 14) and
                notified-body provisions apply from <b>11 Sep 2026</b> · All other
                obligations apply from <b>11 Dec 2027</b>.
              </p>
            </div>
          </section>

          {/* 4. FULL CATALOG */}
          <section id="full-catalog" aria-labelledby="catalog-heading">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <TableProperties className="w-5 h-5 text-[#2563EB]" />
                <h2
                  id="catalog-heading"
                  className="text-[20px] sm:text-[22px] font-bold text-[#0B2545]"
                >
                  Full catalog
                </h2>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_FILTERS.map((f) => {
                  const active = catalogFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setCatalogFilter(f.key)}
                      className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#0B2545] text-white border-[#0B2545]'
                          : 'bg-white text-[#315B7D] border-[#DCE3EA] hover:border-[#2563EB] hover:text-[#2563EB]'
                      }`}
                    >
                      {f.label} ({categoryCounts[f.key]})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[16px] bg-white border border-[#DCE3EA] overflow-hidden shadow-[0_8px_24px_-12px_rgba(11,37,69,0.07)]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13.5px]">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#DCE3EA] text-[#0B2545]">
                      <th className="py-3 px-4 font-bold">Product</th>
                      <th className="py-3 px-4 font-bold">Result</th>
                      <th className="py-3 px-4 font-bold">Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredCatalog.map((item) => {
                      const verdict = VERDICTS[item.category];
                      return (
                        <tr
                          key={item.name}
                          className="hover:bg-[#F8FAFC]/80 transition-colors"
                        >
                          <td className="py-2.5 px-4 font-medium text-[#0B2545] align-top">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-4 align-top whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold ${verdict.badgeClass}`}
                            >
                              {verdict.shortLabel}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-[#315B7D] font-mono text-[12px] align-top">
                            {item.basis}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* DISCLAIMER */}
          <footer className="pt-4 border-t border-[#DCE3EA] text-[12.5px] text-[#315B7D] leading-[1.65]">
            Indicative screening aid, not legal advice. Based on Art. 2, Art. 3, Art. 7,
            Annexes III and IV of Regulation (EU) 2024/2847 and Implementing Regulation
            (EU) 2025/2392 (technical descriptions of important and critical categories).
            Classification depends on the product&apos;s actual functionality and intended
            purpose, so confirm against{' '}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2024/2847/oj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#2563EB] hover:underline font-medium"
            >
              EUR-Lex (eur-lex.europa.eu/eli/reg/2024/2847/oj)
              <ExternalLink className="w-3 h-3" />
            </a>
            , the Commission&apos;s CRA guidance and the delegated acts, which may have
            changed since this was compiled.
          </footer>
        </div>
      </AnimatedGradientBackground>
    </div>
  );
};

