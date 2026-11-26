'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

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
      'Full architectural and compliance consulting capabilities across ISO 26262, ISO 21434, SOTIF, and interactive Trainings.',
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
      'Technical safety whitepapers with verified email gate, YouTube trainings, Knowledge Mine feed, and latest blogs.',
    status: 'Database Connected',
    badgeColor: 'bg-blue-50 text-deep border-blue-200',
    connectedData: 'pdf_downloads & blogs',
    actionHref: '/admin/downloads',
    actionLabel: 'View Download Leads',
  },
  {
    name: 'Events & Trainings',
    route: '/events',
    file: 'app/events/page.tsx',
    description:
      'Upcoming workshops, trainings, and conference appearances with live countdowns and Google Form / DB registration.',
    status: 'Database Connected',
    badgeColor: 'bg-blue-50 text-deep border-blue-200',
    connectedData: 'events table',
    actionHref: '/admin/events',
    actionLabel: 'Manage Events',
  },
  {
    name: 'Interactive Scope Checker',
    route: '/scope-checker',
    file: 'app/scope-checker/page.tsx',
    description:
      'Self-service tool helping automotive engineers assess their safety integrity levels and EU CRA compliance scope.',
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
    badgeColor: 'bg-blue-50 text-deep border-blue-200',
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
    badgeColor: 'bg-blue-50 text-deep border-blue-200',
    connectedData: 'blogs table',
    actionHref: '/admin/blogs',
    actionLabel: 'Manage Articles',
  },
  {
    name: 'Careers & Openings',
    route: '/careers',
    file: 'app/careers/page.tsx',
    description:
      'Engineering career opportunities, culture overview, and functional safety / cybersecurity hiring tracks.',
    status: 'Live',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'Frequently Asked Questions',
    route: '/faqs',
    file: 'app/faqs/page.tsx',
    description:
      'Structured FAQ knowledge base covering ISO 26262, ISO 21434, engagement models, and safety kits.',
    status: 'Live',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export default function AdminPagesOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Site Map
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Website Pages &amp; Route Architecture
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Monitor, preview, and review public-facing routes across the Drivvize platform.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-deep"
        >
          <span>Open Live Website</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PAGES.map((page) => (
          <div
            key={page.route}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-deep">
                  {page.route}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${page.badgeColor}`}
                >
                  {page.status}
                </span>
              </div>

              <h2 className="text-base font-extrabold text-ink transition-colors group-hover:text-deep">
                {page.name}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{page.description}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs text-ink/50">
                <span>{page.file}</span>
                {page.connectedData && (
                  <span className="font-semibold text-indigo-600">
                    &bull; {page.connectedData}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
              <Link
                href={page.route}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/70 transition-colors hover:text-ink"
              >
                <span>Preview Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              {page.actionHref && (
                <Link
                  href={page.actionHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-deep hover:underline"
                >
                  <span>{page.actionLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
