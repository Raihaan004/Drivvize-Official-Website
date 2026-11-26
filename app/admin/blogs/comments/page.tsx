'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  EyeOff,
  MessageSquare,
  RefreshCw,
  Reply,
  Search,
  Trash2,
} from 'lucide-react';

interface AdminCommentRow {
  id: number;
  blogSlug: string;
  blogTitle: string;
  authorName: string;
  authorEmail: string;
  comment: string;
  status: 'approved' | 'pending' | 'hidden';
  adminReply: string | null;
  createdAt: string;
}

export default function AdminBlogCommentsPage() {
  const [comments, setComments] = useState<AdminCommentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'approved' | 'hidden'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/blogs/comments');
      const data = await res.json();
      if (data?.success) {
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/blogs/comments')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.success) {
          setComments(data.comments || []);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleStatus = async (item: AdminCommentRow) => {
    const nextStatus = item.status === 'approved' ? 'hidden' : 'approved';
    const res = await fetch('/api/admin/blogs/comments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status: nextStatus }),
    });
    const data = await res.json();
    if (res.ok && data?.success && data.comment) {
      setComments((prev) => prev.map((c) => (c.id === item.id ? data.comment : c)));
    }
  };

  const handleSaveReply = async (id: number) => {
    setSavingReply(true);
    try {
      const res = await fetch('/api/admin/blogs/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminReply: replyText }),
      });
      const data = await res.json();
      if (res.ok && data?.success && data.comment) {
        setComments((prev) => prev.map((c) => (c.id === id ? data.comment : c)));
        setReplyingId(null);
        setReplyText('');
      }
    } finally {
      setSavingReply(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this comment?')) return;
    const res = await fetch(`/api/admin/blogs/comments?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return comments.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        c.authorName.toLowerCase().includes(q) ||
        c.authorEmail.toLowerCase().includes(q) ||
        c.comment.toLowerCase().includes(q) ||
        c.blogTitle.toLowerCase().includes(q)
      );
    });
  }, [comments, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Reader Engagement
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Blog Comments
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Review reader comments, post official Drivvize replies, or hide unwanted comments.
          </p>
        </div>

        <button
          type="button"
          onClick={loadComments}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reader name, email, blog title, or comment..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['ALL', 'approved', 'hidden'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold ${
                statusFilter === status
                  ? 'bg-ink text-white'
                  : 'bg-slate-100 text-ink/70 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Comments' : status === 'approved' ? 'Visible' : 'Hidden'}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        {isLoading ? (
          <div className="py-14 text-center text-xs text-ink/45">Loading comments...</div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-sm py-14 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-ink/40">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-ink">No comments yet</h3>
            <p className="mt-1 text-xs text-ink/60">
              Reader comments submitted on any blog article will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-signal">
                        {item.authorName.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{item.authorName}</p>
                        <p className="font-mono text-[11px] text-ink/50">{item.authorEmail}</p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          item.status === 'approved'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.status === 'approved' ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="text-xs text-ink/45">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-semibold text-ink/55">
                      On article:{' '}
                      <Link
                        href={`/blog/${item.blogSlug}`}
                        target="_blank"
                        className="text-deep underline"
                      >
                        {item.blogTitle}
                      </Link>
                    </p>

                    <p className="mt-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 text-sm leading-relaxed text-ink">
                      {item.comment}
                    </p>

                    {item.adminReply && (
                      <div className="mt-2.5 rounded-2xl border border-brand/20 bg-blue-50/60 p-3.5 text-xs text-deep">
                        <span className="font-bold uppercase tracking-wider">
                          Drivvize Reply:
                        </span>{' '}
                        {item.adminReply}
                      </div>
                    )}

                    {replyingId === item.id && (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write official reply..."
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-ink focus:border-brand focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={savingReply}
                            onClick={() => handleSaveReply(item.id)}
                            className="cursor-pointer rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-deep disabled:opacity-50"
                          >
                            {savingReply ? 'Saving...' : 'Save Reply'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyingId(null)}
                            className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-ink/60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingId(item.id);
                        setReplyText(item.adminReply || '');
                      }}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:bg-slate-50"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      <span>Reply</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-ink hover:bg-slate-100"
                    >
                      {item.status === 'approved' ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Show</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

