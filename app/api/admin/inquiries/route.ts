import { NextResponse } from 'next/server';
import { desc, ilike, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';


export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    let inquiries;
    if (query) {
      const pattern = `%${query}%`;
      inquiries = await db
        .select()
        .from(contactSubmissions)
        .where(
          or(
            ilike(contactSubmissions.firstName, pattern),
            ilike(contactSubmissions.lastName, pattern),
            ilike(contactSubmissions.email, pattern),
            ilike(contactSubmissions.companyName, pattern),
            ilike(contactSubmissions.message, pattern),
          ),
        )
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(100);
    } else {
      inquiries = await db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(100);
    }

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve inquiries' },
      { status: 500 },
    );
  }
}
