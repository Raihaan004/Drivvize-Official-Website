import type { Metadata } from 'next';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs, blogViews } from '@/lib/db/schema';
import { IMG } from '@/components/premium-home/data';
import { mergeBlogCards } from '@/lib/blogConstants';
import {
  getApprovedBlogComments,
  getBlogEngagement,
  getPublishedBlogRows,
} from '@/lib/blogQueries';
import {
  BlogPostClient,
  type BlogArticleData,
} from '@/components/blog/BlogPostClient';

interface Props {
  params: Promise<{ slug: string }>;
}

function toOgImageList(image: string | null | undefined): string[] {
  if (!image) return [];
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return [image];
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const [blog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);

    if (blog && blog.isPublished) {
      return {
        title: `${blog.title} | Drivvize Blog`,
        description:
          blog.excerpt ||
          'Automotive functional safety and cybersecurity insights from Drivvize.',
        openGraph: {
          title: blog.title,
          description: blog.excerpt || '',
          images: toOgImageList(blog.coverImage),
        },
      };
    }
  } catch {
    // Database lookup failed
  }

  return { title: 'Article Not Found | Drivvize' };
}

export default async function BlogPostPage({ params }: Props) {
  await connection();
  const { slug } = await params;

  let article: BlogArticleData | null = null;

  try {
    const [result] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);

    if (result && result.isPublished) {
      await db
        .update(blogs)
        .set({ views: sql`${blogs.views} + 1` })
        .where(eq(blogs.id, result.id));

      article = {
        slug: result.slug,
        title: result.title,
        category: result.category || 'Functional Safety',
        excerpt: result.excerpt || '',
        image: result.coverImage || IMG.aerialRoad,
        author: result.author || 'Drivvize Engineering',
        publishedAt: (result.publishedAt ?? result.createdAt).toISOString(),
        readTimeLabel: result.readTime || '5 min read',
        documentName: result.documentName,
        documentSize: result.documentSize,
        documentUrl: result.documentUrl,
        htmlContent: result.content,
      };
    }
  } catch (error) {
    console.error('Failed to query blog by slug:', error);
  }

  if (!article) {
    notFound();
  }

  const recordView = async () => {
    try {
      const reqHeaders = await headers();
      const forwardedFor = reqHeaders.get('x-forwarded-for') ?? '';
      const realIp = reqHeaders.get('x-real-ip') ?? '';
      const ip = forwardedFor.split(',')[0]?.trim() || realIp || 'anonymous';
      const ua = reqHeaders.get('user-agent') ?? 'unknown';
      const dayKey = new Date().toISOString().slice(0, 10);
      const visitorKey = createHash('sha256')
        .update(`${dayKey}|${ip}|${ua}`)
        .digest('hex')
        .slice(0, 32);

      await db.insert(blogViews).values({
        blogSlug: article.slug,
        visitorKey,
      });
    } catch {
      // Non-blocking view telemetry
    }
  };

  const [dbRows, engagement, comments] = await Promise.all([
    getPublishedBlogRows(12),
    getBlogEngagement(article.slug),
    getApprovedBlogComments(article.slug),
    recordView(),
  ]);
  const relatedPosts = mergeBlogCards(dbRows)
    .filter((p) => p.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.category === article.category) - Number(a.category === article.category),
    )
    .slice(0, 3);

  return (
    <BlogPostClient
      post={article}
      relatedPosts={relatedPosts}
      initialEngagement={engagement}
      initialComments={comments}
    />
  );
}
