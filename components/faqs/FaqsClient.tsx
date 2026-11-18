'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { Reveal } from '@/components/premium-home/hooks';
import {
  FAQ_CATEGORIES,
  FAQS,
  type FaqBlock,
  type FaqCategory,
  type FaqItem,
} from './faqs-data';

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="10" viewBox="0 0 18 10" className={className}>
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

function renderTextWithEmail(text: string) {
  const parts = text.split(/(consult@drivvize\.com)/gi);
  if (parts.length === 1) return text;
  return parts.map((part, idx) =>
    part.toLowerCase() === 'consult@drivvize.com' ? (
      <a
        key={idx}
        href="mailto:consult@drivvize.com"
        className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-deep"
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

function AnswerBlocks({ blocks }: { blocks: FaqBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, idx) => {
        if (b.type === 'heading') {
          return (
            <h4
              key={idx}
              className="pt-2 text-[12px] font-bold uppercase tracking-[0.18em] text-brand"
            >
              {b.text}
            </h4>
          );
        }
        if (b.type === 'p') {
          return (
            <p key={idx} className="max-w-3xl text-[16px] leading-[1.8] text-ink/75">
              {renderTextWithEmail(b.text)}
            </p>
          );
        }
        if (b.type === 'list') {
          return (
            <ul key={idx} className="grid gap-2.5 sm:grid-cols-2 max-w-3xl">
              {b.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink/75"
                >
                  <i className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-signal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === 'table') {
          return (
            <div
              key={idx}
              className="my-2 overflow-hidden border border-ink/10 bg-white shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-ink/10 bg-paper text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60">
                      {b.headers.map((h) => (
                        <th key={h} className="px-5 py-3.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {b.rows.map(([no, topic, duration]) => (
                      <tr key={no} className="transition-colors hover:bg-paper/60">
                        <td className="px-5 py-3 font-bold tabular-nums text-brand w-20">
                          {no.padStart(2, '0')}
                        </td>
                        <td className="px-5 py-3 font-medium text-ink">{topic}</td>
                        <td className="px-5 py-3 text-ink/65 whitespace-nowrap">{duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function FaqRow({
  item,
  index,
  open,
  toggle,
}: {
  item: FaqItem;
  index: number;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <article className="border-t border-ink/10">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-6 py-7 text-left sm:items-center sm:py-8 cursor-pointer"
      >
        <div className="flex items-start gap-5 sm:gap-8">
          <span className="mt-1 w-7 shrink-0 text-sm font-bold tabular-nums text-brand">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink/40">
              {item.category}
            </p>
            <h3 className="text-[clamp(1.15rem,2vw,1.55rem)] font-light leading-snug tracking-tight text-ink transition-colors group-hover:text-deep">
              {item.question}
            </h3>
          </div>
        </div>
        <span
          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:border-signal group-hover:bg-signal group-hover:text-ink sm:mt-0 ${
            open ? 'rotate-45 !border-signal bg-signal text-ink' : 'text-ink'
          }`}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-10 pl-12 pr-4 sm:pl-[3.75rem] sm:pr-14">
            <AnswerBlocks blocks={item.blocks} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function FaqsClient() {
  const [category, setCategory] = useState<FaqCategory>('All');
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [FAQS[0].id]: true,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (!q) return true;
      if (item.question.toLowerCase().includes(q)) return true;
      return item.blocks.some((b) => {
        if (b.type === 'p' || b.type === 'heading') return b.text.toLowerCase().includes(q);
        if (b.type === 'list') return b.items.some((i) => i.toLowerCase().includes(q));
        if (b.type === 'table')
          return b.rows.some((r) => r.some((cell) => cell.toLowerCase().includes(q)));
        return false;
      });
    });
  }, [category, query]);

  const counts = useMemo(() => {
    const map: Record<FaqCategory, number> = {
      All: FAQS.length,
      'Functional Safety': 0,
      'Cybersecurity & CRA': 0,
      Trainings: 0,
      'Processes & Certification': 0,
      'OEM & ECUs': 0,
    };
    for (const f of FAQS) map[f.category] += 1;
    return map;
  }, []);

  const allExpanded =
    filtered.length > 0 && filtered.every((item) => Boolean(openIds[item.id]));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIds({});
    } else {
      const next: Record<string, boolean> = {};
      for (const item of filtered) next[item.id] = true;
      setOpenIds(next);
    }
  };

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* Hero */}
        <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden bg-ink text-white">
          <img
            src={IMG.meeting}
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.9),rgba(10,16,24,0.45)),linear-gradient(0deg,rgba(10,16,24,0.75),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">FAQs</p>
            <h1 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white">
              {['Frequently', 'asked', 'questions.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 0 || i === 2 ? 'font-semibold text-white' : 'text-white/80'
                    }
                    style={{ animationDelay: `${150 + i * 110}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-up mt-8 max-w-xl text-[17px] leading-relaxed text-white/75"
              style={{ animationDelay: '0.8s' }}
            >
              Clear answers on Functional Safety (ISO 26262), Cybersecurity (ISO 21434 &amp;
              EU-CRA), SOTIF, AI Safety, trainings, templates, audits and supported ECUs.
            </p>
          </div>
        </section>

        {/* Sticky category filter bar */}
        <div className="sticky top-16 sm:top-20 z-30 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1320px] gap-7 overflow-x-auto px-6 lg:px-10">
            {FAQ_CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`relative whitespace-nowrap py-4 text-[12.5px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    active ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                  }`}
                >
                  {c} <span className="ml-1 text-ink/35">({counts[c]})</span>
                  <span
                    className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-signal transition-transform duration-500 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Content */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            {/* Search & Expand all */}
            <Reveal className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="group relative flex w-full max-w-xl items-center gap-3 border-b border-ink/20 focus-within:border-ink transition-colors">
                <label htmlFor="faq-search" className="sr-only">
                  Search FAQs
                </label>
                <Search className="h-4 w-4 shrink-0 text-ink/40 transition-colors group-focus-within:text-deep" />
                <input
                  id="faq-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions (e.g. ASIL-D, SOTIF, EU CRA, ASPICE, training…)"
                  className="w-full bg-transparent py-3 text-[15.5px] text-ink outline-none placeholder:text-ink/35"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink/45 hover:bg-paper hover:text-ink cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <span className="absolute -bottom-px left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-focus-within:w-full" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                  Showing {filtered.length} of {FAQS.length}
                </span>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="rounded-full border border-ink/20 px-5 py-2.5 text-[12.5px] font-bold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white cursor-pointer"
                >
                  {allExpanded ? 'Collapse all' : 'Expand all'}
                </button>
              </div>
            </Reveal>

            {/* Accordion list */}
            {filtered.length > 0 ? (
              <div className="border-b border-ink/10">
                {filtered.map((item, idx) => (
                  <FaqRow
                    key={item.id}
                    item={item}
                    index={idx}
                    open={Boolean(openIds[item.id])}
                    toggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-ink/10 bg-paper p-12 text-center">
                <p className="text-lg font-light text-ink/70">
                  No matching FAQs for “{query}”.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('All');
                  }}
                  className="mt-6 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-deep cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-paper py-24 lg:py-32">
          <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-10 px-6 lg:flex-row lg:items-center lg:px-10">
            <Reveal>
              <p className="eyebrow mb-4 text-brand">Still have a question?</p>
              <h2 className="title max-w-2xl text-[clamp(2rem,4vw,3.4rem)]">
                Talk directly with our <b>safety &amp; security engineers.</b>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 rounded-full bg-signal px-8 py-5 text-[15px] font-bold text-ink transition-transform hover:-translate-y-1"
              >
                Contact us
                <Arrow className="transition-transform group-hover:translate-x-2" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default FaqsClient;

