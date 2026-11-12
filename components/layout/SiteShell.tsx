'use client';

import React from 'react';
import { X, CornerDownRight } from 'lucide-react';
import { NavigationProvider, useNavigation } from './NavigationContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const RoutePreviewToast: React.FC = () => {
  const { activePath, routeNotice, dismissNotice } = useNavigation();

  if (!routeNotice || activePath === '/') return null;

  return (
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
            onClick={dismissNotice}
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
  );
};

export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#202B36] selection:bg-[#2563EB]/15 selection:text-[#0B2545]">
        {/* Skip to main content accessibility link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#0B2545] focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        {/* Sticky Corporate Navigation Bar */}
        <Navbar />

        {/* Main Page Content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Multi-Column Corporate Footer */}
        <Footer />

        {/* Route Preview Toast */}
        <RoutePreviewToast />
      </div>
    </NavigationProvider>
  );
};

