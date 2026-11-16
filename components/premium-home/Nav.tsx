'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV, goTo } from './data';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const go = (e: React.MouseEvent, anchor: string) => {
    e.preventDefault();
    setOpen(false);
    goTo(anchor);
  };
  const light = !solid && !open;
  const text = light ? 'text-white/85 hover:text-white' : 'text-ink/70 hover:text-ink';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        light ? '' : 'bg-white/90 shadow-[0_1px_0_0_rgba(10,16,24,0.06)] backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          onClick={(e) => go(e, 'top')}
          aria-label="Drivvize home"
          className="inline-flex items-center justify-center bg-white px-3.5 py-1.5 rounded-[12px] border border-line shadow-xs hover:shadow-sm transition-all focus:outline-none"
        >
          <img
            src="/drivvize-logo.png"
            alt="Drivvize — Drive. Vision. Realize."
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={item.path}
                onClick={(e) => go(e, item.anchor)}
                className={`relative flex items-center gap-1.5 py-2 text-[14px] font-semibold transition-colors ${text}`}
              >
                {item.label}
                {item.children && (
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 10 10"
                    className="transition-transform group-hover:rotate-180"
                  >
                    <path
                      d="M1 3l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
              </a>
              {item.children && (
                <div className="invisible absolute -left-5 top-full w-72 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-sm bg-white p-2 shadow-2xl shadow-ink/15 ring-1 ring-ink/5">
                    {item.children.map((c) => (
                      <a
                        key={c.label}
                        href={c.path}
                        onClick={(e) => go(e, c.anchor)}
                        className="block px-4 py-3 text-sm font-medium text-ink/75 transition-colors hover:bg-paper hover:text-deep"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <a
            href="#contact"
            onClick={(e) => go(e, 'contact')}
            className={`rounded-full border px-5 py-2.5 text-[13px] font-bold transition-colors ${
              light
                ? 'border-white/50 text-white hover:bg-white hover:text-ink'
                : 'border-ink text-ink hover:bg-ink hover:text-white'
            }`}
          >
            Contact
          </a>
        </nav>

        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {[0, 1, 2].map((k) => (
            <span
              key={k}
              className={`h-px w-6 transition-all ${light ? 'bg-white' : 'bg-ink'} ${
                open
                  ? k === 0
                    ? 'translate-y-[7px] rotate-45'
                    : k === 1
                    ? 'opacity-0'
                    : '-translate-y-[7px] -rotate-45'
                  : ''
              }`}
            />
          ))}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-line bg-white px-6 pb-8 pt-2 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-line py-3">
              <a
                href={item.path}
                onClick={(e) => go(e, item.anchor)}
                className="block py-1 text-xl font-medium"
              >
                {item.label}
              </a>
              {item.children?.map((c) => (
                <a
                  key={c.label}
                  href={c.path}
                  onClick={(e) => go(e, c.anchor)}
                  className="block py-1.5 pl-4 text-sm text-ink/60"
                >
                  {c.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
