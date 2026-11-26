import { NextResponse } from 'next/server';
import { count, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  blogs,
  careerApplications,
  contactSubmissions,
  events,
  eventRegistrations,
  pdfDownloads,
} from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      [{ value: totalBlogs }],
      [{ value: totalEvents }],
      [{ value: totalRegistrations }],
      [{ value: totalInquiries }],
      [{ value: totalDownloads }],
      [{ value: totalResumes }],
      recentInquiries,
      recentDownloads,
    ] = await Promise.all([
      db.select({ value: count() }).from(blogs),
      db.select({ value: count() }).from(events),
      db.select({ value: count() }).from(eventRegistrations),
      db.select({ value: count() }).from(contactSubmissions),
      db.select({ value: count() }).from(pdfDownloads),
      db.select({ value: count() }).from(careerApplications),
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
        totalEvents: Number(totalEvents || 0),
        totalRegistrations: Number(totalRegistrations || 0),
        totalInquiries: Number(totalInquiries || 0),
        totalDownloads: Number(totalDownloads || 0),
        totalResumes: Number(totalResumes || 0),
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
