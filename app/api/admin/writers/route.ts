import { NextResponse } from 'next/server';
import { asc, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogWriters, blogs } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [writers, postCounts] = await Promise.all([
      db.select().from(blogWriters).orderBy(asc(blogWriters.id)),
      db
        .select({
          author: blogs.author,
          total: sql<number>`count(*)::int`,
        })
        .from(blogs)
        .groupBy(blogs.author),
    ]);

    const countMap = new Map(
      postCounts.map((row) => [row.author.trim().toLowerCase(), Number(row.total || 0)]),
    );

    const enriched = writers.map((w) => ({
      ...w,
      postCount: countMap.get(w.name.trim().toLowerCase()) ?? 0,
    }));

    return NextResponse.json({ success: true, writers: enriched });
  } catch (error) {
    console.error('Fetch writers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve writers' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const title =
      typeof body.title === 'string' && body.title.trim()
        ? body.title.trim()
        : 'Functional Safety Consultant';
    const role =
      typeof body.role === 'string' && body.role.trim()
        ? body.role.trim()
        : 'Managed Writer';
    const email = typeof body.email === 'string' ? body.email.trim() || null : null;
    const bio = typeof body.bio === 'string' ? body.bio.trim() || null : null;
    const avatarColor =
      typeof body.avatarColor === 'string' && body.avatarColor.trim()
        ? body.avatarColor.trim()
        : '#1d3f6e';
    const avatarUrl =
      typeof body.avatarUrl === 'string' ? body.avatarUrl.trim() || null : null;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Writer name is required' },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(blogWriters)
      .values({
        name,
        title,
        role,
        email,
        bio,
        avatarColor,
        avatarUrl,
      })
      .returning();

    return NextResponse.json(
      { success: true, writer: { ...created, postCount: 0 } },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create writer error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create writer' },
      { status: 500 },
    );
  }
}

