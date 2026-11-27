'use client';

import React, { useState } from 'react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { Photo, Reveal } from '@/components/premium-home/hooks';

type Cell = boolean | string;
const EDITIONS = ['Basic', 'Custom', 'Consultant'] as const;

const ROWS: { label: string; v: [Cell, Cell, Cell] }[] = [
  { label: 'Workflow', v: [true, true, true] },
  { label: 'Templates', v: [true, true, true] },
  { label: 'Checklists', v: [true, true, true] },
  { label: 'Guidelines', v: [true, true, true] },
  { label: 'Integration to Customer Portal', v: [false, true, true] },
  { label: 'Process Upgrades', v: [false, false, true] },
  { label: 'Customization for Organization (upon deployment)', v: [false, true, true] },
  { label: '1:1 Consulting Hours (excluding review hours)', v: ['0', '40', '40 per month (lifetime)'] },
];

const CORE = ['Workflow', 'Templates', 'Checklists', 'Guidelines'];

const CARDS = [
  {
    name: 'Basic Edition',
    image: '/images/product_img/basic-edition.jpg',
    hours: '0',
    hoursLabel: 'consulting hours',
  },
  {
    name: 'Custom Edition',
    image: '/images/product_img/custom-edition.jpg',
    hours: '40',
    hoursLabel: '1:1 consulting hours',
  },
  {
    name: 'Consultant Edition',
    image: '/images/product_img/consultant-edition.jpg',
    hours: '40',
    hoursLabel: 'per month (lifetime)',
  },
];

const TILES = [
  { name: 'Workflow', image: '/images/product_img/workflow.jpg' },
  { name: 'Templates', image: '/images/product_img/template.jpg' },
  { name: 'Checklists', image: '/images/product_img/checklist.jpg' },
  { name: 'Guidelines', image: '/images/product_img/guidelines.jpg' },
];

const Check = ({ on }: { on: boolean }) =>
  on ? (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-deep"
      aria-label="Yes"
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M2 6.4l2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  ) : (
    <span
      className="inline-flex h-6 w-6 items-center justify-center text-ink/25"
      aria-label="No"
    >
      <svg width="12" height="2" viewBox="0 0 12 2">
        <path d="M0 1h12" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );

