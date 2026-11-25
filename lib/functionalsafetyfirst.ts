import { cacheLife, cacheTag } from 'next/cache';
import { FSF_URL, KNOWLEDGE } from '@/components/learn/learn-data';

export const FSF_FEED_URL = 'https://www.functionalsafetyfirst.com/feeds/posts/default';

export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string | null;
  categories: string[];
}

interface BloggerTextNode {
  $t?: string;
}

interface BloggerLink {
  rel?: string;
  href?: string;
}

interface BloggerCategory {
  term?: string;
}

interface BloggerEntry {
  id?: BloggerTextNode;
  title?: BloggerTextNode;
  published?: BloggerTextNode;
  updated?: BloggerTextNode;
  content?: BloggerTextNode;
  summary?: BloggerTextNode;
  link?: BloggerLink[];
  category?: BloggerCategory[];
}

interface BloggerFeedResponse {
  feed?: {
    entry?: BloggerEntry[];
  };
}

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lt: '<',
  gt: '>',
};

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const code = Number(dec);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : '';
    })
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

function htmlToExcerpt(html: string, maxLength = 240): string {
  const plainText = decodeHtmlEntities(
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) {
    return 'Read the latest automotive functional safety insights on Functional Safety First.';
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const sliced = plainText.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  const boundary = lastSpace > Math.floor(maxLength * 0.6) ? sliced.slice(0, lastSpace) : sliced;
  return `${boundary.trimEnd()}…`;
}

export function getFallbackFsfArticles(): KnowledgeArticle[] {
  return KNOWLEDGE.map((item, index) => ({
    id: `fallback-${index + 1}`,
    title: item.title,
    excerpt: item.para,
    url: FSF_URL,
    publishedAt: null,
    categories: [],
  }));
}

/**
 * Fetches the latest blog posts directly from functionalsafetyfirst.com's public Blogger JSON feed.
 */
export async function fetchLatestFsfArticles(limit = 4): Promise<KnowledgeArticle[]> {
  const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 12);
  const endpoint = `${FSF_FEED_URL}?alt=json&max-results=${safeLimit}`;

  const response = await fetch(endpoint, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Functional Safety First feed (${response.status})`);
  }

  const payload = (await response.json()) as BloggerFeedResponse;
  const entries = payload.feed?.entry ?? [];

  return entries
    .map((entry, index): KnowledgeArticle | null => {
      const title = decodeHtmlEntities(entry.title?.$t ?? '').replace(/\s+/g, ' ').trim();
      if (!title) return null;

      const alternateUrl = entry.link?.find((item) => item.rel === 'alternate')?.href?.trim();
      const rawHtml = entry.content?.$t ?? entry.summary?.$t ?? '';
      const categories = (entry.category ?? [])
        .map((cat) => (cat.term ?? '').trim())
        .filter(Boolean);

      return {
        id: entry.id?.$t?.trim() || `${alternateUrl || FSF_URL}-${index}`,
        title,
        excerpt: htmlToExcerpt(rawHtml),
        url: alternateUrl || FSF_URL,
        publishedAt: entry.published?.$t?.trim() || entry.updated?.$t?.trim() || null,
        categories,
      };
    })
    .filter((article): article is KnowledgeArticle => article !== null);
}

/**
 * Cached server-side reader used during SSR/prerendering so /learn stays fast
 * while automatically refreshing in the background every 2 hours.
 */
export async function getCachedFsfArticles(limit = 4): Promise<KnowledgeArticle[]> {
  'use cache';
  cacheLife({ stale: 300, revalidate: 7200, expire: 86400 });
  cacheTag('knowledge-mine');

  try {
    const articles = await fetchLatestFsfArticles(limit);
    return articles.length > 0 ? articles : getFallbackFsfArticles();
  } catch (error) {
    console.error('Failed to load cached Functional Safety First articles:', error);
    return getFallbackFsfArticles();
  }
}

