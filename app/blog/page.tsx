import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { BlogListClient } from '@/components/blog/BlogListClient';


export const metadata: Metadata = {
  title: 'Engineering Blog & Technical Insights | Drivvize',
  description:
    'In-depth technical articles on ISO 26262 functional safety, ISO/SAE 21434 automotive cybersecurity, SOTIF methodologies, and Software-Defined Vehicle engineering.',
};

interface BlogRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string;
  readTime: string | null;
  coverImage: string | null;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
}

export default async function BlogIndexPage() {
  let publishedBlogs: BlogRow[] = [];
  try {
    publishedBlogs = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        category: blogs.category,
        author: blogs.author,
        readTime: blogs.readTime,
        coverImage: blogs.coverImage,
        views: blogs.views,
        publishedAt: blogs.publishedAt,
        createdAt: blogs.createdAt,
      })
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.createdAt));
  } catch (error) {
    console.error('Failed to load published blogs:', error);
  }

  // Format dates for client component
  const formattedBlogs = publishedBlogs.map((b) => ({
    ...b,
    publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
    createdAt: b.createdAt.toISOString(),
  }));

  return <BlogListClient initialBlogs={formattedBlogs} />;
}
