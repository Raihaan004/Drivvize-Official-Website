'use client';

import React from 'react';
import Link from 'next/link';

interface PageItem {
  name: string;
  route: string;
  file: string;
  description: string;
  status: 'Live' | 'Interactive' | 'Database Connected';
  badgeColor: string;
  connectedData?: string;
  actionHref?: string;
  actionLabel?: string;
}

const PAGES: PageItem[] = [
  {
    name: 'Home Landing Page',
    route: '/',
    file: 'app/page.tsx',
    description:
      'Brand showcase, interactive OEM pillars, Who We Are, Founder profile with LinkedIn, and conversion triggers.',
    status: 'Live',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Products & Toolkits',
    route: '/products',
    file: 'app/products/page.tsx',
    description:
      'ISO 26262 Safety Kit feature comparison matrix (Basic, Custom, Consultant) with instant consultation CTA.',
    status: 'Live',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Consulting Services',
    route: '/services',
    file: 'app/services/page.tsx',
    description:
      'Full architectural and compliance consulting capabilities across ISO 26262, ISO 21434, SOTIF, and ASPICE.',
    status: 'Live',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Engineering Case Studies',
    route: '/casestudies',
    file: 'app/casestudies/page.tsx',
    description:
      'Real-world automotive deployments, ECU safety validation, and OEM cybersecurity compliance stories.',
    status: 'Live',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Learn & Whitepaper Downloads',
    route: '/learn',
    file: 'app/learn/page.tsx',
    description:
      'Technical safety whitepapers with verified email gate and automatic Neon Lakebase lead capture.',
    status: 'Database Connected',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    connectedData: 'pdf_downloads table',
    actionHref: '/admin/downloads',
    actionLabel: 'View Download Leads',
  },
  {
    name: 'Interactive Scope Checker',
    route: '/scope-checker',
    file: 'app/scope-checker/page.tsx',
    description:
      'Self-service tool helping automotive engineers assess their safety integrity levels and compliance scope.',
    status: 'Interactive',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    name: 'Contact & Consultation Intake',
    route: '/contact',
    file: 'app/contact/page.tsx',
    description:
      'Direct client communication channel saving inquiries to Neon Lakebase Postgres in real-time.',
    status: 'Database Connected',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    connectedData: 'contact_submissions table',
    actionHref: '/admin/inquiries',
    actionLabel: 'View Inquiries',
  },
  {
    name: 'Engineering Blog & Insights',
    route: '/blog',
    file: 'app/blog/page.tsx',
    description:
      'Public thought-leadership articles and technical documentation dynamically rendered from Neon Postgres.',
    status: 'Database Connected',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    connectedData: 'blogs table',
    actionHref: '/admin/blogs',
    actionLabel: 'Manage Articles',
  },
];

export default function AdminPagesOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Website Pages & Route Architecture
          </h1>
          <p className="text-sm text-ink/60 mt-0.5">
            Monitor, preview, and review public-facing routes across the Drivvize platform.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-ink/70 bg-white border border-line rounded-lg shadow-xs hover:bg-paper cursor-pointer transition-colors"
        >
          <span>Open Live Website</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PAGES.map((page) => (
          <div
            key={page.route}
            className="p-5 rounded-2xl bg-white border border-line shadow-xs flex flex-col justify-between hover:border-signal/40 transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-signal">
                  {page.route}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${page.badgeColor}`}
                >
                  {page.status}
                </span>
              </div>

              <h2 className="text-base font-extrabold text-ink group-hover:text-signal transition-colors">
                {page.name}
              </h2>
              <p className="text-xs text-ink/65 mt-1.5 leading-relaxed">
                {page.description}
              </p>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-ink/50 font-mono">
                <span>{page.file}</span>
                {page.connectedData && (
                  <span className="text-indigo-600 font-semibold">
                    &bull; {page.connectedData}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-line/60">
              <Link
                href={page.route}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/70 hover:text-ink transition-colors"
              >
                <span>Preview Page</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>

              {page.actionHref && (
                <Link
                  href={page.actionHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-signal hover:underline"
                >
                  <span>{page.actionLabel}</span>
                  <span>&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

