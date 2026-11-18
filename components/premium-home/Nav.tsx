'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from './data';

export default function Nav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNavClick = (
    e: React.MouseEvent,
    item: { path: string; anchor?: string }
  ) => {
    setOpen(false);
    const [targetPage, targetAnchor] = item.path.split('#');
    const anchor = item.anchor || targetAnchor;
    const isCurrentPage =
      (targetPage === '' || targetPage === '/' ? pathname === '/' : pathname === targetPage);

    if (isCurrentPage && anchor) {
      e.preventDefault();
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (targetAnchor) {
          window.history.replaceState({}, '', `${pathname}#${targetAnchor}`);
        }
      } else if (anchor === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (isCurrentPage && !anchor && targetPage === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    setOpen(false);
    if (pathname === '/') {
      const el = document.getElementById('contact');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const light = !solid && !open;
  const text = light ? 'text-white/85 hover:text-white' : 'text-ink/70 hover:text-ink';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        light ? '' : 'bg-white/95 shadow-[0_1px_0_0_rgba(10,16,24,0.06)] backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1320px] items-center justify-between px-5 sm:px-6 lg:px-10">
        <Link
          href="/"
          onClick={handleLogoClick}
          aria-label="Drivvize home"
          className="inline-flex items-center justify-center bg-white px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-[12px] border border-line shadow-xs hover:shadow-sm transition-all focus:outline-none shrink-0"
        >
          <img
            src="/drivvize-logo.png"
            alt="Drivvize — Drive. Vision. Realize."
            className="h-7 sm:h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const isBaseActive = pathname === item.path;
            const isChildActive = Boolean(
              item.children?.some((c) => {
                const [cPath] = c.path.split('#');
                return cPath && cPath !== '/' && pathname === cPath;
              })
            );
            const isActive = isBaseActive || isChildActive;

            return (
              <div key={item.label} className="group relative">
                <Link
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative flex items-center gap-1.5 py-2 text-[13.5px] xl:text-[14px] font-semibold transition-colors ${
                    isActive
                      ? light
                        ? 'text-signal font-bold'
                        : 'text-brand font-bold'
                      : text
                  }`}
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
                  <span
                    className={`absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-300 ${
                      isActive
                        ? 'scale-x-100 bg-signal'
                        : 'scale-x-0 bg-current group-hover:scale-x-100'
                    }`}
                  />
                </Link>
                {item.children && (
                  <div className="invisible absolute -left-5 top-full w-72 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-sm bg-white p-2 shadow-2xl shadow-ink/15 ring-1 ring-ink/5">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          href={c.path}
                          onClick={(e) => handleNavClick(e, c)}
                          className="block px-4 py-3 text-sm font-medium text-ink/75 transition-colors hover:bg-paper hover:text-deep"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/contact"
            onClick={handleContactClick}
            className={`rounded-full border px-5 py-2.5 text-[13px] font-bold transition-all shrink-0 ${
              light
                ? 'border-white/50 text-white hover:bg-white hover:text-ink'
                : 'border-ink text-ink hover:bg-ink hover:text-white'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {[0, 1, 2].map((k) => (
            <span
              key={k}
              className={`h-0.5 w-6 rounded-full transition-all duration-300 ${light ? 'bg-white' : 'bg-ink'} ${
                open
                  ? k === 0
                    ? 'translate-y-[8px] rotate-45'
                    : k === 1
                    ? 'opacity-0 scale-x-0'
                    : '-translate-y-[8px] -rotate-45'
                  : ''
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-line bg-white px-6 pb-12 pt-2 shadow-2xl lg:hidden">
          <div className="flex flex-col divide-y divide-line">
            {NAV.map((item) => (
              <div key={item.label} className="py-3.5">
                <Link
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center justify-between text-lg font-semibold transition-colors ${
                    pathname === item.path ? 'text-brand font-bold' : 'text-ink hover:text-brand'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
                {item.children && (
                  <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-brand/25">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.path}
                        onClick={(e) => handleNavClick(e, c)}
                        className="block py-1.5 text-sm font-medium text-ink/65 transition-colors hover:text-brand"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Direct CTA button in mobile drawer */}
          <div className="mt-6 pt-2">
            <Link
              href="/contact"
              onClick={handleContactClick}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-center text-sm font-bold text-ink shadow-sm transition-transform active:scale-[0.98]"
            >
              <span>Contact Us</span>
              <svg
                width="16"
                height="9"
                viewBox="0 0 18 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M0 5h16M12 1l4 4-4 4" />
              </svg>
            </Link>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-ink/45">
            <p>Functional Safety &amp; Cybersecurity Partner</p>
            <p className="font-semibold text-ink/60">Drive. Vision. Realize.</p>
          </div>
        </div>
      )}
    </header>
  );
}
