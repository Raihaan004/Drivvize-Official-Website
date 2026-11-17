'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogsList, setBlogsList] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
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

  // Filtered blogs
  const filteredBlogs = blogsList.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', ...Array.from(new Set(blogsList.map((b) => b.category)))];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            Content Publishing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
            Blog Articles
          </h1>
          <p className="text-xs sm:text-sm text-ink/60 mt-1">
            Create, edit, and publish technical insights and thought leadership articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBlogs}
            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-4 py-2.5 text-xs font-bold text-ink/70 shadow-xs hover:bg-paper cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 transition-all cursor-pointer w-fit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-line shadow-xs">
        <div className="relative flex-1 max-w-md">
          <svg
            className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, or slug..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-line bg-paper text-ink placeholder-ink/40 focus:outline-none focus:border-brand"
          />
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-ink text-white'
                  : 'bg-paper text-ink/70 hover:bg-line'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-line bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-ink/40 flex flex-col items-center justify-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span>Loading articles...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 px-4 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-paper border border-line flex items-center justify-center mx-auto mb-3 text-ink/40">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-ink">No articles found</h3>
            <p className="text-xs text-ink/60 mt-1 mb-5">
              {searchTerm
                ? 'No blog articles match your current search criteria.'
                : 'Get started by creating your very first engineering blog post.'}
            </p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2 text-xs font-bold text-ink hover:bg-yellow-400"
            >
              <span>Write First Article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-line bg-paper/60 text-ink/60 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">Article Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Created Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-4 px-6 max-w-md">
                      <p className="font-bold text-ink text-sm sm:text-base leading-snug line-clamp-1">
                        {b.title}
                      </p>
                      <p className="text-xs text-ink/40 font-mono mt-0.5 truncate">
                        /blog/{b.slug}
                      </p>
                      <p className="text-xs text-ink/60 mt-1 line-clamp-1">
                        {b.excerpt || 'No summary excerpt provided.'}
                      </p>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-block rounded-md bg-brand/10 text-brand px-2.5 py-1 text-xs font-bold">
                        {b.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {b.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-ink/60 text-xs">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-right space-x-2">
                      <Link
                        href={`/admin/blogs/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:text-brand bg-paper px-3 py-1.5 rounded-lg border border-line"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === b.id}
                        onClick={() => handleDelete(b.id, b.title)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === b.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
