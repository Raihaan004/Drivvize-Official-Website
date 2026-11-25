'use client';

import React, { useEffect, useState } from 'react';
import { Check, Download, Heart, Link2, Printer, Star } from 'lucide-react';

interface EngagementPayload {
  success?: boolean;
  likes?: number;
  ratingSum?: number;
  ratingCount?: number;
}

function readStoredNumber(key: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

function readStoredBoolean(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function BlogStarRating({
  slug,
  initialRatingSum,
  initialRatingCount,
}: {
  slug: string;
  initialRatingSum: number;
  initialRatingCount: number;
}) {
  const storageKey = `drivvize_blog_rating_${slug}`;
  const [ratingSum, setRatingSum] = useState(initialRatingSum);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const stored = readStoredNumber(storageKey);

    fetch(`/api/blogs/${encodeURIComponent(slug)}/engage`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: EngagementPayload | null) => {
        if (!active) return;
        if (stored && stored >= 1 && stored <= 5) {
          setUserRating(stored);
        }
        if (data?.success) {
          if (typeof data.ratingSum === 'number') setRatingSum(data.ratingSum);
          if (typeof data.ratingCount === 'number') setRatingCount(data.ratingCount);
        }
      })
      .catch(() => {
        if (active && stored && stored >= 1 && stored <= 5) {
          setUserRating(stored);
        }
      });

    return () => {
      active = false;
    };
  }, [slug, storageKey]);

  const average = ratingCount > 0 ? ratingSum / ratingCount : 0;
  const displayFill = hoveredStar ?? userRating ?? Math.round(average);

  const handleRate = async (stars: number) => {
    if (submitting) return;
    setSubmitting(true);

    const prevUserRating = userRating;
    const prevSum = ratingSum;
    const prevCount = ratingCount;

    // Optimistic update
    if (prevUserRating) {
      setRatingSum(Math.max(0, prevSum - prevUserRating + stars));
    } else {
      setRatingSum(prevSum + stars);
      setRatingCount(prevCount + 1);
    }
    setUserRating(stars);

    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}/engage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rate',
          rating: stars,
          previousRating: prevUserRating ?? undefined,
        }),
      });
      const data = (await res.json()) as EngagementPayload;
      if (res.ok && data.success) {
        if (typeof data.ratingSum === 'number') setRatingSum(data.ratingSum);
        if (typeof data.ratingCount === 'number') setRatingCount(data.ratingCount);
        try {
          window.localStorage.setItem(storageKey, String(stars));
        } catch {
          // Ignore storage quota errors
        }
      } else {
        setRatingSum(prevSum);
        setRatingCount(prevCount);
        setUserRating(prevUserRating);
      }
    } catch {
      setRatingSum(prevSum);
      setRatingCount(prevCount);
      setUserRating(prevUserRating);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="print:hidden mb-8 flex flex-wrap items-center gap-3">
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Rate this article"
        onMouseLeave={() => setHoveredStar(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayFill;
          return (
            <button
              key={star}
              type="button"
              disabled={submitting}
              onMouseEnter={() => setHoveredStar(star)}
              onClick={() => handleRate(star)}
              aria-label={`Rate ${star} out of 5 stars`}
              className="cursor-pointer p-0.5 transition-transform hover:scale-110 disabled:cursor-wait"
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  filled
                    ? 'fill-signal text-signal'
                    : 'fill-slate-200 text-slate-300 hover:text-signal'
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="text-sm font-medium text-ink/55">
        {ratingCount === 0
          ? 'No ratings yet'
          : `${average.toFixed(1)} (${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'})`}
        {userRating ? ` · You rated ${userRating}★` : ''}
      </span>
    </div>
  );
}

export function BlogDocumentCard({
  documentName,
  documentSize,
  documentUrl,
}: {
  documentName?: string | null;
  documentSize?: string | null;
  documentUrl?: string | null;
}) {
  if (!documentUrl) return null;

  const title = documentName || 'Attached_Document.pdf';
  const isExternal = /^https?:\/\//i.test(documentUrl);
  const subtitle = documentSize ? `Download PDF · ${documentSize}` : 'Download attached document';

  return (
    <div className="print:hidden my-10">
      <a
        href={documentUrl}
        download={isExternal ? undefined : title}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="group flex items-center justify-between gap-4 rounded-xl border border-ink/15 bg-white px-5 py-4 transition-all hover:border-ink/35 hover:bg-paper/60 hover:shadow-sm"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#D9531E] text-white shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">PDF</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink group-hover:text-deep sm:text-[15px]">
              {title}
            </p>
            <p className="mt-0.5 text-xs text-ink/55">{subtitle}</p>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors group-hover:bg-ink group-hover:text-white"
        >
          <Download className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
}

export function BlogShareAndLikeBar({
  slug,
  title,
  initialLikes,
}: {
  slug: string;
  title: string;
  initialLikes: number;
}) {
  const storageKey = `drivvize_blog_liked_${slug}`;
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(`https://www.drivvize.com/blog/${slug}`);

  useEffect(() => {
    let active = true;
    const storedLiked = readStoredBoolean(storageKey);

    fetch(`/api/blogs/${encodeURIComponent(slug)}/engage`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: EngagementPayload | null) => {
        if (!active) return;
        setShareUrl(window.location.href);
        setLiked(storedLiked);
        if (data?.success && typeof data.likes === 'number') {
          setLikes(data.likes);
        }
      })
      .catch(() => {
        if (active) {
          setShareUrl(window.location.href);
          setLiked(storedLiked);
        }
      });

    return () => {
      active = false;
    };
  }, [slug, storageKey]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    const nextLiked = !liked;
    const prevLikes = likes;
    setLiked(nextLiked);
    setLikes(nextLiked ? prevLikes + 1 : Math.max(0, prevLikes - 1));

    try {
      const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}/engage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'like',
          action: nextLiked ? 'add' : 'remove',
        }),
      });
      const data = (await res.json()) as EngagementPayload;
      if (res.ok && data.success && typeof data.likes === 'number') {
        setLikes(data.likes);
        try {
          window.localStorage.setItem(storageKey, nextLiked ? '1' : '0');
        } catch {
          // Ignore storage errors
        }
      } else {
        setLiked(!nextLiked);
        setLikes(prevLikes);
      }
    } catch {
      setLiked(!nextLiked);
      setLikes(prevLikes);
    } finally {
      setLiking(false);
    }
  };

  const handleCopyLink = async () => {
    const targetUrl = typeof window !== 'undefined' ? window.location.href : shareUrl;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback
      const input = document.createElement('input');
      input.value = targetUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}`;

  return (
    <div className="print:hidden mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on LinkedIn`}
          title="Share on LinkedIn"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/75 transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy article link"
          title="Copy link"
          className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-xs font-bold transition-colors ${
            copied
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-ink/15 text-ink/75 hover:border-ink hover:bg-paper hover:text-ink'
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print this blog article"
          title="Print article"
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-ink/15 px-3.5 text-xs font-bold text-ink/75 transition-colors hover:border-ink hover:bg-paper hover:text-ink"
        >
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </button>
      </div>

      <button
        type="button"
        disabled={liking}
        onClick={handleLike}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike this article' : 'Like this article'}
        className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-xs font-bold transition-all disabled:cursor-wait ${
          liked
            ? 'border-rose-300 bg-rose-50 text-rose-600'
            : 'border-ink/15 bg-white text-ink/75 hover:border-rose-300 hover:text-rose-600'
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span>{liked ? 'Liked' : 'Like'}</span>
        <span className="tabular-nums text-ink/55">&middot; {likes}</span>
      </button>
    </div>
  );
}

