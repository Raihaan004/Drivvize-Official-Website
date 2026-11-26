import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogComments, blogEngagements, blogs, blogWriters } from '@/lib/db/schema';
import { slugifyBlogTitle, type DbBlogRow } from './blogConstants';
import type { PublicBlogComment } from '@/components/blog/BlogComments';

export interface PublicAuthorProfile {
  slug: string;
  name: string;
  title: string;
  role: string;
  bio: string | null;
  avatarColor: string;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  joinedAt: string | null;
  posts: DbBlogRow[];
}

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

export async function getBlogAuthorProfile(
  authorSlug: string,
): Promise<PublicAuthorProfile | null> {
  const normalizedSlug = slugifyBlogTitle(decodeURIComponent(authorSlug));
  if (!normalizedSlug) return null;

  try {
    const [writers, publishedPosts] = await Promise.all([
      db.select().from(blogWriters),
      getPublishedBlogRows(),
    ]);

    const matchedWriter = writers.find(
      (w) => slugifyBlogTitle(w.name) === normalizedSlug,
    );

    const authorPosts = publishedPosts.filter((post) => {
      if (matchedWriter) {
        return (
          post.author.trim().toLowerCase() === matchedWriter.name.trim().toLowerCase() ||
          slugifyBlogTitle(post.author) === normalizedSlug
        );
      }
      return slugifyBlogTitle(post.author) === normalizedSlug;
    });

    if (matchedWriter) {
      return {
        slug: slugifyBlogTitle(matchedWriter.name),
        name: matchedWriter.name,
        title: matchedWriter.title || 'Functional Safety Consultant',
        role: matchedWriter.role || 'Managed Writer',
        bio: matchedWriter.bio ?? null,
        avatarColor: matchedWriter.avatarColor || '#1d3f6e',
        avatarUrl: matchedWriter.avatarUrl ?? null,
        linkedinUrl: matchedWriter.linkedinUrl ?? null,
        joinedAt: matchedWriter.createdAt ? matchedWriter.createdAt.toISOString() : null,
        posts: authorPosts,
      };
    }

    if (authorPosts.length > 0) {
      const displayName = authorPosts[0].author;
      return {
        slug: normalizedSlug,
        name: displayName,
        title: 'Engineering Contributor',
        role: 'Writer',
        bio: null,
        avatarColor: '#1d3f6e',
        avatarUrl: null,
        linkedinUrl: null,
        joinedAt: authorPosts[authorPosts.length - 1]?.publishedAt ?? null,
        posts: authorPosts,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to load blog author profile:', error);
    return null;
  }
}
