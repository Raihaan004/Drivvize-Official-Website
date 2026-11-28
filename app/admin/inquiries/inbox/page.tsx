'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Archive,
  CheckCircle2,
  ChevronDown,
  Flag,
  Home,
  Mail,
  PenSquare,
  Search,
  Send,
  Settings,
  Star,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

interface ContactReplyItem {
  id: number;
  inquiryId: number;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  message: string;
  sentViaEmail: boolean;
  createdAt: string;
}

interface InquiryThread {
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
  assignedTo: string;
  source: string;
  replyCount: number;
  replies: ContactReplyItem[];
  lastActivityAt: string;
  createdAt: string;
}

interface MailConfigInfo {
  smtpConfigured: boolean;
  receiverConfigured: boolean;
  activeReceiverEmail: string;
}

const AVATAR_COLORS = ['#94a3b8', '#0284c7', '#be185d', '#d97706', '#2563eb', '#1d3f6e'];

const QUICK_TEMPLATES = [
  {
    label: 'Thank You',
    text: 'Thank you for reaching out to Drivvize. Our functional safety & cybersecurity team has reviewed your inquiry and would love to discuss your requirements.',
  },
  {
    label: 'Schedule Call',
    text: 'Thanks for connecting with us. Could you share a couple of preferred time slots this week for a 30-minute engineering consultation call?',
  },
  {
    label: 'Share Brochure',
    text: 'Thank you for your interest in Drivvize capabilities across ISO 26262, ISO/SAE 21434, and SOTIF. Please let us know which domain you are focusing on so we can tailor our overview.',
  },
];

