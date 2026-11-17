import { NextResponse } from 'next/server';
import { count, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs, contactSubmissions, pdfDownloads } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';


export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      [{ value: totalBlogs }],
      [{ value: totalInquiries }],
      [{ value: totalDownloads }],
      recentInquiries,
      recentDownloads,
    ] = await Promise.all([
      db.select({ value: count() }).from(blogs),
      db.select({ value: count() }).from(contactSubmissions),
      db.select({ value: count() }).from(pdfDownloads),
      db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(6),
      db
        .select()
        .from(pdfDownloads)
        .orderBy(desc(pdfDownloads.downloadedAt))
        .limit(6),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalBlogs: Number(totalBlogs || 0),
        totalInquiries: Number(totalInquiries || 0),
        totalDownloads: Number(totalDownloads || 0),
      },
      recentInquiries,
      recentDownloads,
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin stats' },
      { status: 500 },
    );
  }
}
