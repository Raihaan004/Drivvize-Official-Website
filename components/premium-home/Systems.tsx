'use client';

import React from 'react';
import { GROUPS } from './data';
import { Reveal } from './hooks';

export default function Systems() {
  return (
    <section id="systems" className="bg-ink py-32 text-white lg:py-44">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 lg:mb-24 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow mb-6 text-signal">Products &amp; systems</p>
            <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
              Systems we <b>made safer.</b>
            </h2>
          </div>
          <p className="max-w-xs text-white/55">
            Fifteen safety-critical systems across chassis, powertrain, perception and cabin.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, i) => (
            <Reveal key={g.name} delay={i * 110}>
              <article className="group relative h-[520px] overflow-hidden bg-deep">
                <img
                  src={g.image}
                  alt={g.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="mb-1 text-xs font-bold tabular-nums text-signal">0{i + 1}</p>
                  <h3 className="mb-5 text-2xl font-light leading-tight tracking-tight">{g.name}</h3>
                  <ul className="text-[14px] text-white/75">
                    {g.systems.map((s) => (
                      <li
                        key={s}
                        className="border-t border-white/15 py-2 transition-all duration-300 hover:pl-2 hover:text-white"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