function getInitials(first: string, last: string): string {
  return `${first?.[0] ?? ''}${last && last !== '-' ? last[0] : ''}`.toUpperCase() || 'C';
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatThreadTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ContactInboxInner() {
  const searchParams = useSearchParams();
  const initialIdParam = searchParams.get('id');

  const [threads, setThreads] = useState<InquiryThread[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mailConfig, setMailConfig] = useState<MailConfigInfo>({
    smtpConfigured: false,
    receiverConfigured: false,
    activeReceiverEmail: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const [filterMode, setFilterMode] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Composer state
  const [replySubject, setReplySubject] = useState('Drivvize sent you a new message');
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // New Message Modal state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeName, setComposeName] = useState('');
  const [composeEmail, setComposeEmail] = useState('');
  const [composeCompany, setComposeCompany] = useState('');
  const [composeSubject, setComposeSubject] = useState('Drivvize sent you a new message');
  const [composeMessage, setComposeMessage] = useState('');
  const [composeSending, setComposeSending] = useState(false);
  const [composeError, setComposeError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted || !data?.success) return;
        const rows: InquiryThread[] = data.inquiries || [];
        setThreads(rows);
        if (data.mailConfig) setMailConfig(data.mailConfig);

        const requestedId = initialIdParam ? parseInt(initialIdParam, 10) : NaN;
        if (!Number.isNaN(requestedId) && rows.some((r) => r.id === requestedId)) {
          setSelectedId(requestedId);
        } else if (rows.length > 0) {
          setSelectedId((prev) => (prev && rows.some((r) => r.id === prev) ? prev : rows[0].id));
        }
      })
      .catch((err) => {
        if (mounted) console.error('Failed to load contact inbox:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [initialIdParam]);

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      if (filterMode === 'starred' && !t.isStarred) return false;
      if (filterMode !== 'all' && filterMode !== 'starred' && t.status !== filterMode) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        (t.companyName ?? '').toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q)
      );
    });
  }, [threads, filterMode, searchQuery]);

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedId) ?? filteredThreads[0] ?? null,
    [threads, selectedId, filteredThreads],
  );

  const patchThread = async (
    id: number,
    updates: Partial<Pick<InquiryThread, 'status' | 'isStarred' | 'isFlagged'>>,
  ) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Failed to update thread:', err);
    }
  };

  const handleDeleteThread = async (id: number) => {
    if (!window.confirm('Delete this conversation and all its messages?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setThreads((prev) => {
          const next = prev.filter((t) => t.id !== id);
          if (selectedId === id) {
            setSelectedId(next[0]?.id ?? null);
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Delete thread failed:', err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyBody.trim() || sendingReply) return;

    setSendingReply(true);
    setSendFeedback(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedThread.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: replySubject.trim() || 'Drivvize sent you a new message',
          message: replyBody.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setSendFeedback({
          type: 'error',
          text: data?.error || 'Could not send email.',
        });
        return;
      }

      const newReply: ContactReplyItem = data.reply;
      const nextStatus: string = data.inquiryStatus || 'replied';

      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedThread.id
            ? {
                ...t,
                status: nextStatus,
                replyCount: t.replyCount + 1,
                replies: [...t.replies, newReply],
                lastActivityAt: newReply.createdAt,
              }
            : t,
        ),
      );
      setReplyBody('');
      setSendFeedback({
        type: 'success',
        text: `Email delivered to ${selectedThread.email}`,
      });
      window.setTimeout(() => setSendFeedback(null), 4000);
    } catch {
      setSendFeedback({
        type: 'error',
        text: 'Network error while sending email.',
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (composeSending) return;
    setComposeError(null);
    setComposeSending(true);

    const parts = composeName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');

    try {
      const res = await fetch('/api/admin/inquiries/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: composeEmail.trim(),
          companyName: composeCompany.trim(),
          subject: composeSubject.trim() || 'Drivvize sent you a new message',
          message: composeMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setComposeError(data?.error || 'Failed to send email.');
        return;
      }

      const created: InquiryThread = data.inquiry;
      setThreads((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setComposeOpen(false);
      setComposeName('');
      setComposeEmail('');
      setComposeCompany('');
      setComposeSubject('Drivvize sent you a new message');
      setComposeMessage('');
      setSendFeedback({
        type: 'success',
        text: `Email sent to ${created.email}`,
      });
      window.setTimeout(() => setSendFeedback(null), 4000);
    } catch {
      setComposeError('Network error while sending email.');
    } finally {
      setComposeSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Inbox Header Bar matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 shadow-xs">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold tracking-tight text-ink">Inbox</h1>
          <Link
            href="/admin/inquiries"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-ink/70 transition-colors hover:bg-slate-100 hover:text-ink"
          >
            &larr; Contact Overview
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-deep transition-colors hover:bg-slate-50"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Settings</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-xl">
                <p className="font-bold text-ink">Email Configuration (.env.local)</p>
                <div className="mt-2.5 space-y-2 text-ink/75">
                  <div className="flex items-center justify-between">
                    <span>SMTP Status</span>
                    <span
                      className={`font-bold ${
                        mailConfig.smtpConfigured ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {mailConfig.smtpConfigured ? 'Connected' : 'Not configured'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink/45">
                      Contact Receiver Email
                    </span>
                    <span className="mt-0.5 block break-all font-mono font-semibold text-deep">
                      {mailConfig.activeReceiverEmail || 'Not set (CONTACT_RECEIVER_EMAIL)'}
                    </span>
                  </div>
                  <p className="border-t border-slate-100 pt-2 text-[11px] leading-relaxed text-ink/55">
                    Update <code className="rounded bg-slate-100 px-1">CONTACT_RECEIVER_EMAIL</code>{' '}
                    in <code className="rounded bg-slate-100 px-1">.env.local</code> anytime to
                    route form notifications to another inbox.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setComposeError(null);
              setComposeOpen(true);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-deep transition-colors hover:bg-blue-100"
          >
            <span>New Message</span>
            <PenSquare className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Inbox Workspace */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs lg:h-[calc(100vh-12.5rem)] lg:min-h-[640px] lg:flex-row">
        {/* LEFT PANE: Conversations List */}
        <aside className="flex w-full shrink-0 flex-col border-b border-slate-200/80 bg-white lg:w-[320px] lg:border-b-0 lg:border-r">
          {/* Conversation Filter & Search Header */}
          <div className="border-b border-slate-100 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  aria-label="Filter conversations"
                  className="cursor-pointer rounded-lg border border-transparent bg-transparent py-1 pr-2 text-xs font-bold text-ink hover:bg-slate-50 focus:outline-none"
                >
                  <option value="all">All conversations ({threads.length})</option>
                  <option value="new">New / Unread</option>
                  <option value="open">Open</option>
                  <option value="replied">Replied</option>
                  <option value="starred">Starred</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className="cursor-pointer rounded-lg p-1.5 text-deep hover:bg-blue-50"
                title="Search conversations"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {showSearch && (
              <div className="relative mt-2.5">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, message..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Inbox Home Row */}
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition-colors hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-ink/70">
              <Home className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ink">Inbox home</p>
              <p className="truncate text-[11px] text-ink/50">Contact overview &amp; metrics</p>
            </div>
          </Link>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-ink/45">Loading conversations...</div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink/50">
                No conversations match your filter.
              </div>
            ) : (
              filteredThreads.map((t, idx) => {
                const active = selectedThread?.id === t.id;
                const fullName = `${t.firstName} ${t.lastName !== '-' ? t.lastName : ''}`.trim();
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(t.id);
                      setSendFeedback(null);
                    }}
                    className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                      active ? 'bg-blue-50/75' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-xs"
                      style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                    >
                      {getInitials(t.firstName, t.lastName)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-bold text-ink">{fullName}</span>
                        <span className="shrink-0 text-[11px] font-medium text-ink/45">
                          {formatShortDate(t.createdAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-ink/55">
                          {t.companyName || t.source || 'Contact Form'}
                        </span>
                        <div className="flex items-center gap-1">
                          {t.status === 'new' && (
                            <span
                              className="h-2 w-2 rounded-full bg-brand"
                              title="New inquiry"
                            />
                          )}
                          {t.replyCount > 0 && (
                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              {t.replyCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT PANE: Thread Details + Email Composer */}
        <section className="flex min-w-0 flex-1 flex-col bg-[#FAFBFD]">
          {!selectedThread ? (
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink/35 shadow-xs">
                <Mail className="h-7 w-7" />
              </div>
              <p className="text-sm font-bold text-ink">Select a conversation</p>
              <p className="mt-1 max-w-sm text-xs text-ink/55">
                Pick an inquiry on the left to inspect its details and reply via email.
              </p>
            </div>
          ) : (
            <>
              {/* Active Conversation Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-400 text-xs font-extrabold text-white">
                    {getInitials(selectedThread.firstName, selectedThread.lastName)}
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-ink">
                      {selectedThread.firstName}{' '}
                      {selectedThread.lastName !== '-' ? selectedThread.lastName : ''}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink/55">
                      <span>{selectedThread.email}</span>
                      {selectedThread.phone && selectedThread.phone !== '—' && (
                        <>
                          <span>&bull;</span>
                          <span>{selectedThread.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedThread.status}
                    onChange={(e) =>
                      patchThread(selectedThread.id, { status: e.target.value })
                    }
                    aria-label="Conversation status"
                    className="mr-1 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-ink focus:border-brand focus:outline-none"
                  >
                    <option value="new">Status: New</option>
                    <option value="open">Status: Open</option>
                    <option value="replied">Status: Replied</option>
                    <option value="archived">Status: Archived</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      patchThread(selectedThread.id, { isFlagged: !selectedThread.isFlagged })
                    }
                    title={selectedThread.isFlagged ? 'Remove flag' : 'Flag conversation'}
                    className={`cursor-pointer rounded-lg p-2 transition-colors ${
                      selectedThread.isFlagged
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-ink/50 hover:bg-slate-100 hover:text-ink'
                    }`}
                  >
                    <Flag className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      patchThread(selectedThread.id, { isStarred: !selectedThread.isStarred })
                    }
                    title={selectedThread.isStarred ? 'Unstar' : 'Star conversation'}
                    className={`cursor-pointer rounded-lg p-2 transition-colors ${
                      selectedThread.isStarred
                        ? 'bg-amber-50 text-amber-500'
                        : 'text-ink/50 hover:bg-slate-100 hover:text-ink'
                    }`}
                  >
                    <Star
                      className={`h-4 w-4 ${selectedThread.isStarred ? 'fill-amber-400' : ''}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      patchThread(selectedThread.id, {
                        status: selectedThread.status === 'archived' ? 'open' : 'archived',
                      })
                    }
                    title={
                      selectedThread.status === 'archived' ? 'Restore from archive' : 'Archive'
                    }
                    className={`cursor-pointer rounded-lg p-2 transition-colors ${
                      selectedThread.status === 'archived'
                        ? 'bg-blue-50 text-deep'
                        : 'text-ink/50 hover:bg-slate-100 hover:text-ink'
                    }`}
                  >
                    <Archive className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteThread(selectedThread.id)}
                    title="Delete conversation"
                    className="cursor-pointer rounded-lg p-2 text-ink/45 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Messages Area */}
              <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
                {/* Date Divider */}
                <div className="flex items-center gap-4 text-[11px] font-medium text-ink/45">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span>{formatThreadTime(selectedThread.createdAt)}</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Initial Submission Card (matching screenshot Contact card) */}
                <div className="flex items-end gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[11px] font-extrabold text-white">
                    {getInitials(selectedThread.firstName, selectedThread.lastName)}
                  </span>

                  <div className="max-w-xl flex-1 rounded-2xl border border-slate-200/80 bg-[#EDF1F7] p-5 text-ink shadow-2xs">
                    <p className="text-sm font-bold text-ink">
                      {selectedThread.source === 'Outbound email'
                        ? 'Initial Outbound Message'
                        : 'Contact Form'}
                    </p>

                    <div className="mt-4 space-y-3 text-xs">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ink/50">
                          First Name
                        </span>
                        <span className="mt-0.5 block font-semibold text-ink">
                          {selectedThread.firstName}
                        </span>
                      </div>

                      {selectedThread.lastName && selectedThread.lastName !== '-' && (
                        <div>
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ink/50">
                            Last Name
                          </span>
                          <span className="mt-0.5 block font-semibold text-ink">
                            {selectedThread.lastName}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ink/50">
                          Email
                        </span>
                        <a
                          href={`mailto:${selectedThread.email}`}
                          className="mt-0.5 block font-semibold text-deep hover:underline"
                        >
                          {selectedThread.email}
                        </a>
                      </div>

                      {selectedThread.phone && selectedThread.phone !== '—' && (
                        <div>
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ink/50">
                            Phone
                          </span>
                          <span className="mt-0.5 block font-semibold text-ink">
                            {selectedThread.phone}
                          </span>
                        </div>
                      )}

                      {selectedThread.companyName && (
                        <div>
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ink/50">
                            Company
                          </span>
                          <span className="mt-0.5 block font-semibold text-ink">
                            {selectedThread.companyName}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-ink/50">
                          Message
                        </span>
                        <p className="mt-1 whitespace-pre-wrap text-[13px] font-medium leading-relaxed text-ink">
                          {selectedThread.message}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-ink/45">
                      <Zap className="h-3.5 w-3.5" />
                      <span>{selectedThread.source || 'Automated form'}</span>
                    </div>
                  </div>
                </div>

                {/* Sent Email Replies Thread */}
                {selectedThread.replies.map((reply) => (
                  <div key={reply.id} className="space-y-3">
                    <div className="flex items-center gap-4 text-[11px] font-medium text-ink/45">
                      <span className="h-px flex-1 bg-slate-200" />
                      <span>{formatThreadTime(reply.createdAt)}</span>
                      <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-xl rounded-2xl border border-blue-200/80 bg-white p-5 text-ink shadow-xs">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-[11px]">
                          <span className="font-bold text-deep">
                            {reply.senderName} &rarr; {reply.recipientEmail}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Sent via Email
                          </span>
                        </div>
                        <p className="mb-1.5 text-xs font-bold text-ink">
                          Subject: {reply.subject}
                        </p>
                        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink/80">
                          {reply.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Email Reply Composer matching screenshot */}
              <div className="border-t border-slate-200/80 bg-white p-4 sm:p-5">
                {sendFeedback && (
                  <div
                    className={`mb-3 flex items-center justify-between rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                      sendFeedback.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-rose-200 bg-rose-50 text-rose-700'
                    }`}
                  >
                    <span>{sendFeedback.text}</span>
                    <button
                      type="button"
                      onClick={() => setSendFeedback(null)}
                      className="ml-2 cursor-pointer font-bold"
                    >
                      &times;
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleSendReply}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-brand"
                >
                  {/* Top Bar: Message via Email | To */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-ink/55">Message via:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-deep">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-ink/55">
                        To: <strong className="font-semibold text-ink">{selectedThread.email}</strong>
                      </span>
                    </div>

                    {mailConfig.activeReceiverEmail && (
                      <span className="text-[11px] text-ink/45">
                        Reply-To: {mailConfig.activeReceiverEmail}
                      </span>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs">
                    <span className="font-semibold text-ink/50">Subject:</span>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder="Email subject line"
                      className="w-full bg-transparent font-semibold text-ink focus:outline-none"
                    />
                  </div>

                  {/* Message Body */}
                  <textarea
                    rows={3}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        e.preventDefault();
                        void handleSendReply(e);
                      }
                    }}
                    placeholder="Type your message... (Ctrl/Cmd + Enter to send email)"
                    className="w-full resize-none px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none"
                  />

                  {/* Bottom Toolbar + Send Email Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {QUICK_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.label}
                          type="button"
                          onClick={() =>
                            setReplyBody((prev) => (prev ? `${prev}\n\n${tpl.text}` : tpl.text))
                          }
                          className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-ink/70 transition-colors hover:bg-slate-100 hover:text-ink"
                        >
                          + {tpl.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={sendingReply || !replyBody.trim()}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-deep px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{sendingReply ? 'Sending Email...' : 'Send Email'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </section>
      </div>

      {/* New Message Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-ink px-6 py-4 text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-signal">
                  Outbound Email
                </p>
                <h3 className="text-lg font-extrabold">New Message</h3>
              </div>
              <button
                type="button"
                onClick={() => setComposeOpen(false)}
                className="cursor-pointer rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleComposeSubmit} className="space-y-4 p-6">
              {composeError && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {composeError}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={composeName}
                    onChange={(e) => setComposeName(e.target.value)}
                    placeholder="e.g., Rajagopalan Natarajan"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={composeCompany}
                    onChange={(e) => setComposeCompany(e.target.value)}
                    placeholder="OEM / Tier-1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  To Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={composeEmail}
                  onChange={(e) => setComposeEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Write your email message..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="cursor-pointer rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-ink/70 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={composeSending}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-ink hover:bg-yellow-400 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{composeSending ? 'Sending Email...' : 'Send Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminContactInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
            Loading Contact Inbox...
          </p>
        </div>
      }
    >
      <ContactInboxInner />
    </Suspense>
  );
}