export function ProductsClient() {
  const [col, setCol] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main>
        {/* hero */}
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink text-white">
          <img
            src="/images/product_img/product-banner.jpg"
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.85),rgba(10,16,24,0.35)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Products</p>
            <h1 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white">
              {['ISO', '26262', 'Kit'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={i === 2 ? 'font-semibold text-white' : 'text-white/80'}
                    style={{ animationDelay: `${150 + i * 110}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-up mt-8 max-w-lg text-[17px] leading-relaxed text-white/75"
              style={{ animationDelay: '0.8s' }}
            >
              Available in three editions: Basic, Custom and Consultant.
            </p>
            <div className="fade-up mt-10 flex gap-4" style={{ animationDelay: '1s' }}>
              <a
                href="#editions"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('editions')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full bg-signal px-7 py-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                View editions
              </a>
              <a
                href="#compare"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full border border-white/40 px-7 py-4 text-[14px] font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              >
                Compare
              </a>
            </div>
          </div>
        </section>

        {/* editions */}
        <section id="editions" className="py-32 lg:py-44">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 lg:mb-24">
              <p className="eyebrow mb-6 text-brand">Choose your edition</p>
              <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)] text-ink">
                ISO 26262 Kit, <b>three ways.</b>
              </h2>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {CARDS.map((c, i) => (
                <Reveal key={c.name} delay={i * 120}>
                  <article className="group flex h-full flex-col bg-paper transition-shadow duration-500 hover:shadow-2xl hover:shadow-ink/10">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                      <img
                        src={c.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                      />
                      <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tabular-nums text-ink">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-7 lg:p-8">
                      <p className="eyebrow mb-3 !text-[11px] text-ink/45">ISO 26262 Kit</p>
                      <h3 className="text-3xl font-light tracking-tight text-ink">{c.name}</h3>

                      <div className="my-7 flex items-baseline gap-3 border-y border-ink/10 py-5">
                        <span className="title text-6xl !font-extralight text-deep">{c.hours}</span>
                        <span className="text-sm font-semibold text-ink/55">{c.hoursLabel}</span>
                      </div>

                      <ul className="flex-1 space-y-3 text-[15px]">
                        {ROWS.slice(0, 7).map((r) => (
                          <li
                            key={r.label}
                            className={`flex items-start gap-3 ${
                              r.v[i] ? 'text-ink' : 'text-ink/30 line-through decoration-ink/20'
                            }`}
                          >
                            <span className="mt-0.5">
                              <Check on={Boolean(r.v[i])} />
                            </span>
                            <span className="pt-0.5">{r.label}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={`mailto:consult@drivvize.com?subject=${encodeURIComponent(
                          `ISO 26262 Kit: ${c.name}`
                        )}`}
                        className="group/btn mt-9 inline-flex items-center justify-between rounded-full border border-ink px-6 py-3.5 text-[14px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
                      >
                        Enquire about this edition
                        <svg
                          width="18"
                          height="10"
                          viewBox="0 0 18 10"
                          className="transition-transform group-hover/btn:translate-x-1.5"
                        >
                          <path
                            d="M0 5h16M12 1l4 4-4 4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* included in every edition */}
        <section className="bg-ink py-32 text-white lg:py-44">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 flex flex-col justify-between gap-6 lg:mb-24 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow mb-6 text-signal">In every edition</p>
                <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)] text-white">
                  The <b>core kit.</b>
                </h2>
              </div>
              <p className="max-w-xs text-white/55">
                {CORE.join(', ')} come with Basic, Custom and Consultant.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {TILES.map((t, i) => (
                <Reveal key={t.name} delay={i * 100} className={i % 2 ? 'lg:mt-14' : ''}>
                  <div className="group relative aspect-[3/4] overflow-hidden bg-deep">
                    <img
                      src={t.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 lg:p-6">
                      <div>
                        <p className="mb-1 text-xs font-bold tabular-nums text-signal">0{i + 1}</p>
                        <p className="text-xl font-light tracking-tight text-white lg:text-2xl">
                          {t.name}
                        </p>
                      </div>
                      <Check on />
                    </div>
                    <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* comparison */}
        <section id="compare" className="py-32 lg:py-44">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 lg:mb-20">
              <p className="eyebrow mb-6 text-brand">Compare editions</p>
              <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)] text-ink">
                Side by <b>side.</b>
              </h2>
            </Reveal>

            <Reveal>
              <div className="-mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
                <table
                  className="w-full min-w-[640px] border-collapse text-left"
                  onMouseLeave={() => setCol(null)}
                >
                  <thead>
                    <tr>
                      <th className="w-[38%] pb-6 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
                        Parameters
                      </th>
                      {EDITIONS.map((e, i) => (
                        <th
                          key={e}
                          onMouseEnter={() => setCol(i)}
                          className={`relative pb-6 text-sm font-bold uppercase tracking-[0.14em] transition-colors ${
                            col === i ? 'text-deep' : 'text-ink'
                          }`}
                        >
                          {e}
                          <span
                            className={`absolute bottom-0 left-0 h-[3px] bg-signal transition-all duration-500 ${
                              col === i ? 'w-full' : 'w-0'
                            }`}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r) => (
                      <tr key={r.label} className="border-t border-ink/10">
                        <th
                          scope="row"
                          className="py-5 pr-6 text-[15px] font-medium text-ink/80"
                        >
                          {r.label}
                        </th>
                        {r.v.map((v, i) => (
                          <td
                            key={i}
                            onMouseEnter={() => setCol(i)}
                            className={`py-5 pr-4 text-[15px] transition-colors duration-300 ${
                              col === i ? 'bg-paper' : ''
                            }`}
                          >
                            {typeof v === 'string' ? (
                              <span className="font-semibold text-ink">{v}</span>
                            ) : (
                              <Check on={v} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t border-ink/10">
                      <td />
                      {EDITIONS.map((e) => (
                        <td key={e} className="pt-8">
                          <a
                            href={`mailto:consult@drivvize.com?subject=${encodeURIComponent(
                              `ISO 26262 Kit: ${e} Edition`
                            )}`}
                            className="text-sm font-bold underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-deep"
                          >
                            Enquire
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>

            <div className="mt-24">
              <Photo
                src="/images/product_img/product-last-banner.jpg"
                alt="Drivvize ISO 26262 Kit engineering visual"
                className="aspect-[21/8]"
                speed={0.07}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ProductsClient;
