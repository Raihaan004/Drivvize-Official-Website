'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FOUNDERS, IMG, NAV } from './data';
import { Photo } from './hooks';

export default function Footer() {
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent, item: { path: string; anchor?: string }) => {
    if (item.anchor && pathname === '/') {
      const el = document.getElementById(item.anchor);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-ink text-white">
      <Photo src={IMG.road} alt="" className="!absolute inset-0 -z-20 !bg-ink" speed={0.05} />
      <div className="absolute inset-0 -z-10 bg-ink/75" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 pb-8 sm:pb-10 pt-16 sm:pt-28 lg:px-10 lg:pt-44">
        <p className="eyebrow mb-4 sm:mb-8 text-signal">Let&rsquo;s talk</p>
        <h2 className="title max-w-4xl text-[clamp(2.1rem,6.2vw,6.4rem)] leading-[1.08] sm:leading-[1.04]">
          Build what is <b>safe</b> to drive.
        </h2>
        <Link
          href="/contact"
          className="group mt-8 sm:mt-12 inline-flex items-center justify-center gap-3 sm:gap-4 rounded-full bg-signal px-6 py-4 sm:px-8 sm:py-5 text-[14px] sm:text-[15px] font-bold text-ink transition-transform hover:-translate-y-1 w-full sm:w-auto text-center"
        >
          <span>Start a conversation</span>
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
        </Link>

        <div className="mt-14 sm:mt-20 lg:mt-28 grid gap-10 lg:gap-12 border-t border-white/15 pt-10 sm:pt-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white px-3.5 py-1.5 rounded-[12px] border border-line shadow-xs"
            >
              <img
                src="/drivvize-logo.png"
                alt="Drivvize — Drive. Vision. Realize."
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Functional safety and cybersecurity partner for Automotive OEMs and Suppliers.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4 lg:col-span-8"
            aria-label="Footer"
          >
            <div>
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Explore</p>
              <ul className="space-y-3 text-white/80">
                {[
                  ...NAV.filter((n) => !n.children),
                  { label: 'Blog', path: '/blog' },
                  { label: 'Learn', path: '/learn' },
                  { label: 'FAQs', path: '/faqs' },
                  { label: 'Careers', path: '/careers' },
                ].map((n) => (
                  <li key={n.label}>
                    <Link
                      href={n.path}
                      onClick={(e) => handleLinkClick(e, n)}
                      className="transition-colors hover:text-signal"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Services</p>
              <ul className="space-y-3 text-white/80">
                {NAV.find((n) => n.children)!.children!.map((c) => (
                  <li key={c.label}>
                    <Link
                      href={c.path}
                      className="transition-colors hover:text-signal"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Find us</p>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a
                    href="tel:+919150019689"
                    className="transition-colors hover:text-signal"
                  >
                    +91 91500 19689
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:consult@drivvize.com"
                    className="transition-colors hover:text-signal"
                  >
                    consult@drivvize.com
                  </a>
                </li>
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
            <div>
              <p className="eyebrow mb-4 !text-[11px] text-white/40">Follow us</p>
              <ul className="space-y-3 text-white/80">
                {FOUNDERS.map((founder) => (
                  <li key={founder.name}>
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow ${founder.name} on LinkedIn`}
                      className="group inline-flex items-center gap-2.5 transition-colors hover:text-signal"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 fill-current text-white/55 transition-colors group-hover:text-signal"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                      <span>{founder.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/40">
          <span>&copy; 2026 Drivvize</span>
          <span>Drive. Vision. Realize.</span>
        </div>
      </div>
    </footer>
  );
}
