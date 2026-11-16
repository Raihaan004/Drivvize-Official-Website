'use client';

import React, { useState } from 'react';
import { PARTNER } from './data';
import { Reveal } from './hooks';

export default function Partner() {
  const [a, setA] = useState(0);
  return (
    <section id="partner" className="bg-paper py-32 lg:py-44">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-24">
          <p className="eyebrow mb-6 text-brand">How we partner</p>
          <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
            We partner with <b>you</b> to:
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:order-2 lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden bg-ink lg:sticky lg:top-28 lg:aspect-[4/5]">
              {PARTNER.map((p, i) => (
                <img
                  key={p.image}
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out ${
                    i === a ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  }`}
                />
              ))}
              <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tabular-nums">
                0{a + 1} / 0{PARTNER.length}
              </span>
            </div>
          </div>

          <ol className="lg:order-1 lg:col-span-7">
            {PARTNER.map((p, i) => (
              <Reveal as="li" key={p.text} delay={(i % 4) * 60}>
                <button
                  onMouseEnter={() => setA(i)}
                  onFocus={() => setA(i)}
                  onClick={() => setA(i)}
                  className="group relative flex w-full items-baseline gap-5 border-t border-ink/10 py-6 text-left sm:gap-8 sm:py-7 cursor-pointer"
                >
                  <span
                    className={`w-7 shrink-0 text-sm font-bold tabular-nums transition-colors ${
                      i === a ? 'text-brand' : 'text-ink/30'
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`text-[clamp(1.15rem,1.9vw,1.6rem)] font-medium leading-snug tracking-tight transition-all duration-500 ${
                      i === a ? 'translate-x-1 text-ink' : 'text-ink/35'
                    }`}
                  >
                    {p.text}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-px bg-signal transition-all duration-700 ${
                      i === a ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              </Reveal>
            ))}
            <li className="border-t border-ink/10" />
          </ol>
        </div>
      </div>
    </section>
  );
}

