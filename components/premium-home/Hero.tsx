'use client';

import React, { useEffect, useState } from 'react';
import { goTo, HERO_SLIDES } from './data';

const LINES = [
  [{ t: 'Transform' }, { t: 'Innovation' }],
  [{ t: 'into' }, { t: 'safe,', b: true }, { t: 'secure,', b: true }],
  [{ t: 'scalable', b: true }, { t: 'and' }],
  [{ t: 'certifiable', b: true }, { t: 'products.' }],
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % HERO_SLIDES.length), 7000);
    return () => clearTimeout(t);
  }, [i]);

  let n = 0;
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-white"
    >
      {HERO_SLIDES.map((s, k) => (
        <div
          key={s.src}
          className={`absolute inset-0 -z-20 transition-opacity duration-[1800ms] ${
            k === i ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.src}
            alt=""
            className={`h-full w-full object-cover ${k === i ? 'kenburns' : ''}`}
            style={{ objectPosition: s.pos }}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.82)_0%,rgba(10,16,24,0.5)_50%,rgba(10,16,24,0.15)_100%),linear-gradient(0deg,rgba(10,16,24,0.7)_0%,transparent_45%)]" />

      <div className="mx-auto w-full max-w-[1320px] px-6 pb-28 pt-40 lg:px-10 lg:pb-32">
        <h1 className="title max-w-[14ch] text-[clamp(2.8rem,7.2vw,6.6rem)] sm:max-w-none">
          {LINES.map((l, k) => (
            <span key={k} className="block">
              {l.map((w) => {
                const d = 150 + n++ * 95;
                return (
                  <span key={w.t} className="word mr-[0.2em]">
                    <span
                      className={w.b ? 'font-semibold text-white' : 'text-white/80'}
                      style={{ animationDelay: `${d}ms` }}
                    >
                      {w.t}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="mt-12 grid items-end gap-10 lg:grid-cols-12">
          <p
            className="fade-up max-w-xl text-[17px] leading-relaxed text-white/75 lg:col-span-6"
            style={{ animationDelay: '1.1s' }}
          >
            Drivvize is your trusted partner for <b className="font-semibold text-white">functional safety</b> and{' '}
            <b className="font-semibold text-white">cybersecurity</b> challenges, helping{' '}
            <b className="font-semibold text-white">Automotive OEMs</b> and{' '}
            <b className="font-semibold text-white">Suppliers</b> move forward with clarity.
          </p>
          <div
            className="fade-up flex flex-wrap items-center gap-4 lg:col-span-6 lg:justify-end"
            style={{ animationDelay: '1.3s' }}
          >
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                goTo('about');
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Discover Drivvize
              <svg
                width="18"
                height="10"
                viewBox="0 0 18 10"
                className="transition-transform group-hover:translate-x-1.5"
              >
                <path
                  d="M0 5h16M12 1l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </a>
            <a
              href="#systems"
              onClick={(e) => {
                e.preventDefault();
                goTo('systems');
              }}
              className="rounded-full border border-white/40 px-7 py-4 text-[14px] font-semibold transition-colors hover:bg-white hover:text-ink"
            >
              Systems we made safer
            </a>
          </div>
        </div>
      </div>

      {/* slide indicator */}
      <div className="absolute bottom-8 left-6 right-6 mx-auto flex max-w-[1320px] items-center gap-3 lg:left-10 lg:right-10">
        {HERO_SLIDES.map((s, k) => (
          <button
            key={s.src}
            onClick={() => setI(k)}
            aria-label={`Show image ${k + 1}`}
            className="group relative h-6 w-16 sm:w-24 cursor-pointer"
          >
            <span className="absolute inset-x-0 top-1/2 h-px bg-white/30" />
            {k === i && (
              <span
                key={i}
                className="absolute inset-x-0 top-1/2 h-px origin-left bg-white"
                style={{ animation: 'grow 7s linear forwards' }}
              />
            )}
          </button>
        ))}
        <span className="ml-auto hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 sm:block">
          Scroll
        </span>
        <span className="relative hidden h-10 w-px overflow-hidden bg-white/25 sm:block">
          <span
            className="absolute inset-0 bg-white"
            style={{ animation: 'scrollcue 2.2s ease-in-out infinite' }}
          />
        </span>
      </div>
    </section>
  );
}

