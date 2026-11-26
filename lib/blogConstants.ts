import { IMG } from '@/components/premium-home/data';

export const BLOG_CATEGORIES = [
  'Functional Safety',
  'Automotive Cybersecurity',
  'Cybersecurity',
  'SOTIF',
  'ADAS & Autonomous',
  'Software-Defined Vehicles (SDV)',
  'Case Study',
  'Industry Insights',
] as const;

export const BLOG_AUTHORS = [
  'Drivvize Engineering',
  'Mohammed Raihaan',
  'Drivvize Security Team',
] as const;

export const BLOG_THUMBNAIL_PRESETS = [
  { label: 'Automotive Headlight', url: IMG.headlight },
  { label: 'Chassis & Wheel', url: IMG.wheel },
  { label: 'Cybersecurity Servers', url: IMG.servers },
  { label: 'Digital Cluster', url: IMG.cluster },
  { label: 'Embedded Code', url: IMG.code },
  { label: 'Autonomous Highway', url: IMG.aerialRoad },
  { label: 'EV Charging', url: IMG.charging },
  { label: 'Engineering Team', url: IMG.office },
] as const;

export const BLOG_FALLBACK_IMAGES = [
  IMG.headlight,
  IMG.wheel,
  IMG.servers,
  IMG.cluster,
  IMG.code,
];

export interface DbBlogRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string;
  readTime: string | null;
  coverImage: string | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export interface BlogCardData {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string | null;
  readTimeLabel: string;
}

export function slugifyBlogTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function estimateReadTime(content: string): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/[#>*_`[\]()-]/g, ' ')
    .trim();
  const words = plain ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function formatBlogDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return '';
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

export function mergeBlogCards(dbRows: DbBlogRow[]): BlogCardData[] {
  return dbRows.map((b, idx) => ({
    slug: b.slug,
    title: b.title,
    category: b.category || 'Functional Safety',
    excerpt:
      b.excerpt ||
      'Technical engineering insights on automotive functional safety and cybersecurity.',
    image: b.coverImage || BLOG_FALLBACK_IMAGES[idx % BLOG_FALLBACK_IMAGES.length],
    author: b.author || 'Drivvize Engineering',
    publishedAt: b.publishedAt || b.createdAt,
    readTimeLabel: b.readTime || '5 min read',
  }));
}

