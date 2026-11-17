'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Functional Safety',
  'Automotive Cybersecurity',
  'SOTIF',
  'ADAS & Autonomous',
  'Software-Defined Vehicles (SDV)',
  'Industry Insights',
];

interface EditBlogClientProps {
  blogId: string;
}

export function EditBlogClient({ blogId }: EditBlogClientProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Functional Safety');
  const [author, setAuthor] = useState('Drivvize Engineering');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [views, setViews] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    let isMounted = true;
    fetch(`/api/admin/blogs/${blogId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blog post');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.blog) {
          const b = data.blog;
          setTitle(b.title || '');
          setSlug(b.slug || '');
          setCategory(b.category || 'Functional Safety');
          setAuthor(b.author || 'Drivvize Engineering');
          setReadTime(b.readTime || '5 min read');
          setCoverImage(b.coverImage || '');
          setExcerpt(b.excerpt || '');
          setContent(b.content || '');
          setIsPublished(Boolean(b.isPublished));
          setViews(b.views || 0);
        } else {
          setError(data.error || 'Blog not found');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Could not fetch blog details');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          category,
          author: author.trim(),
          readTime: readTime.trim(),
          coverImage: coverImage.trim() || null,
          excerpt: excerpt.trim() || title.slice(0, 160),
          content: content.trim(),
          isPublished,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update blog post');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while saving.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete blog post');
      }
      router.push('/admin/blogs');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting blog post';
      alert(message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        <p className="text-xs uppercase tracking-widest text-ink/50 font-bold">
          Loading Blog Article #{blogId}...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-ink mb-1 transition-colors"
          >
            <span>&larr; Back to all articles</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              Edit Article
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="text-xs text-ink/50 font-medium">
              &bull; {views} views
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slug && isPublished && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-ink/70 hover:text-ink bg-white border border-line rounded-lg shadow-xs hover:bg-paper transition-colors"
            >
              <span>View Live</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-signal hover:bg-signal/90 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <span>Article updated successfully!</span>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-500 hover:text-emerald-700 font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navigating ISO 26262 Part 6 Software Verification"
              required
              className="w-full px-4 py-3 text-base font-semibold rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors"
            />
          </div>

          {/* URL Slug & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                URL Slug *
              </label>
              <div className="flex items-center rounded-xl border border-line bg-paper/30 focus-within:border-signal focus-within:bg-white overflow-hidden transition-colors">
                <span className="pl-3.5 text-xs text-ink/40 font-mono select-none">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="iso-26262-software-verification"
                  required
                  className="w-full px-2 py-2.5 text-sm font-mono text-ink bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-medium rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Author & Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Drivvize Engineering"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/... or /images/..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors"
            />
            {coverImage && (
              <div className="mt-3 relative h-40 w-full max-w-md rounded-xl overflow-hidden border border-line bg-paper">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Short Excerpt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
              Short Excerpt / SEO Description
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary for cards and search engine snippets..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors resize-y"
            />
          </div>

          {/* Markdown Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink/70">
                Article Body (Markdown / HTML) *
              </label>
              <span className="text-xs text-ink/40">Markdown formatting supported</span>
            </div>
            <textarea
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here in markdown...&#10;&#10;## Introduction&#10;&#10;Write comprehensive automotive safety engineering insights..."
              required
              className="w-full px-4 py-3 text-sm font-mono rounded-xl border border-line bg-paper/30 text-ink focus:outline-none focus:border-signal focus:bg-white transition-colors leading-relaxed resize-y"
            />
          </div>

          {/* Publishing Status Toggle */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink">Publishing Visibility</p>
              <p className="text-xs text-ink/60">
                {isPublished
                  ? 'This post is currently live on drivvize.com/blog'
                  : 'Saved as draft. Only accessible to administrators.'}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-paper peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal border border-line" />
            </label>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/blogs"
            className="text-xs font-bold text-ink/60 hover:text-ink transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-signal hover:bg-signal/90 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

