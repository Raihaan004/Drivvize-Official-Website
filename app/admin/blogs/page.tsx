'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, PenSquare, RefreshCw, Search, Trash2 } from 'lucide-react';
import { BLOG_FALLBACK_IMAGES, formatBlogDate } from '@/lib/blogConstants';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  author: string;
  readTime: string | null;
  isPublished: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogsList, setBlogsList] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data?.success) {
        setBlogsList(data.blogs || []);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.success) {
          setBlogsList(data.blogs || []);
        }
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load blogs:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePublish = async (blog: Blog) => {
    setTogglingId(blog.id);
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });
      const data = await res.json();
      if (res.ok && data?.success && data.blog) {
        setBlogsList((prev) => prev.map((b) => (b.id === blog.id ? data.blog : b)));
      } else {
        alert(data?.error || 'Failed to update publish status');
      }
    } catch {
      alert('Error communicating with server');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data?.success) {
        setBlogsList((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.error || 'Failed to delete blog post');
      }
    } catch {
      alert('Error communicating with server');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBlogs = blogsList.filter((b) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(query) ||
      b.slug.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'PUBLISHED' ? b.isPublished : !b.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['ALL', ...Array.from(new Set(blogsList.map((b) => b.category)))];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Content Publishing
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Blog Articles
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Create, edit, and publish articles directly to the public blog and Learn page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 transition-colors hover:bg-slate-50"
          >
            <span>View Public Blog</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={loadBlogs}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs transition-all hover:bg-yellow-400"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, category, or slug..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-ink placeholder-ink/40 transition-colors focus:border-brand focus:bg-white focus:outline-none sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  selectedStatus === status
                    ? 'bg-ink text-white'
                    : 'bg-slate-100 text-ink/70 hover:bg-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All Status' : status === 'PUBLISHED' ? 'Published' : 'Drafts'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-deep text-white'
                  : 'bg-slate-100 text-ink/70 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-sm text-ink/45">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span>Loading articles...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="mx-auto max-w-sm px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-ink/40">
              <Newspaper className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-ink">No articles found</h3>
            <p className="mb-5 mt-1 text-xs text-ink/60">
              {searchTerm || selectedStatus !== 'ALL' || selectedCategory !== 'ALL'
                ? 'No blog articles match your current filter criteria.'
                : 'Get started by creating your very first engineering blog post.'}
            </p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink hover:bg-yellow-400"
            >
              <span>Write First Article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Author &amp; Read</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Published</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlogs.map((b, idx) => {
                  const thumb =
                    b.coverImage || BLOG_FALLBACK_IMAGES[idx % BLOG_FALLBACK_IMAGES.length];
                  const dateLabel = formatBlogDate(b.publishedAt || b.createdAt) || '—';

                  return (
                    <tr key={b.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="max-w-md px-6 py-4">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={thumb}
                            alt={b.title}
                            className="h-14 w-20 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-bold leading-snug text-ink sm:text-[15px]">
                              {b.title}
                            </p>
                            <p className="mt-0.5 truncate font-mono text-xs text-ink/45">
                              /blog/{b.slug}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-ink/60">
                              {b.excerpt || 'No summary excerpt provided.'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-deep">
                          {b.category}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/70">
                        <p className="font-bold text-ink">{b.author}</p>
                        <p className="text-ink/50">
                          {b.readTime || '5 min read'} &bull; {b.views} views
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <button
                          type="button"
                          disabled={togglingId === b.id}
                          onClick={() => handleTogglePublish(b)}
                          title="Click to toggle Published / Draft"
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-opacity disabled:opacity-50 ${
                            b.isPublished
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              b.isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {togglingId === b.id
                            ? 'Updating...'
                            : b.isPublished
                            ? 'Published'
                            : 'Draft'}
                        </button>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/60">
                        {dateLabel}
                      </td>

                      <td className="space-x-1.5 whitespace-nowrap px-6 py-4 text-right">
                        {b.isPublished && (
                          <Link
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-deep hover:bg-slate-50"
                          >
                            View
                          </Link>
                        )}
                        <Link
                          href={`/admin/blogs/${b.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-ink hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === b.id}
                          onClick={() => handleDelete(b.id, b.title)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{deletingId === b.id ? '...' : 'Delete'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
