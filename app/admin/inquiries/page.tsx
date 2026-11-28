'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  Clock,
  Inbox,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Star,
  Trash2,
} from 'lucide-react';

interface ContactReplyItem {
  id: number;
  subject: string;
  message: string;
  recipientEmail: string;
  sentViaEmail: boolean;
  createdAt: string;
}

interface InquiryRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string | null;
  message: string;
  status: string;
  isStarred: boolean;
  isFlagged: boolean;
  source: string;
  replyCount: number;
  replies: ContactReplyItem[];
  lastActivityAt: string;
  createdAt: string;
}

interface OverviewStats {
  total: number;
  newCount: number;
  openCount: number;
  repliedCount: number;
  archivedCount: number;
  starredCount: number;
  totalRepliesSent: number;
  companiesCount: number;
}

interface MailConfigInfo {
  smtpConfigured: boolean;
  receiverConfigured: boolean;
  activeReceiverEmail: string;
}

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  open: { label: 'Open', cls: 'bg-blue-50 text-deep border-blue-200' },
  replied: { label: 'Replied', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  archived: { label: 'Archived', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const AVATAR_BG = ['#1d3f6e', '#0f766e', '#7c3aed', '#b45309', '#be123c', '#0369a1'];

function getInitials(first: string, last: string): string {
  return `${first?.[0] ?? ''}${last && last !== '-' ? last[0] : ''}`.toUpperCase() || 'C';
}

export default function AdminContactOverviewPage() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [stats, setStats] = useState<OverviewStats>({
    total: 0,
    newCount: 0,
    openCount: 0,
    repliedCount: 0,
    archivedCount: 0,
    starredCount: 0,
    totalRepliesSent: 0,
    companiesCount: 0,
  });
  const [mailConfig, setMailConfig] = useState<MailConfigInfo>({
    smtpConfigured: false,
    receiverConfigured: false,
    activeReceiverEmail: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
        if (data.stats) setStats(data.stats);
        if (data.mailConfig) setMailConfig(data.mailConfig);
      }
    } catch (err) {
      console.error('Failed to load contact overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted || !data?.success) return;
        setInquiries(data.inquiries || []);
        if (data.stats) setStats(data.stats);
        if (data.mailConfig) setMailConfig(data.mailConfig);
      })
      .catch((err) => {
        if (mounted) console.error('Failed to load contact overview:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this inquiry and its reply history permanently?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchInquiries();
      } else {
        alert(data.error || 'Failed to delete inquiry');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting inquiry');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter === 'starred' && !inq.isStarred) return false;
      if (
        statusFilter !== 'all' &&
        statusFilter !== 'starred' &&
        inq.status !== statusFilter
      ) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        `${inq.firstName} ${inq.lastName}`.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.companyName ?? '').toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q)
      );
    });
  }, [inquiries, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Inbound Leads &amp; Messaging
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Contact Overview
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Track website contact inquiries, email notifications, and team replies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchInquiries}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/inquiries/inbox"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-yellow-400"
          >
            <Inbox className="h-4 w-4" />
            <span>Open Contact Inbox</span>
          </Link>
        </div>
      </div>

      {/* Email Forwarding Config Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              mailConfig.smtpConfigured ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="font-bold text-ink">Contact Form Email Alerts:</span>
          {mailConfig.smtpConfigured && mailConfig.activeReceiverEmail ? (
            <span className="text-ink/70">
              New submissions on <code className="rounded bg-slate-100 px-1.5 py-0.5">/contact</code>{' '}
              automatically notify{' '}
              <strong className="font-semibold text-deep">
                {mailConfig.activeReceiverEmail}
              </strong>{' '}
              (set via <code className="rounded bg-slate-100 px-1.5 py-0.5">CONTACT_RECEIVER_EMAIL</code>{' '}
              in <code className="rounded bg-slate-100 px-1.5 py-0.5">.env.local</code>).
            </span>
          ) : (
            <span className="text-amber-700">
              Configure <code className="rounded bg-amber-50 px-1">SMTP_USER</code>,{' '}
              <code className="rounded bg-amber-50 px-1">SMTP_PASS</code>, and{' '}
              <code className="rounded bg-amber-50 px-1">CONTACT_RECEIVER_EMAIL</code> in{' '}
              <code className="rounded bg-amber-50 px-1">.env.local</code> to enable email sending.
            </span>
          )}
        </div>

        <Link
          href="/admin/inquiries/inbox"
          className="font-bold text-deep hover:underline"
        >
          Reply in Inbox &rarr;
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Total Inquiries
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{stats.total}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-amber-600">
              {stats.newCount} awaiting reply
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Mail className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Emails Sent (Replies)
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {stats.totalRepliesSent}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
              {stats.repliedCount} conversations replied
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Send className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Companies Reached
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {stats.companiesCount}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-ink/50">
              {stats.starredCount} starred
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-deep">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Latest Received
            </p>
            <p className="mt-1.5 truncate text-sm font-bold text-ink">
              {inquiries[0]
                ? new Date(inquiries[0].createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'None yet'}
            </p>
            <p className="mt-0.5 text-[11px] text-ink/50">
              {stats.archivedCount} archived
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by contact name, email, company, or message keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-brand focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All (${stats.total})` },
            { id: 'new', label: `New (${stats.newCount})` },
            { id: 'open', label: `Open (${stats.openCount})` },
            { id: 'replied', label: `Replied (${stats.repliedCount})` },
            { id: 'starred', label: `Starred (${stats.starredCount})` },
            { id: 'archived', label: `Archived (${stats.archivedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-ink text-white'
                  : 'bg-slate-100 text-ink/65 hover:bg-slate-200 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
            Loading Contact Overview...
          </p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-ink/40">
            <Mail className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-ink">
            {searchQuery || statusFilter !== 'all'
              ? 'No matching contact threads found'
              : 'No inquiries received yet'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-ink/60">
            Submissions from the /contact form appear here and can be replied to directly via email in the Contact Inbox.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                <tr>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-4 py-4">Company</th>
                  <th className="px-4 py-4">Message</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Replies</th>
                  <th className="px-4 py-4">Received</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq, idx) => {
                  const badge = STATUS_BADGES[inq.status] || STATUS_BADGES.new;
                  return (
                    <tr key={inq.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                            style={{ backgroundColor: AVATAR_BG[idx % AVATAR_BG.length] }}
                          >
                            {getInitials(inq.firstName, inq.lastName)}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-ink">
                              <span>
                                {inq.firstName} {inq.lastName !== '-' ? inq.lastName : ''}
                              </span>
                              {inq.isStarred && (
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              )}
                            </div>
                            <div className="font-mono text-xs text-ink/60">{inq.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {inq.companyName ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-deep">
                            {inq.companyName}
                          </span>
                        ) : (
                          <span className="text-xs italic text-ink/40">Individual</span>
                        )}
                      </td>

                      <td className="max-w-xs px-4 py-4">
                        <p className="line-clamp-2 text-xs text-ink/70">{inq.message}</p>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}
                        >
                          {inq.status === 'replied' && <CheckCircle2 className="h-3 w-3" />}
                          {badge.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold tabular-nums text-ink/65">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-ink/40" />
                          {inq.replyCount}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/55">
                        {new Date(inq.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/inquiries/inbox?id=${inq.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-deep transition-colors hover:bg-blue-100"
                          >
                            <Inbox className="h-3.5 w-3.5" />
                            <span>Open in Inbox</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(inq.id)}
                            disabled={deletingId === inq.id}
                            className="cursor-pointer rounded-xl bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
