import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogWriters } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const writerId = parseInt(id, 10);
  if (isNaN(writerId)) {
    return NextResponse.json({ error: 'Invalid writer ID' }, { status: 400 });
  }

  try {
    const [existing] = await db
      .select()
      .from(blogWriters)
      .where(eq(blogWriters.id, writerId))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Writer not found' }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const name =
      typeof body.name === 'string' && body.name.trim() ? body.name.trim() : existing.name;
    const title =
      typeof body.title === 'string' && body.title.trim() ? body.title.trim() : existing.title;
    const role =
      typeof body.role === 'string' && body.role.trim() ? body.role.trim() : existing.role;
    const email =
      body.email === null
        ? null
        : typeof body.email === 'string'
        ? body.email.trim() || null
        : existing.email;
    const bio =
      body.bio === null
        ? null
        : typeof body.bio === 'string'
        ? body.bio.trim() || null
        : existing.bio;
    const avatarColor =
      typeof body.avatarColor === 'string' && body.avatarColor.trim()
        ? body.avatarColor.trim()
        : existing.avatarColor;
    const avatarUrl =
      body.avatarUrl === null
        ? null
        : typeof body.avatarUrl === 'string'
        ? body.avatarUrl.trim() || null
        : existing.avatarUrl;

    const [updated] = await db
      .update(blogWriters)
      .set({ name, title, role, email, bio, avatarColor, avatarUrl })
      .where(eq(blogWriters.id, writerId))
      .returning();

    return NextResponse.json({ success: true, writer: updated });
  } catch (error) {
    console.error('Update writer error:', error);
    return NextResponse.json({ error: 'Failed to update writer' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const writerId = parseInt(id, 10);
  if (isNaN(writerId)) {
    return NextResponse.json({ error: 'Invalid writer ID' }, { status: 400 });
  }

  try {
    const [deleted] = await db
      .delete(blogWriters)
      .where(eq(blogWriters.id, writerId))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: 'Writer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete writer error:', error);
    return NextResponse.json({ error: 'Failed to delete writer' }, { status: 500 });
  }
}

