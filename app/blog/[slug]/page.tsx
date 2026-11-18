import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { IMG } from '@/components/premium-home/data';
import { POSTS, readMinutes } from '@/components/learn/learn-data';
import {
  BlogPostClient,
  type BlogArticleData,
} from '@/components/blog/BlogPostClient';

interface Props {
  params: Promise<{ slug: string }>;
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
          images: blog.coverImage ? [blog.coverImage] : [],
        },
      };
    }
  } catch {
    // Fallback to starter posts below
  }

  const starter = POSTS.find((p) => p.slug === slug);
  if (starter) {
    return {
      title: `${starter.title} | Drivvize Blog`,
      description: starter.excerpt,
      openGraph: {
        title: starter.title,
        description: starter.excerpt,
        images: [starter.image],
      },
    };
  }

  return { title: 'Article Not Found | Drivvize' };
}

export default async function BlogPostPage({ params }: Props) {
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
        author: result.author || 'Drivvize',
        readTimeLabel: result.readTime || '4 min read',
        htmlContent: result.content,
      };
    }
  } catch (error) {
    console.error('Failed to query blog by slug:', error);
  }

  if (!article) {
    const starter = POSTS.find((p) => p.slug === slug);
    if (starter) {
      article = {
        slug: starter.slug,
        title: starter.title,
        category: starter.category,
        excerpt: starter.excerpt,
        image: starter.image,
        author: 'Drivvize',
        readTimeLabel: `${readMinutes(starter)} min read`,
        blocks: starter.blocks,
      };
    }
  }

  if (!article) {
    notFound();
  }

  return <BlogPostClient post={article} />;
}
