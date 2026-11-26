'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Eye,
  Heart,
  MessageSquare,
  MoreHorizontal,
  PenSquare,
  Plus,
  RefreshCw,
  Star,
  Users,
} from 'lucide-react';
import { BLOG_FALLBACK_IMAGES, formatBlogDate } from '@/lib/blogConstants';

interface OverviewAnalytics {
  totalPostViews: number;
  viewsLast30Days: number;
  viewsToday: number;
  uniqueVisitors30d: number;
  uniqueVisitorsToday: number;
  totalComments: number;
  totalLikes: number;
  totalRatings: number;
  averageRating: number;
  totalEngagement: number;
  dailyViewsSeries: number[];
  dailyUniqueSeries: number[];
}

interface OverviewPost {
  id: number;
  title: string;
  slug: string;
  coverImage: string | null;
  category: string;
  author: string;
  isPublished: boolean;
  views: number;
  likes: number;
  ratingCount: number;
  avgRating: number;
  commentsCount: number;
  publishedAt: string;
}

function Sparkline({ data, color = '#2563EB' }: { data: number[]; color?: string }) {
  const points = useMemo(() => {
    const arr = data.length > 1 ? data : [0, 0];
    const max = Math.max(...arr, 1);
    const width = 92;
    const height = 28;
    return arr
      .map((val, idx) => {
        const x = (idx / (arr.length - 1)) * width;
        const y = height - (val / max) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [data]);

  return (
    <svg width="92" height="28" viewBox="0 0 92 28" className="shrink-0 overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function AdminBlogOverviewPage() {
  const [analytics, setAnalytics] = useState<OverviewAnalytics | null>(null);
  const [posts, setPosts] = useState<OverviewPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | 'all'>('published');
  const [moreOpen, setMoreOpen] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);

  const loadOverview = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/blogs/overview');
      const data = await res.json();
      if (data?.success) {
        setAnalytics(data.analytics);
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load blog overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/blogs/overview')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.success) {
          setAnalytics(data.analytics);
          setPosts(data.posts || []);
        }
      })
      .catch((err) => {
        if (mounted) console.error('Failed to load blog overview:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setOpenRowMenu(null);
    }
  };

  const publishedCount = posts.filter((p) => p.isPublished).length;
  const draftCount = posts.filter((p) => !p.isPublished).length;

  const visiblePosts = posts.filter((p) => {
    if (statusFilter === 'published') return p.isPublished;
    if (statusFilter === 'draft') return !p.isPublished;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Blog Overview
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Track your blog growth
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Real-time views, unique visitors, ratings, and engagement across every post.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:bg-slate-50"
            >
              <span>More Actions</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink/60" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <Link
                  href="/admin/blogs"
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  All Blog Posts
                </Link>
                <Link
                  href="/admin/blogs/writers"
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Manage Writers
                </Link>
                <Link
                  href="/admin/blogs/comments"
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Moderate Comments
                </Link>
                <Link
                  href="/blog"
                  target="_blank"
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-deep hover:bg-slate-50"
                >
                  View Public Blog &rarr;
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={loadOverview}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Post</span>
          </Link>
        </div>
      </div>

      {/* Analytics Summary Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-ink">Analytics</h2>
            <p className="text-xs text-ink/55">
              Your key stats for the last 30 days &amp; all-time post totals
            </p>
          </div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1 text-xs font-bold text-deep hover:underline"
          >
            <span>Manage All Articles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Post Views */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div>
              <p className="text-xs font-bold text-ink/60">Post views</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
                {isLoading ? '—' : analytics?.totalPostViews ?? 0}
              </p>
              <p className="mt-1 text-[11px] font-medium text-ink/50">
                {analytics?.viewsToday ?? 0} today &bull; {analytics?.viewsLast30Days ?? 0} (30d)
              </p>
            </div>
            <Sparkline data={analytics?.dailyViewsSeries ?? []} color="#1d3f6e" />
          </div>

          {/* Card 2: Unique Visitors */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div>
              <p className="text-xs font-bold text-ink/60">Unique visitors (30d)</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
                {isLoading ? '—' : analytics?.uniqueVisitors30d ?? 0}
              </p>
              <p className="mt-1 text-[11px] font-medium text-ink/50">
                {analytics?.uniqueVisitorsToday ?? 0} today
              </p>
            </div>
            <Sparkline data={analytics?.dailyUniqueSeries ?? []} color="#4f81bd" />
          </div>

          {/* Card 3: Comments */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div>
              <p className="text-xs font-bold text-ink/60">Comments</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
                {isLoading ? '—' : analytics?.totalComments ?? 0}
              </p>
              <p className="mt-1 text-[11px] font-medium text-ink/50">
                {analytics?.totalRatings ?? 0} ratings ({analytics?.averageRating ?? 0}★ avg)
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-deep">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>

          {/* Card 4: Engagement */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div>
              <p className="text-xs font-bold text-ink/60">Engagement</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
                {isLoading ? '—' : analytics?.totalEngagement ?? 0}
              </p>
              <p className="mt-1 text-[11px] font-medium text-ink/50">
                {analytics?.totalLikes ?? 0} likes &bull; {analytics?.totalRatings ?? 0} stars
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Latest Posts (left) + Blog Management Tools (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <h2 className="text-base font-extrabold text-ink">Latest posts</h2>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'published' | 'draft' | 'all')}
              aria-label="Filter posts by publish status"
              className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-ink focus:border-brand focus:outline-none"
            >
              <option value="published">Published ({publishedCount})</option>
              <option value="draft">Drafts ({draftCount})</option>
              <option value="all">All Posts ({posts.length})</option>
            </select>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-xs text-ink/45">Loading post analytics...</div>
          ) : visiblePosts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-ink">No posts in this view</p>
              <Link
                href="/admin/blogs/new"
                className="mt-3 inline-block rounded-full bg-signal px-5 py-2 text-xs font-bold text-ink"
              >
                Create New Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-ink/50">
                    <th className="px-6 py-3">Post</th>
                    <th className="px-4 py-3">Views</th>
                    <th className="px-4 py-3">Engagement</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visiblePosts.map((post, idx) => {
                    const thumb =
                      post.coverImage ||
                      BLOG_FALLBACK_IMAGES[idx % BLOG_FALLBACK_IMAGES.length];
                    const dateStr = formatBlogDate(post.publishedAt) || '—';

                    return (
                      <tr key={post.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="max-w-md px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={thumb}
                              alt={post.title}
                              className="h-12 w-16 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/admin/blogs/${post.id}`}
                                className="line-clamp-1 font-bold text-ink hover:text-deep"
                              >
                                {post.title}
                              </Link>
                              <p className="mt-0.5 text-xs text-ink/55">
                                {dateStr} &bull; {post.author}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 font-bold tabular-nums text-ink">
                            <Eye className="h-4 w-4 text-ink/45" />
                            <span>{post.views}</span>
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/70">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5 text-rose-500" />
                              {post.likes}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5 text-deep" />
                              {post.commentsCount}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-signal text-signal" />
                              {post.ratingCount > 0 ? post.avgRating : '—'}
                            </span>
                          </div>
                        </td>

                        <td className="relative whitespace-nowrap px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenRowMenu(openRowMenu === post.id ? null : post.id)
                            }
                            aria-label="Post actions"
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-ink/70 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openRowMenu === post.id && (
                            <div className="absolute right-6 top-12 z-20 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                              <Link
                                href={`/admin/blogs/${post.id}`}
                                className="block rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                              >
                                Edit Article
                              </Link>
                              {post.isPublished && (
                                <Link
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-deep hover:bg-slate-50"
                                >
                                  View Live &rarr;
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(post.id, post.title)}
                                className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Blog Tools */}
        <div className="space-y-3 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-4">
          <h2 className="mb-4 text-base font-extrabold text-ink">Blog Management</h2>

          <Link
            href="/admin/blogs/new"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-brand/40 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal text-ink">
                <PenSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Write a New Post</p>
                <p className="text-xs text-ink/55">Word-style editor with PDF attachments</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/admin/blogs/writers"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-brand/40 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-deep">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Manage Writers</p>
                <p className="text-xs text-ink/55">Add authors, roles, and track post counts</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/admin/blogs/comments"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-brand/40 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Moderate Comments</p>
                <p className="text-xs text-ink/55">Reply to readers or hide spam comments</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/blog"
            target="_blank"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-brand/40 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Preview Public Blog</p>
                <p className="text-xs text-ink/55">See live cards, ratings, and comments</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink/40 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

