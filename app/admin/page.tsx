'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminStats {
  totalBlogs: number;
  totalEvents: number;
  totalRegistrations: number;
  totalInquiries: number;
  totalDownloads: number;
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

interface Download {
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
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<Download[]>([]);
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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            Operational Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-ink/60 mt-1">
            Real-time management for articles, website inquiries, and resource downloads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Write New Blog</span>
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-deep transition-all cursor-pointer"
          >
            <span>+ Post New Event</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:bg-paper transition-all"
          >
            <span>View Inquiries</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Blog Posts */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-xs font-bold uppercase tracking-wider">Blog Articles</span>
            <div className="h-9 w-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-ink tabular-nums">
              {isLoading ? '...' : stats.totalBlogs}
            </div>
            <Link
              href="/admin/blogs"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <span>Manage all blogs</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Contact Inquiries */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-xs font-bold uppercase tracking-wider">Contact Inquiries</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-ink tabular-nums">
              {isLoading ? '...' : stats.totalInquiries}
            </div>
            <Link
              href="/admin/inquiries"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline"
            >
              <span>Review client messages</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Card 3: PDF Downloads */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-xs font-bold uppercase tracking-wider">PDF Downloads</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-ink tabular-nums">
              {isLoading ? '...' : stats.totalDownloads}
            </div>
            <Link
              href="/admin/downloads"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
            >
              <span>View download leads</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Card 4: Events */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink/50">
            <span className="text-xs font-bold uppercase tracking-wider">Events</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-ink tabular-nums">
              {isLoading ? '...' : stats.totalEvents}
            </div>
            <Link
              href="/admin/events"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <span>Manage events ({stats.totalRegistrations} regs)</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Inquiries & Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries Box */}
        <div className="rounded-2xl bg-white border border-line p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
            <div>
              <h2 className="text-base font-bold text-ink">Recent Inquiries</h2>
              <p className="text-xs text-ink/55">Submissions received from the contact form</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-brand hover:underline"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-ink/40">Loading inquiries...</div>
          ) : recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink/40">
              No inquiries submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-line">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {inq.firstName} {inq.lastName}
                      </p>
                      <p className="text-xs text-ink/65">{inq.email} &bull; {inq.phone}</p>
                    </div>
                    <span className="text-[11px] text-ink/40 font-mono shrink-0">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {inq.companyName && (
                    <span className="mt-1 inline-block text-[11px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded">
                      {inq.companyName}
                    </span>
                  )}
                  <p className="mt-2 text-xs text-ink/75 line-clamp-2 bg-paper p-2.5 rounded-lg border border-line/60">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Downloads Box */}
        <div className="rounded-2xl bg-white border border-line p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
            <div>
              <h2 className="text-base font-bold text-ink">Recent PDF Downloads</h2>
              <p className="text-xs text-ink/55">Document delivery requests from /learn</p>
            </div>
            <Link
              href="/admin/downloads"
              className="text-xs font-bold text-brand hover:underline"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-ink/40">Loading download events...</div>
          ) : recentDownloads.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink/40">
              No download events logged yet.
            </div>
          ) : (
            <div className="divide-y divide-line">
              {recentDownloads.map((dl) => (
                <div key={dl.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">
                      {dl.fileTitle}
                    </p>
                    <p className="text-xs text-ink/65 truncate">{dl.email}</p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                      {dl.field}
                    </span>
                  </div>
                  <span className="text-[11px] text-ink/40 font-mono shrink-0">
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

