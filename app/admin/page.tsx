'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Download,
  Mail,
  Newspaper,
  PenSquare,
  Plus,
} from 'lucide-react';

interface AdminStats {
  totalBlogs: number;
  totalEvents: number;
  totalRegistrations: number;
  totalInquiries: number;
  totalDownloads: number;
  totalResumes: number;
}

interface Inquiry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string | null;
  message: string;
  createdAt: string;
}

interface DownloadRow {
  id: number;
  email: string;
  fileName: string;
  fileTitle: string;
  field: string;
  downloadedAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalBlogs: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalInquiries: 0,
    totalDownloads: 0,
    totalResumes: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<DownloadRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setStats(data.stats);
          setRecentInquiries(data.recentInquiries || []);
          setRecentDownloads(data.recentDownloads || []);
        }
      })
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const metricCards = [
    {
      label: 'Blog Articles',
      value: stats.totalBlogs,
      href: '/admin/blogs',
      linkText: 'Manage all blogs',
      Icon: Newspaper,
      iconBg: 'bg-blue-50 text-deep ring-blue-200/60',
      linkColor: 'text-deep',
    },
    {
      label: 'Contact Inquiries',
      value: stats.totalInquiries,
      href: '/admin/inquiries',
      linkText: 'Review client messages',
      Icon: Mail,
      iconBg: 'bg-amber-50 text-amber-700 ring-amber-200/60',
      linkColor: 'text-amber-700',
    },
    {
      label: 'PDF Downloads',
      value: stats.totalDownloads,
      href: '/admin/downloads',
      linkText: 'View download leads',
      Icon: Download,
      iconBg: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
      linkColor: 'text-emerald-700',
    },
    {
      label: 'Events',
      value: stats.totalEvents,
      href: '/admin/events',
      linkText: `Manage events (${stats.totalRegistrations} regs)`,
      Icon: Calendar,
      iconBg: 'bg-indigo-50 text-indigo-700 ring-indigo-200/60',
      linkColor: 'text-indigo-700',
    },
    {
      label: 'Career Resumes',
      value: stats.totalResumes,
      href: '/admin/careers',
      linkText: 'Review candidate CVs',
      Icon: Briefcase,
      iconBg: 'bg-purple-50 text-purple-700 ring-purple-200/60',
      linkColor: 'text-purple-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Operational Overview
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Real-time management for articles, events, website inquiries, and resource downloads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs transition-all hover:bg-yellow-400"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Write New Blog</span>
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-deep"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Post New Event</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink transition-all hover:bg-slate-50"
          >
            <span>View Inquiries</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {metricCards.map(({ label, value, href, linkText, Icon, iconBg, linkColor }) => (
          <div
            key={label}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
                {label}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-extrabold tabular-nums text-ink">
                {isLoading ? '—' : value}
              </div>
              <Link
                href={href}
                className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${linkColor}`}
              >
                <span>{linkText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Inquiries & Downloads */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Inquiries Box */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-ink">Recent Inquiries</h2>
              <p className="text-xs text-ink/55">Submissions received from the contact form</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-deep transition-colors hover:bg-slate-200"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-xs text-ink/40">Loading inquiries...</div>
          ) : recentInquiries.length === 0 ? (
            <div className="py-10 text-center text-xs text-ink/40">
              No inquiries submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {inq.firstName} {inq.lastName}
                      </p>
                      <p className="text-xs text-ink/60">
                        {inq.email} &bull; {inq.phone}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-ink/45">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {inq.companyName && (
                    <span className="mt-1.5 inline-block rounded-md bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-deep">
                      {inq.companyName}
                    </span>
                  )}
                  <p className="mt-2 line-clamp-2 rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 text-xs text-ink/75">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Downloads Box */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-ink">Recent PDF Downloads</h2>
              <p className="text-xs text-ink/55">Document delivery requests from /learn</p>
            </div>
            <Link
              href="/admin/downloads"
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-deep transition-colors hover:bg-slate-200"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-xs text-ink/40">
              Loading download events...
            </div>
          ) : recentDownloads.length === 0 ? (
            <div className="py-10 text-center text-xs text-ink/40">
              No download events logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDownloads.map((dl) => (
                <div
                  key={dl.id}
                  className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-ink">{dl.fileTitle}</p>
                    <p className="truncate text-xs text-ink/60">{dl.email}</p>
                    <span className="mt-1.5 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      {dl.field}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-ink/45">
                    {new Date(dl.downloadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
