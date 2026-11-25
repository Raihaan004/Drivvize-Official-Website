'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BLOG_AUTHORS,
  BLOG_CATEGORIES,
  BLOG_THUMBNAIL_PRESETS,
  estimateReadTime,
  slugifyBlogTitle,
  toDateInputValue,
} from '@/lib/blogConstants';
import { ArticleContent } from '@/components/blog/ArticleContent';
import PostCard from '@/components/learn/PostCard';
import {
  MARKDOWN_TOOLS,
  applyMarkdownTool,
  compressImageToDataUrl,
  formatFileSizeLabel,
  readDocumentAsDataUrl,
} from './blogEditorHelpers';

export interface BlogEditorInitialData {
  title: string;
  slug: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  documentName?: string;
  documentSize?: string;
  documentUrl?: string;
  isPublished: boolean;
  publishedAt: string | null;
  views?: number;
}

interface BlogEditorFormProps {
  mode: 'create' | 'edit';
  blogId?: string;
  initialData?: BlogEditorInitialData;
}

const CUSTOM_CATEGORY_VALUE = '__custom__';

export function BlogEditorForm({ mode, blogId, initialData }: BlogEditorFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const initialCategory = initialData?.category || 'Functional Safety';
  const isKnownInitialCategory = (BLOG_CATEGORIES as readonly string[]).includes(initialCategory);

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');
  const [selectedCategory, setSelectedCategory] = useState(
    isKnownInitialCategory ? initialCategory : CUSTOM_CATEGORY_VALUE,
  );
  const [customCategory, setCustomCategory] = useState(
    isKnownInitialCategory ? '' : initialCategory,
  );
  const [author, setAuthor] = useState(initialData?.author || 'Drivvize Engineering');
  const [readTime, setReadTime] = useState(initialData?.readTime || '5 min read');
  const [readTimeManuallyEdited, setReadTimeManuallyEdited] = useState(mode === 'edit');
  const [publishedDate, setPublishedDate] = useState(
    toDateInputValue(initialData?.publishedAt) || new Date().toISOString().slice(0, 10),
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [documentName, setDocumentName] = useState(initialData?.documentName ?? '');
  const [documentSize, setDocumentSize] = useState(initialData?.documentSize ?? '');
  const [documentUrl, setDocumentUrl] = useState(initialData?.documentUrl ?? '');
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.isPublished : true,
  );

  const [editorTab, setEditorTab] = useState<'write' | 'preview' | 'card'>('write');
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const effectiveCategory =
    selectedCategory === CUSTOM_CATEGORY_VALUE
      ? customCategory.trim() || 'Functional Safety'
      : selectedCategory;

  const autoEstimatedReadTime = useMemo(() => estimateReadTime(content), [content]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(slugifyBlogTitle(value));
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (!readTimeManuallyEdited) {
      setReadTime(estimateReadTime(value));
    }
  };

  const handleToolbarClick = (index: number) => {
    const tool = MARKDOWN_TOOLS[index];
    const { nextValue, selectionStart, selectionEnd } = applyMarkdownTool(
      textareaRef.current,
      content,
      tool,
    );
    handleContentChange(nextValue);
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingImage(true);
    setError(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setCoverImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDocumentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingDoc(true);
    setError(null);
    try {
      const dataUrl = await readDocumentAsDataUrl(file);
      setDocumentUrl(dataUrl);
      setDocumentName(file.name);
      setDocumentSize(formatFileSizeLabel(file.size));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to attach document.');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Article Content are required.');
      return;
    }

    const finalSlug = slugifyBlogTitle(slug.trim() || title.trim());
    if (!finalSlug) {
      setError('Please enter a valid URL slug.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      category: effectiveCategory,
      author: author.trim() || 'Drivvize Engineering',
      readTime: readTime.trim() || autoEstimatedReadTime,
      coverImage: coverImage.trim() || null,
      excerpt: excerpt.trim() || title.trim().slice(0, 160),
      content: content.trim(),
      documentName: documentUrl.trim() ? documentName.trim() || 'Attachment.pdf' : null,
      documentSize: documentUrl.trim() ? documentSize.trim() || null : null,
      documentUrl: documentUrl.trim() || null,
      isPublished,
      publishedAt: isPublished && publishedDate ? `${publishedDate}T12:00:00.000Z` : null,
    };

    try {
      const endpoint =
        mode === 'edit' && blogId ? `/api/admin/blogs/${blogId}` : '/api/admin/blogs';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        blog?: { slug: string };
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save blog post.');
      }

      if (mode === 'create') {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        setSlug(data.blog?.slug || finalSlug);
        setSaveSuccess('Article updated and synced to the public blog.');
        router.refresh();
        setTimeout(() => setSaveSuccess(null), 4500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !blogId) return;
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, { method: 'DELETE' });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete blog post.');
      }
      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post.');
      setIsDeleting(false);
    }
  };

  const previewCard = {
    slug: slug || 'preview-slug',
    title: title.trim() || 'Your Article Title Preview',
    category: effectiveCategory,
    excerpt:
      excerpt.trim() ||
      'Your short excerpt will appear here on the official Drivvize blog card.',
    image: coverImage.trim() || BLOG_THUMBNAIL_PRESETS[0].url,
    author: author.trim() || 'Drivvize Engineering',
    publishedAt: publishedDate ? `${publishedDate}T12:00:00.000Z` : new Date().toISOString(),
    readTimeLabel: readTime.trim() || autoEstimatedReadTime,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <Link
            href="/admin/blogs"
            className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 transition-colors hover:text-ink"
          >
            <span>&larr; Back to all articles</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              {mode === 'create' ? 'Write New Blog Post' : 'Edit Article'}
            </h1>
            {mode === 'edit' && (
              <>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                    isPublished
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {isPublished ? 'Published' : 'Draft'}
                </span>
                {typeof initialData?.views === 'number' && (
                  <span className="text-xs font-medium text-ink/50">
                    &bull; {initialData.views} views
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === 'edit' && slug && isPublished && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink/75 shadow-xs transition-colors hover:bg-paper hover:text-ink"
            >
              <span>View Live</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          )}

          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="cursor-pointer rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-yellow-400 disabled:opacity-50"
          >
            {isSaving
              ? 'Saving...'
              : mode === 'create'
              ? isPublished
                ? 'Publish Article'
                : 'Save as Draft'
              : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-500/25 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 font-bold">
            &times;
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <span>{saveSuccess}</span>
          <Link href={`/blog/${slug}`} target="_blank" className="underline">
            Open Live Article &rarr;
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Blog Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Demystifying ASIL Decomposition in Modern EV Architectures"
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              URL Slug *
            </label>
            <div className="flex items-center rounded-xl border border-line bg-paper px-3 py-2 text-xs focus-within:border-brand focus-within:bg-white">
              <span className="font-mono text-ink/40">/blog/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setSlug(e.target.value);
                }}
                placeholder="demystifying-asil-decomposition"
                className="w-full bg-transparent pl-1 font-mono text-xs text-ink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category (Select or Custom), Author, Published Date, Reading Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Blog Category / Type
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value={CUSTOM_CATEGORY_VALUE}>+ Custom Category...</option>
            </select>
            {selectedCategory === CUSTOM_CATEGORY_VALUE && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
              />
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Author Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {BLOG_AUTHORS.map((presetAuthor) => (
                <button
                  key={presetAuthor}
                  type="button"
                  onClick={() => setAuthor(presetAuthor)}
                  className="cursor-pointer rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold text-ink/65 hover:bg-line hover:text-ink"
                >
                  {presetAuthor}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Published Date
            </label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
            <p className="mt-2 text-[11px] text-ink/45">
              Shown on every public card when published.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Reading Time
              </label>
              <button
                type="button"
                onClick={() => {
                  setReadTimeManuallyEdited(false);
                  setReadTime(autoEstimatedReadTime);
                }}
                className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-brand hover:underline"
              >
                Auto ({autoEstimatedReadTime})
              </button>
            </div>
            <input
              type="text"
              value={readTime}
              onChange={(e) => {
                setReadTimeManuallyEdited(true);
                setReadTime(e.target.value);
              }}
              placeholder="e.g. 5 min read"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Thumbnail / Cover Image & Short Excerpt */}
        <div className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Blog Thumbnail / Cover Image
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-bold text-ink transition-colors hover:bg-line">
                  {isUploadingImage ? 'Optimizing...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="sr-only"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowPresetPicker((prev) => !prev)}
                  className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-bold text-ink transition-colors hover:bg-line"
                >
                  {showPresetPicker ? 'Hide Presets' : 'Select Preset Image'}
                </button>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="cursor-pointer rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Paste image URL (https://... or /images/...) or upload / choose a preset above"
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />

            {showPresetPicker && (
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-line bg-paper p-3 sm:grid-cols-4">
                {BLOG_THUMBNAIL_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset.url);
                      setShowPresetPicker(false);
                    }}
                    className={`group cursor-pointer overflow-hidden rounded-lg border text-left transition-all ${
                      coverImage === preset.url
                        ? 'border-ink ring-2 ring-signal'
                        : 'border-line hover:border-ink/40'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-deep">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="truncate bg-white px-2 py-1.5 text-[11px] font-semibold text-ink">
                      {preset.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {coverImage && (
              <div className="mt-3 aspect-[16/7] w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
                <img src={coverImage} alt="Thumbnail preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Short Description / Excerpt
              </label>
              <span className="font-mono text-[11px] text-ink/40">{excerpt.length} chars</span>
            </div>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence overview shown on blog cards and search snippets..."
              className="w-full rounded-xl border border-line bg-paper p-3 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Optional Document / PDF Attachment */}
        <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Attached PDF / Document (Optional)
              </label>
              <p className="mt-0.5 text-[11px] text-ink/50">
                If attached, a downloadable document card will appear inside the published blog post.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-full border border-line bg-paper px-3.5 py-1.5 text-[11px] font-bold text-ink transition-colors hover:bg-line">
                {isUploadingDoc ? 'Reading...' : 'Upload PDF / Doc'}
                <input
                  type="file"
                  accept=".pdf,application/pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleDocumentFileChange}
                  className="sr-only"
                />
              </label>
              {(documentUrl || documentName) && (
                <button
                  type="button"
                  onClick={() => {
                    setDocumentUrl('');
                    setDocumentName('');
                    setDocumentSize('');
                  }}
                  className="cursor-pointer rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Document name (e.g. Drivvize_AI_Perspectives.pdf)"
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              value={documentSize}
              onChange={(e) => setDocumentSize(e.target.value)}
              placeholder="File size (e.g. 2.16 MB)"
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
            <input
              type="text"
              value={documentUrl.startsWith('data:') ? '(Uploaded PDF attached)' : documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              readOnly={documentUrl.startsWith('data:')}
              placeholder="Or paste document URL (https://...)"
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Article Body Writer + Live Preview + Card Preview */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
              Article Body Content (Markdown) *
            </label>
            <div className="flex items-center gap-1 rounded-full bg-paper p-1">
              {(['write', 'preview', 'card'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEditorTab(tab)}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    editorTab === tab
                      ? 'bg-ink text-white'
                      : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {tab === 'write' ? 'Write' : tab === 'preview' ? 'Article Preview' : 'Card Preview'}
                </button>
              ))}
            </div>
          </div>

          {editorTab === 'write' && (
            <>
              <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-paper p-2">
                {MARKDOWN_TOOLS.map((tool, idx) => (
                  <button
                    key={tool.label}
                    type="button"
                    title={tool.title}
                    onClick={() => handleToolbarClick(idx)}
                    className="cursor-pointer rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-bold text-ink transition-colors hover:bg-signal/30"
                  >
                    {tool.label}
                  </button>
                ))}
                <span className="ml-auto font-mono text-[11px] text-ink/45">
                  {content.trim() ? `${content.trim().split(/\s+/).length} words` : '0 words'}
                </span>
              </div>
              <textarea
                ref={textareaRef}
                rows={15}
                required
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write the full article content here using Markdown headings (##), bullet points (-), blockquotes (>), links, code blocks, and **bold** text..."
                className="w-full rounded-xl border border-line bg-paper p-4 font-mono text-xs leading-relaxed text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none sm:text-sm"
              />
            </>
          )}

          {editorTab === 'preview' && (
            <div className="rounded-xl border border-line bg-white p-6">
              {content.trim() ? (
                <ArticleContent content={content} />
              ) : (
                <p className="py-10 text-center text-sm text-ink/45">
                  Start writing markdown in the Write tab to preview your article.
                </p>
              )}
            </div>
          )}

          {editorTab === 'card' && (
            <div className="rounded-xl border border-line bg-paper p-6">
              <div className="mx-auto max-w-md bg-white p-5 shadow-sm">
                <PostCard post={previewCard} previewOnly />
              </div>
            </div>
          )}
        </div>

        {/* Publish Setting Toggle */}
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div>
            <p className="text-sm font-bold text-ink">Publish Status</p>
            <p className="mt-0.5 text-xs text-ink/55">
              {isPublished
                ? 'Visible immediately on /blog and /learn'
                : 'Saved as draft — only visible inside Admin'}
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full border border-line bg-paper after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-line after:bg-white after:transition-all after:content-[''] peer-checked:bg-signal peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
          </label>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/blogs"
            className="rounded-full border border-line px-5 py-2.5 text-xs font-bold text-ink hover:bg-paper"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-full bg-signal px-7 py-3 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 disabled:opacity-50"
          >
            {isSaving
              ? 'Saving...'
              : mode === 'create'
              ? isPublished
                ? 'Publish Article'
                : 'Save Draft'
              : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

