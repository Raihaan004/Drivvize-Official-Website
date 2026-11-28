import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contactReplies, contactSubmissions } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

const ALLOWED_STATUSES = new Set(['new', 'open', 'replied', 'archived']);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const inquiryId = parseInt(id, 10);
    if (isNaN(inquiryId)) {
      return NextResponse.json({ error: 'Invalid inquiry ID' }, { status: 400 });
    }

    const body = (await req.json()) as {
      status?: unknown;
      isStarred?: unknown;
      isFlagged?: unknown;
      assignedTo?: unknown;
    };

    const updates: {
      status?: string;
      isStarred?: boolean;
      isFlagged?: boolean;
      assignedTo?: string;
    } = {};

    if (typeof body.status === 'string') {
      const normalized = body.status.trim().toLowerCase();
      if (!ALLOWED_STATUSES.has(normalized)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = normalized;
    }

    if (typeof body.isStarred === 'boolean') {
      updates.isStarred = body.isStarred;
    }

    if (typeof body.isFlagged === 'boolean') {
      updates.isFlagged = body.isFlagged;
    }

    if (typeof body.assignedTo === 'string' && body.assignedTo.trim()) {
      updates.assignedTo = body.assignedTo.trim().slice(0, 120);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const [updated] = await db
      .update(contactSubmissions)
      .set(updates)
      .where(eq(contactSubmissions.id, inquiryId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Update inquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const inquiryId = parseInt(id, 10);

    if (isNaN(inquiryId)) {
      return NextResponse.json({ error: 'Invalid inquiry ID' }, { status: 400 });
    }

    await db.delete(contactReplies).where(eq(contactReplies.inquiryId, inquiryId));

    const [deleted] = await db
      .delete(contactSubmissions)
      .where(eq(contactSubmissions.id, inquiryId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry' },
      { status: 500 },
    );
  }
}
