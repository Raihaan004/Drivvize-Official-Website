import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { careerApplications } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

const ALLOWED_STATUSES = new Set(['new', 'reviewed', 'shortlisted', 'contacted', 'archived']);

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
    const applicationId = parseInt(id, 10);
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    const body = (await req.json()) as { status?: unknown; notes?: unknown };
    const updates: { status?: string; notes?: string | null } = {};

    if (typeof body.status === 'string') {
      const normalized = body.status.trim().toLowerCase();
      if (!ALLOWED_STATUSES.has(normalized)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      updates.status = normalized;
    }

    if (typeof body.notes === 'string') {
      updates.notes = body.notes.trim() || null;
    } else if (body.notes === null) {
      updates.notes = null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const [updated] = await db
      .update(careerApplications)
      .set(updates)
      .where(eq(careerApplications.id, applicationId))
      .returning({
        id: careerApplications.id,
        status: careerApplications.status,
        notes: careerApplications.notes,
      });

    if (!updated) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('Update career application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 },
    );
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

  try {
    const { id } = await params;
    const applicationId = parseInt(id, 10);
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    const [deleted] = await db
      .delete(careerApplications)
      .where(eq(careerApplications.id, applicationId))
      .returning({ id: careerApplications.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Delete career application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 },
    );
  }
}

