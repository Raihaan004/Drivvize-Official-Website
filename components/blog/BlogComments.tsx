'use client';

import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { formatBlogDate } from '@/lib/blogConstants';

export interface PublicBlogComment {
  id: number;
  authorName: string;
  comment: string;
  adminReply: string | null;
  createdAt: string;
}

export function BlogComments({
  slug,
  blogTitle,
  initialComments = [],
}: {
  slug: string;
  blogTitle: string;
  initialComments?: PublicBlogComment[];
}) {
  const [comments, setComments] = useState<PublicBlogComment[]>(initialComments);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSubmittedNote(null);

    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogTitle,
          authorName,
          authorEmail,
          comment,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        comment?: PublicBlogComment;
      };

      if (!res.ok || !data.success || !data.comment) {
        setError(data.error || 'Could not post comment. Please try again.');
        return;
      }

      setComments((prev) => [data.comment!, ...prev]);
      setAuthorName('');
      setAuthorEmail('');
      setComment('');
      setSubmittedNote('Thank you! Your comment has been posted.');
    } catch {
      setError('Network error while submitting comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments" className="print:hidden mt-16 border-t border-ink/10 pt-12">
      <div className="mb-8 flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-brand" />
        <h2 className="text-2xl font-light tracking-tight text-ink">
          Comments <span className="text-ink/45">({comments.length})</span>
        </h2>
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border border-ink/10 bg-paper/70 p-6"
      >
        <p className="mb-4 text-sm font-bold text-ink">Leave a comment</p>

        {error && (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
            {error}
          </p>
        )}
        {submittedNote && (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
            {submittedNote}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="comment-name"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/65"
            >
              Name *
            </label>
            <input
              id="comment-name"
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-deep focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="comment-email"
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/65"
            >
              Email * <span className="font-normal normal-case text-ink/45">(kept private)</span>
            </label>
            <input
              id="comment-email"
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="comment-body"
            className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/65"
          >
            Comment *
          </label>
          <textarea
            id="comment-body"
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts or ask a technical question about this article..."
            className="w-full rounded-xl border border-line bg-white p-3.5 text-sm text-ink focus:border-deep focus:outline-none"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-deep disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm text-ink/50">
          No comments yet. Be the first to share your thoughts on this article.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-ink/10 bg-white p-5 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-bold text-signal">
                    {item.authorName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.authorName}</p>
                    <p className="text-xs text-ink/45">
                      {formatBlogDate(item.createdAt) ?? ''}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/80">
                {item.comment}
              </p>

              {item.adminReply && (
                <div className="mt-3.5 rounded-xl border-l-2 border-signal bg-paper px-4 py-3 text-xs leading-relaxed text-ink/80">
                  <span className="font-bold text-deep">Drivvize Team:</span> {item.adminReply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

