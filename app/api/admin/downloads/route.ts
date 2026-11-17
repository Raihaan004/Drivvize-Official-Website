import { NextResponse } from 'next/server';
import { desc, ilike, or, eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pdfDownloads } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';


export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const fieldFilter = searchParams.get('field')?.trim();

    const conditions = [];

    if (query) {
      const pattern = `%${query}%`;
      conditions.push(
        or(
          ilike(pdfDownloads.email, pattern),
          ilike(pdfDownloads.fileTitle, pattern),
          ilike(pdfDownloads.fileName, pattern),
          ilike(pdfDownloads.field, pattern),
        ),
      );
    }

    if (fieldFilter && fieldFilter !== 'all') {
      conditions.push(eq(pdfDownloads.field, fieldFilter));
    }

    const whereClause =
      conditions.length === 1
        ? conditions[0]
        : conditions.length > 1
        ? and(...conditions)
        : undefined;

    const downloads = await db
      .select()
      .from(pdfDownloads)
      .where(whereClause)
      .orderBy(desc(pdfDownloads.downloadedAt))
      .limit(200);

    return NextResponse.json({ success: true, downloads });
  } catch (error) {
    console.error('Fetch downloads error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve download records' },
      { status: 500 },
    );
  }
}
