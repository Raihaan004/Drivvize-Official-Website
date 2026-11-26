import { desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { eventRegistrations, events, type EventRow } from '@/lib/db/schema';
import {
  PAST,
  UPCOMING,
  type DrivvizeEvent,
  type PastEvent,
} from '@/components/events/events-data';
import {
  parseJsonStringArray,
  toPublicPastEvent,
  toPublicUpcomingEvent,
  type DbEventSerialized,
  type EventFormat,
  type EventStatus,
} from './eventConstants';
import type { EventKind } from '@/components/events/events-data';

export function serializeEventRow(
  row: EventRow,
  registrationCount?: number,
): DbEventSerialized {
  const kind: EventKind = row.kind === 'external' ? 'external' : 'internal';
  const format: EventFormat =
    row.format === 'In person' || row.format === 'Hybrid' ? row.format : 'Online';
  const status: EventStatus = row.status === 'past' ? 'past' : 'upcoming';

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kind,
    format,
    status,
    startDate: row.startDate ? row.startDate.toISOString() : null,
    endDate: row.endDate ? row.endDate.toISOString() : null,
    timeLabel: row.timeLabel ?? null,
    location: row.location,
    hosts: parseJsonStringArray(row.hosts, ['Drivvize Engineering']),
    about: row.about,
    agenda: parseJsonStringArray(row.agenda, []),
    tags: parseJsonStringArray(row.tags, []),
    role: row.role ?? null,
    year: row.year ?? null,
    image: row.image ?? null,
    registrationUrl: row.registrationUrl ?? null,
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    registrationCount,
  };
}

export type PublicUpcomingEvent = ReturnType<typeof toPublicUpcomingEvent>;
export type PublicPastEvent = ReturnType<typeof toPublicPastEvent>;

export async function getPublicEventsData(): Promise<{
  upcoming: PublicUpcomingEvent[];
  past: PublicPastEvent[];
}> {
  try {
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.isPublished, true))
      .orderBy(desc(events.isFeatured), desc(events.createdAt));

    if (rows.length === 0) {
      return {
        upcoming: UPCOMING,
        past: PAST,
      };
    }

    const serialized = rows.map((r) => serializeEventRow(r));
    const upcoming = serialized
      .filter((r) => r.status === 'upcoming')
      .map(toPublicUpcomingEvent);
    const past = serialized
      .filter((r) => r.status === 'past')
      .map(toPublicPastEvent);

    return { upcoming, past };
  } catch (error) {
    console.error('Failed to query events from Neon Postgres:', error);
    return {
      upcoming: UPCOMING as DrivvizeEvent[],
      past: PAST as PastEvent[],
    };
  }
}

export async function getAdminEventsWithCounts(): Promise<DbEventSerialized[]> {
  const [rows, counts] = await Promise.all([
    db.select().from(events).orderBy(desc(events.createdAt)),
    db
      .select({
        eventSlug: eventRegistrations.eventSlug,
        total: sql<number>`count(*)::int`,
      })
      .from(eventRegistrations)
      .groupBy(eventRegistrations.eventSlug),
  ]);

  const countMap = new Map(counts.map((c) => [c.eventSlug, Number(c.total || 0)]));
  return rows.map((row) => serializeEventRow(row, countMap.get(row.slug) ?? 0));
}

