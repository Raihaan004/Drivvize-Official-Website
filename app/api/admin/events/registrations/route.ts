import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { eventRegistrations } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug')?.trim();

    const rows = slug
      ? await db
          .select()
          .from(eventRegistrations)
          .where(eq(eventRegistrations.eventSlug, slug))
          .orderBy(desc(eventRegistrations.createdAt))
      : await db
          .select()
          .from(eventRegistrations)
          .orderBy(desc(eventRegistrations.createdAt));

    return NextResponse.json({ success: true, registrations: rows });
  } catch (error) {
    console.error('Fetch event registrations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve registrations' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const regId = idParam ? parseInt(idParam, 10) : NaN;
  if (isNaN(regId)) {
    return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 });
  }

  try {
    const [deleted] = await db
      .delete(eventRegistrations)
      .where(eq(eventRegistrations.id, regId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event registration error:', error);
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 },
    );
  }
}

