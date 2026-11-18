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
              <article className="group flex flex-col border-t border-ink/15 pt-8 h-full">
                {/* Founder Photo */}
                <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white border border-line shadow-xs">
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-ink shadow-xs border border-line">
                    <span className="font-extrabold text-brand">{f.years}+</span> yrs in Auto
                  </div>
                </div>

                {/* Founder Details */}
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-ink group-hover:text-deep transition-colors">
                    {f.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand">
                    Co-Founder &amp; Leadership
                  </p>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-ink/65 flex-1">
                  {f.bio}
                </p>

                {/* LinkedIn Action Button */}
                <div className="mt-6 pt-5 border-t border-ink/10">
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with ${f.name} on LinkedIn`}
                    className="group/btn flex w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-bold text-ink transition-all duration-300 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:shadow-md cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 17L17 7M17 7H7M17 7V17"
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
  );
}
