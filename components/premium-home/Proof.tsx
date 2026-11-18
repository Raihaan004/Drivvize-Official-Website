'use client';

import React from 'react';
import { INDUSTRIES, STATS } from './data';
import { CountUp, Reveal } from './hooks';

export default function Proof() {
  return (
    <section id="proof" className="py-32 lg:py-44">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 lg:mb-24 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-6 text-brand">Track record</p>
            <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
              Delivered, <b>end-to-end.</b>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 border-t border-ink/10 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={(i % 3) * 90}
              className="border-b border-ink/10 py-10 pr-4 lg:py-14 lg:pr-10"
            >
              <div className="title text-[clamp(3.4rem,7.4vw,7rem)] !font-extralight leading-none text-ink">
                <CountUp to={s.n} />
              </div>
              <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mb-6 mt-24 flex items-center gap-4">
          <p className="eyebrow text-ink/50">Industries we serve</p>
          <span className="h-px flex-1 bg-ink/10" />
        </Reveal>

        <div className="flex flex-col gap-3 lg:h-[480px] lg:flex-row">
          {INDUSTRIES.map((x, i) => (
            <div
              key={x.name}
              className="group relative h-64 overflow-hidden bg-paper lg:h-auto lg:flex-[1_1_0%] lg:transition-[flex-grow,flex] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:hover:flex-[1.7_1_0%]"
            >
              <Reveal delay={i * 120} className="relative h-full w-full">
                <img
                  src={x.image}
                  alt={x.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <p className="absolute bottom-6 left-7 text-3xl font-light tracking-tight text-white">
                  {x.name}
                </p>
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 ease-out group-hover:w-full" />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

