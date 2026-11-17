'use client';

import React, { useState } from 'react';
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

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Functional Safety');
  const [author, setAuthor] = useState('Drivvize Engineering');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when title changes unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create blog post');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while saving.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-line">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-ink mb-1"
          >
            <span>&larr; Back to all articles</span>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Write New Blog Post
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? 'Saving...' : isPublished ? 'Publish Article' : 'Save as Draft'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-50 p-4 text-xs font-medium text-rose-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Demystifying ASIL Decomposition in Modern EV Architectures"
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink font-semibold placeholder-ink/40 focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              URL Slug *
            </label>
            <div className="flex items-center rounded-xl border border-line bg-paper px-3 py-2 text-xs">
              <span className="text-ink/40 font-mono">/blog/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="demystifying-asil-decomposition"
                className="w-full bg-transparent font-mono text-ink text-xs focus:outline-none pl-1"
              />
            </div>
          </div>
        </div>

        {/* Metadata Controls: Category, Author, Read Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-line shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs text-ink font-semibold focus:border-brand focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-line shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs text-ink font-semibold focus:border-brand focus:outline-none"
            />
          </div>

          <div className="rounded-2xl bg-white p-5 border border-line shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Read Time
            </label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g. 5 min read"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs text-ink font-semibold focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Image & Excerpt */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:outline-none"
            />
            {coverImage && (
              <div className="mt-3 aspect-[16/7] w-full max-w-sm rounded-xl overflow-hidden border border-line bg-paper">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
              Short Excerpt / Meta Description
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence overview of the article for cards and search engines..."
              className="w-full rounded-xl border border-line bg-paper p-3 text-xs text-ink placeholder-ink/40 focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Full Article Content */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
              Article Body Content (Markdown Supported) *
            </label>
            <span className="text-[11px] text-ink/40 font-mono">
              {content.length} characters
            </span>
          </div>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the full article content here. You can use markdown headers (#, ##), bullet points (-), code blocks, and bold text (**bold**)..."
            className="w-full rounded-xl border border-line bg-paper p-4 font-mono text-xs sm:text-sm text-ink placeholder-ink/40 focus:border-brand focus:outline-none leading-relaxed"
          />
        </div>

        {/* Publish Setting Toggle */}
        <div className="rounded-2xl bg-white p-6 border border-line shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ink">Publish Status</p>
            <p className="text-xs text-ink/55 mt-0.5">
              {isPublished
                ? 'Visible immediately to public visitors on /blog'
                : 'Saved as draft, only visible inside the Admin portal'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-paper peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-signal border border-line" />
          </label>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/blogs"
            className="px-5 py-2.5 rounded-full border border-line text-xs font-bold text-ink hover:bg-paper"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving...' : isPublished ? 'Publish Article' : 'Save Draft'}
          </button>
        </div>
      </form>
    </div>
  );
}
