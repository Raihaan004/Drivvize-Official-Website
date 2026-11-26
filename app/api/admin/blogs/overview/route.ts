import { NextResponse } from 'next/server';
import { desc, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogComments, blogEngagements, blogViews, blogs } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const [allBlogs, engagements, commentCounts, recentViews] = await Promise.all([
      db.select().from(blogs).orderBy(desc(sql`COALESCE(${blogs.publishedAt}, ${blogs.createdAt})`)),
      db.select().from(blogEngagements),
      db
        .select({
          blogSlug: blogComments.blogSlug,
          total: sql<number>`count(*)::int`,
        })
        .from(blogComments)
        .groupBy(blogComments.blogSlug),
      db
        .select()
        .from(blogViews)
        .where(gte(blogViews.viewedAt, thirtyDaysAgo)),
    ]);

    const engagementMap = new Map(engagements.map((e) => [e.slug, e]));
    const commentMap = new Map(commentCounts.map((c) => [c.blogSlug, Number(c.total || 0)]));

    const totalPostViews = allBlogs.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalLikes = engagements.reduce((sum, e) => sum + (e.likes || 0), 0);
    const totalRatings = engagements.reduce((sum, e) => sum + (e.ratingCount || 0), 0);
    const totalRatingSum = engagements.reduce((sum, e) => sum + (e.ratingSum || 0), 0);
    const totalComments = commentCounts.reduce((sum, c) => sum + Number(c.total || 0), 0);

    const viewsLast30Days = recentViews.length;
    const viewsToday = recentViews.filter((v) => v.viewedAt >= startOfToday).length;
    const uniqueVisitors30d = new Set(recentViews.map((v) => v.visitorKey)).size;
    const uniqueVisitorsToday = new Set(
      recentViews.filter((v) => v.viewedAt >= startOfToday).map((v) => v.visitorKey),
    ).size;

    // Build 14-day daily sparkline buckets
    const dailyBuckets: number[] = Array(14).fill(0);
    const dailyUniqueBuckets: Set<string>[] = Array.from({ length: 14 }, () => new Set<string>());
    for (const v of recentViews) {
      const diffDays = Math.floor(
        (startOfToday.getTime() -
          Date.UTC(
            v.viewedAt.getUTCFullYear(),
            v.viewedAt.getUTCMonth(),
            v.viewedAt.getUTCDate(),
          )) /
          (24 * 60 * 60 * 1000),
      );
      if (diffDays >= 0 && diffDays < 14) {
        const idx = 13 - diffDays;
        dailyBuckets[idx] += 1;
        dailyUniqueBuckets[idx].add(v.visitorKey);
      }
    }

    const posts = allBlogs.map((b) => {
      const eng = engagementMap.get(b.slug);
      const commentCount = commentMap.get(b.slug) ?? 0;
      const avgRating =
        eng && eng.ratingCount > 0 ? Number((eng.ratingSum / eng.ratingCount).toFixed(1)) : 0;

      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        coverImage: b.coverImage,
        category: b.category,
        author: b.author,
        isPublished: b.isPublished,
        views: b.views,
        likes: eng?.likes ?? 0,
        ratingCount: eng?.ratingCount ?? 0,
        avgRating,
        commentsCount: commentCount,
        publishedAt: (b.publishedAt ?? b.createdAt).toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      analytics: {
        totalPostViews,
        viewsLast30Days,
        viewsToday,
        uniqueVisitors30d,
        uniqueVisitorsToday,
        totalComments,
        totalLikes,
        totalRatings,
        averageRating: totalRatings > 0 ? Number((totalRatingSum / totalRatings).toFixed(1)) : 0,
        totalEngagement: totalLikes + totalRatings + totalComments,
        dailyViewsSeries: dailyBuckets,
        dailyUniqueSeries: dailyUniqueBuckets.map((s) => s.size),
      },
      posts,
    });
  } catch (error) {
    console.error('Fetch blog overview analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load blog analytics' },
      { status: 500 },
    );
  }
}

