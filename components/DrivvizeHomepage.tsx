'use client';

import React, { useEffect, useState } from 'react';
import { X, CornerDownRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { CapabilitySection } from './CapabilitySection';
import { StatisticsSection } from './StatisticsSection';
import { SystemsShowcase } from './SystemsShowcase';
import { RecognitionSection } from './RecognitionSection';
import { FoundersSection } from './FoundersSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import { NavRouteItem } from '@/constants/tokens';

export function DrivvizeHomepage() {
  const [activePath, setActivePath] = useState<string>('/');
  const [routeNotice, setRouteNotice] = useState<NavRouteItem | null>(null);

  useEffect(() => {
    const syncPath = () => {
      setActivePath(window.location.pathname || '/');
    };
    const frame = requestAnimationFrame(syncPath);
    window.addEventListener('popstate', syncPath);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', syncPath);
    };
  }, []);

  const handleNavigate = (
    item: NavRouteItem,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // Allow standard modifier-clicks (Ctrl/Cmd/Middle click) to work natively
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    setActivePath(item.href);

    try {
      window.history.pushState({}, '', item.href);
    } catch {
      // Ignore history pushState restrictions in sandboxed iframes if any
    }

    if (item.href === '/') {
      setRouteNotice(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setRouteNotice(item);

    if (item.sectionAnchor) {
      const targetEl = document.getElementById(item.sectionAnchor);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#202B36] selection:bg-[#2563EB]/15 selection:text-[#0B2545]">
      {/* Skip to main content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0B2545] focus:text-white focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Sticky Corporate Navigation Bar */}
      <Navbar activePath={activePath} onNavigate={handleNavigate} />

      {/* Main Homepage Content */}
      <main id="main-content" className="flex-1">
        <HeroSection onNavigate={handleNavigate} />
        <CapabilitySection />
        <StatisticsSection />
        <SystemsShowcase />
        <RecognitionSection />
        <FoundersSection />
        <CTASection onNavigate={handleNavigate} />
      </main>

      {/* Multi-Column Corporate Footer */}
      <Footer activePath={activePath} onNavigate={handleNavigate} />

      {/* Subtle Route Preview Toast when testing subpage destinations from the Homepage */}
      {routeNotice && activePath !== '/' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-[380px] glass-panel-dark px-4 py-3.5 flex items-start gap-3 shadow-2xl border border-white/15"
        >
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
            <CornerDownRight className="w-4 h-4 text-[#FACC15]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FACC15]">
                {routeNotice.href}
              </span>
              <button
                type="button"
                aria-label="Dismiss route indicator"
                onClick={() => {
                  setRouteNotice(null);
                  setActivePath('/');
                  try {
                    window.history.pushState({}, '', '/');
                  } catch {
                    // ignore
                  }
                }}
                className="text-[#DCE3EA]/70 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[13px] font-semibold text-white mt-0.5">
              {routeNotice.label}
            </p>
            <p className="text-[11.5px] text-[#DCE3EA]/80 mt-0.5 leading-snug">
              Route linked and ready for multi-page expansion. Showing corresponding
              homepage section.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

