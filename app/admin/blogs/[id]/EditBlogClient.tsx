'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BlogEditorForm,
  type BlogEditorInitialData,
} from '@/components/admin/BlogEditorForm';

interface EditBlogClientProps {
  blogId: string;
}

export function EditBlogClient({ blogId }: EditBlogClientProps) {
  const [initialData, setInitialData] = useState<BlogEditorInitialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setInitialData({
            title: b.title || '',
            slug: b.slug || '',
            category: b.category || 'Functional Safety',
            author: b.author || 'Drivvize Engineering',
            readTime: b.readTime || '5 min read',
            coverImage: b.coverImage || '',
            excerpt: b.excerpt || '',
            content: b.content || '',
            documentName: b.documentName || '',
            documentSize: b.documentSize || '',
            documentUrl: b.documentUrl || '',
            isPublished: Boolean(b.isPublished),
            publishedAt: b.publishedAt || b.createdAt || null,
            views: typeof b.views === 'number' ? b.views : 0,
          });
        } else {
          setError(data.error || 'Blog not found');
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not fetch blog details');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
          Loading Blog Article #{blogId}...
        </p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-bold text-rose-800">{error || 'Blog post not found'}</p>
        <Link
          href="/admin/blogs"
          className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-xs font-bold text-white"
        >
          Back to all articles
        </Link>
      </div>
    );
  }

  return <BlogEditorForm mode="edit" blogId={blogId} initialData={initialData} />;
}
