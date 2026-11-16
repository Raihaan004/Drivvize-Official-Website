'use client';

import React from 'react';
import { FOUNDERS } from './data';
import { Reveal } from './hooks';

export default function Founders() {
  return (
    <section id="founders" className="bg-paper py-32 lg:py-44">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-24">
          <p className="eyebrow mb-6 text-brand">The founders</p>
          <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
            Engineers <b>first.</b>
          </h2>
        </Reveal>

        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 130}>
              <article className="group border-t border-ink/15 pt-8">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/20 text-xl font-semibold tracking-wide text-deep transition-colors duration-500 group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
                    {f.initials}
                  </div>
                  <p className="text-right text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-ink/50">
                    <span className="title block !font-extralight text-5xl normal-case tracking-tight text-ink">
                      {f.years}+
                    </span>
                    years in Automotive
                  </p>
                </div>
                <h3 className="text-2xl font-medium tracking-tight">{f.name}</h3>
                <p className="mt-4 text-[15.5px] leading-relaxed text-ink/65">{f.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

