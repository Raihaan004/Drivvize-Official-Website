import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';
import { normalizeRegistrationUrl, slugifyEventTitle } from '@/lib/eventConstants';
import { serializeEventRow } from '@/lib/eventQueries';

function parseOptionalDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  try {
    const [row] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!row) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, event: serializeEventRow(row) });
  } catch (error) {
    console.error('Fetch event by ID error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  try {
    const [existing] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const title =
      typeof body.title === 'string' && body.title.trim()
        ? body.title.trim()
        : existing.title;
    const about =
      typeof body.about === 'string' && body.about.trim()
        ? body.about.trim()
        : existing.about;
    const rawSlug = typeof body.slug === 'string' ? body.slug.trim() : existing.slug;
    const finalSlug = slugifyEventTitle(rawSlug || title) || existing.slug;

    const kind =
      body.kind === 'external' || body.kind === 'internal' ? body.kind : existing.kind;
    const format =
      body.format === 'In person' || body.format === 'Hybrid' || body.format === 'Online'
        ? body.format
        : existing.format;
    const status =
      body.status === 'past' || body.status === 'upcoming' ? body.status : existing.status;

    const startDate =
      body.startDate !== undefined ? parseOptionalDate(body.startDate) : existing.startDate;
    const endDate =
      body.endDate !== undefined ? parseOptionalDate(body.endDate) : existing.endDate;
    const timeLabel =
      body.timeLabel === null
        ? null
        : typeof body.timeLabel === 'string'
        ? body.timeLabel.trim() || null
        : existing.timeLabel;
    const location =
      typeof body.location === 'string' && body.location.trim()
        ? body.location.trim()
        : existing.location;

    const hosts =
      body.hosts !== undefined
        ? JSON.stringify(
            (() => {
              const list = normalizeStringList(body.hosts);
              return list.length > 0 ? list : ['Drivvize Engineering'];
            })(),
          )
        : existing.hosts;

    const agenda =
      body.agenda !== undefined
        ? (() => {
            const list = normalizeStringList(body.agenda);
            return list.length > 0 ? JSON.stringify(list) : null;
          })()
        : existing.agenda;

    const tags =
      body.tags !== undefined
        ? (() => {
            const list = normalizeStringList(body.tags);
            return list.length > 0 ? JSON.stringify(list) : null;
          })()
        : existing.tags;

    const role =
      body.role === null
        ? null
        : typeof body.role === 'string'
        ? body.role.trim() || null
        : existing.role;

    const year =
      body.year === null
        ? null
        : body.year !== undefined
        ? (() => {
            const n = parseInt(String(body.year), 10);
            return Number.isNaN(n) ? null : n;
          })()
        : existing.year;

    const image =
      body.image === null
        ? null
        : typeof body.image === 'string'
        ? body.image.trim() || null
        : existing.image;

    const registrationUrl =
      body.registrationUrl === null
        ? null
        : typeof body.registrationUrl === 'string'
        ? normalizeRegistrationUrl(body.registrationUrl)
        : existing.registrationUrl;

    const isFeatured =
      typeof body.isFeatured === 'boolean' ? body.isFeatured : existing.isFeatured;
    const isPublished =
      typeof body.isPublished === 'boolean' ? body.isPublished : existing.isPublished;

    const [updated] = await db
      .update(events)
      .set({
        slug: finalSlug,
        title,
        kind,
        format,
        status,
        startDate,
        endDate,
        timeLabel,
        location,
        hosts,
        about,
        agenda,
        tags,
        role,
        year,
        image,
        registrationUrl,
        isFeatured,
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    revalidatePath('/events');
    revalidatePath('/');

    return NextResponse.json({ success: true, event: serializeEventRow(updated) });
  } catch (error: unknown) {
    console.error('Update event error:', error);
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === '23505') {
      return NextResponse.json(
        { success: false, error: 'An event with this slug already exists.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
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
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  try {
    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, eventId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    revalidatePath('/events');
    revalidatePath('/');

    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

