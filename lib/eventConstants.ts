import { IMG } from '@/components/premium-home/data';
import type { DrivvizeEvent, EventKind, PastEvent } from '@/components/events/events-data';

export const EVENT_KINDS: { value: EventKind; label: string }[] = [
  { value: 'internal', label: 'Internal Event (Drivvize Hosted)' },
  { value: 'external', label: 'External Event (Conference / Partner)' },
];

export const EVENT_FORMATS = ['Online', 'In person', 'Hybrid'] as const;
export type EventFormat = (typeof EVENT_FORMATS)[number];

export const EVENT_STATUSES = ['upcoming', 'past'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_IMAGE_PRESETS = [
  { label: 'Presentation & Workshop', url: IMG.presenting },
  { label: 'Training Session', url: IMG.meeting },
  { label: 'Whiteboard Architecture', url: IMG.whiteboard },
  { label: 'Conference Stage', url: IMG.stage },
  { label: 'Conference Audience', url: IMG.audience },
  { label: 'Cybersecurity Training', url: IMG.laptop },
  { label: 'Automotive Concept', url: IMG.concept },
  { label: 'Engineering Team', url: IMG.office },
] as const;

export interface DbEventSerialized {
  id: number;
  slug: string;
  title: string;
  kind: EventKind;
  format: EventFormat;
  status: EventStatus;
  startDate: string | null;
  endDate: string | null;
  timeLabel: string | null;
  location: string;
  hosts: string[];
  about: string;
  agenda: string[];
  tags: string[];
  role: string | null;
  year: number | null;
  image: string | null;
  registrationUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  registrationCount?: number;
}

export function slugifyEventTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseJsonStringArray(raw: string | null | undefined, fallback: string[] = []): string[] {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v).trim()).filter(Boolean);
      }
    } catch {
      // Fallback to comma/newline splitting
    }
  }
  return trimmed
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeRegistrationUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function toPublicUpcomingEvent(row: DbEventSerialized): DrivvizeEvent & {
  dbId?: number;
  registrationUrl?: string | null;
  isFeatured?: boolean;
} {
  return {
    id: row.slug,
    dbId: row.id,
    title: row.title,
    kind: row.kind,
    format: row.format,
    start: row.startDate ?? undefined,
    end: row.endDate ?? undefined,
    time: row.timeLabel ?? undefined,
    location: row.location,
    hosts: row.hosts.length > 0 ? row.hosts : ['Drivvize Engineering'],
    about: row.about,
    agenda: row.agenda.length > 0 ? row.agenda : undefined,
    image: row.image || IMG.stage,
    tags: row.tags,
    registrationUrl: normalizeRegistrationUrl(row.registrationUrl),
    isFeatured: row.isFeatured,
  };
}

export function toPublicPastEvent(row: DbEventSerialized): PastEvent & {
  about?: string;
  location?: string;
} {
  return {
    id: row.slug,
    title: row.title,
    kind: row.kind,
    year: row.year ?? (row.startDate ? new Date(row.startDate).getFullYear() : 0),
    role: row.role || (row.kind === 'internal' ? 'Hosted by Drivvize' : 'Speaker'),
    image: row.image || IMG.stage,
    about: row.about,
    location: row.location,
  };
}

