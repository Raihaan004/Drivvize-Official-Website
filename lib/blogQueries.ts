import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogComments, blogEngagements, blogs } from '@/lib/db/schema';
import type { DbBlogRow } from './blogConstants';
import type { PublicBlogComment } from '@/components/blog/BlogComments';

export interface BlogEngagementStats {
  likes: number;
  ratingSum: number;
  ratingCount: number;
}

export async function getPublishedBlogRows(limit?: number): Promise<DbBlogRow[]> {
  try {
    const query = db
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
      .orderBy(desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`), desc(blogs.createdAt));

    const rows = typeof limit === 'number' ? await query.limit(limit) : await query;

    return rows.map((row) => ({
      ...row,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to load published blogs:', error);
    return [];
  }
}

export async function getBlogEngagement(slug: string): Promise<BlogEngagementStats> {
  try {
    const [row] = await db
      .select()
      .from(blogEngagements)
      .where(eq(blogEngagements.slug, slug))
      .limit(1);

    return {
      likes: row?.likes ?? 0,
      ratingSum: row?.ratingSum ?? 0,
      ratingCount: row?.ratingCount ?? 0,
    };
  } catch (error) {
    console.error('Failed to load blog engagement:', error);
    return { likes: 0, ratingSum: 0, ratingCount: 0 };
  }
}

export async function getApprovedBlogComments(slug: string): Promise<PublicBlogComment[]> {
  try {
    const rows = await db
      .select({
        id: blogComments.id,
        authorName: blogComments.authorName,
        comment: blogComments.comment,
        adminReply: blogComments.adminReply,
        createdAt: blogComments.createdAt,
      })
      .from(blogComments)
      .where(and(eq(blogComments.blogSlug, slug), eq(blogComments.status, 'approved')))
      .orderBy(desc(blogComments.createdAt));

    return rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to load approved blog comments:', error);
    return [];
  }
}
