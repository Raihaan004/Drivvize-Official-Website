import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';
import { normalizeRegistrationUrl, slugifyEventTitle } from '@/lib/eventConstants';
import { getAdminEventsWithCounts, serializeEventRow } from '@/lib/eventQueries';

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

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allEvents = await getAdminEventsWithCounts();
    return NextResponse.json({ success: true, events: allEvents });
  } catch (error) {
    console.error('Fetch admin events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve events' },
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
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const about = typeof body.about === 'string' ? body.about.trim() : '';
    const rawSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const kind = body.kind === 'external' ? 'external' : 'internal';
    const format =
      body.format === 'In person' || body.format === 'Hybrid' ? body.format : 'Online';
    const status = body.status === 'past' ? 'past' : 'upcoming';
    const startDate = parseOptionalDate(body.startDate);
    const endDate = parseOptionalDate(body.endDate);
    const timeLabel = typeof body.timeLabel === 'string' ? body.timeLabel.trim() : '';
    const location =
      typeof body.location === 'string' && body.location.trim()
        ? body.location.trim()
        : 'Live online session';

    const hostsList = normalizeStringList(body.hosts);
    const hostsJson = JSON.stringify(
      hostsList.length > 0 ? hostsList : ['Drivvize Engineering'],
    );
    const agendaList = normalizeStringList(body.agenda);
    const agendaJson = agendaList.length > 0 ? JSON.stringify(agendaList) : null;
    const tagsList = normalizeStringList(body.tags);
    const tagsJson = tagsList.length > 0 ? JSON.stringify(tagsList) : null;

    const role = typeof body.role === 'string' ? body.role.trim() : '';
    const yearNum =
      typeof body.year === 'number'
        ? body.year
        : typeof body.year === 'string' && body.year.trim()
        ? parseInt(body.year, 10)
        : null;
    const image = typeof body.image === 'string' ? body.image.trim() : '';
    const registrationUrl =
      typeof body.registrationUrl === 'string'
        ? normalizeRegistrationUrl(body.registrationUrl) || ''
        : '';
    const isFeatured = Boolean(body.isFeatured);
    const isPublished = body.isPublished !== undefined ? Boolean(body.isPublished) : true;

    if (!title || !about) {
      return NextResponse.json(
        { success: false, error: 'Event title and description are required.' },
        { status: 400 },
      );
    }

    const finalSlug = slugifyEventTitle(rawSlug || title);
    if (!finalSlug) {
      return NextResponse.json(
        { success: false, error: 'A valid slug is required.' },
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(events)
      .values({
        slug: finalSlug,
        title,
        kind,
        format,
        status,
        startDate,
        endDate,
        timeLabel: timeLabel || null,
        location,
        hosts: hostsJson,
        about,
        agenda: agendaJson,
        tags: tagsJson,
        role: role || null,
        year: yearNum !== null && !Number.isNaN(yearNum) ? yearNum : null,
        image: image || null,
        registrationUrl: registrationUrl || null,
        isFeatured,
        isPublished,
      })
      .returning();

    revalidatePath('/events');
    revalidatePath('/');

    return NextResponse.json(
      { success: true, event: serializeEventRow(created, 0) },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('Create event error:', error);
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: 'An event with this slug already exists. Please choose a different title or slug.',
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 },
    );
  }
}

