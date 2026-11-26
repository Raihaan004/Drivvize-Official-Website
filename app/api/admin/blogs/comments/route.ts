import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogComments } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const comments = await db
      .select()
      .from(blogComments)
      .orderBy(desc(blogComments.createdAt));

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Fetch admin comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load comments' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      id?: unknown;
      status?: unknown;
      adminReply?: unknown;
    };
    const commentId = Number(body.id);
    if (!Number.isInteger(commentId)) {
      return NextResponse.json({ error: 'Valid comment ID is required' }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const status =
      body.status === 'hidden' || body.status === 'pending' || body.status === 'approved'
        ? body.status
        : existing.status;

    const adminReply =
      body.adminReply === null
        ? null
        : typeof body.adminReply === 'string'
        ? body.adminReply.trim() || null
        : existing.adminReply;

    const [updated] = await db
      .update(blogComments)
      .set({ status, adminReply })
      .where(eq(blogComments.id, commentId))
      .returning();

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('id');
  const commentId = idParam ? parseInt(idParam, 10) : NaN;
  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }

  try {
    const [deleted] = await db
      .delete(blogComments)
      .where(eq(blogComments.id, commentId))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

