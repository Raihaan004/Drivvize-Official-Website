'use client';

import React from 'react';
import { IMG, NAV, goTo } from './data';
import { Photo } from './hooks';

export default function Footer() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-ink text-white">
      <Photo src={IMG.road} alt="" className="!absolute inset-0 -z-20 !bg-ink" speed={0.05} />
      <div className="absolute inset-0 -z-10 bg-ink/75" />
      <div className="mx-auto max-w-[1320px] px-6 pb-10 pt-32 lg:px-10 lg:pt-44">
        <p className="eyebrow mb-8 text-signal">Let&rsquo;s talk</p>
        <h2 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.4rem)]">
          Build what is <b>safe</b> to drive.
        </h2>
        <a
          href="mailto:info@drivvize.com"
          className="group mt-12 inline-flex items-center gap-4 rounded-full bg-signal px-8 py-5 text-[15px] font-bold text-ink transition-transform hover:-translate-y-1"
        >
          Start a conversation
          <svg
            width="20"
            height="11"
            viewBox="0 0 18 10"
            className="transition-transform group-hover:translate-x-2"
          >
            <path
              d="M0 5h16M12 1l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </a>

        <div className="mt-28 grid gap-12 border-t border-white/15 pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src="/drivvize-logo.png"
              alt="Drivvize — Drive. Vision. Realize."
              className="h-14 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              Functional safety and cybersecurity partner for Automotive OEMs and Suppliers.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-8 text-sm md:col-span-7 md:grid-cols-3"
            aria-label="Footer"
          >
            <div>
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Explore</p>
              <ul className="space-y-3 text-white/80">
                {NAV.filter((n) => !n.children).map((n) => (
                  <li key={n.label}>
                    <a
                      href={n.path}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(n.anchor);
                      }}
                      className="transition-colors hover:text-signal"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Services</p>
              <ul className="space-y-3 text-white/80">
                {NAV.find((n) => n.children)!.children!.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.path}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(c.anchor);
                      }}
                      className="transition-colors hover:text-signal"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Find us</p>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a
                    href="https://www.drivvize.com"
                    className="transition-colors hover:text-signal"
                  >
                    www.drivvize.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.functionalsafetyfirst.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-signal"
                  >
                    functionalsafetyfirst.com
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
          <span>&copy; 2026 Drivvize</span>
          <span>Drive. Vision. Realize.</span>
        </div>
      </div>
    </footer>
  );
}
