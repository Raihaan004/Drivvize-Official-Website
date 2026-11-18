'use client';

import React, { useMemo, useState } from 'react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { Reveal } from '@/components/premium-home/hooks';
import { POSTS } from '@/components/learn/learn-data';
import PostCard, { type PostCardItem } from '@/components/learn/PostCard';

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

const DEFAULT_FILTERS = ['All', 'Functional Safety', 'Cybersecurity', 'Case Study'] as const;
const FALLBACK_IMAGES = [IMG.headlight, IMG.wheel, IMG.servers, IMG.cluster, IMG.code];

export function BlogListClient({ initialBlogs = [] }: { initialBlogs?: DbBlogRow[] }) {
  const [f, setF] = useState<string>('All');

  const allPosts = useMemo<PostCardItem[]>(() => {
    const dbPosts: PostCardItem[] = initialBlogs.map((b, idx) => ({
      slug: b.slug,
      title: b.title,
      category: b.category || 'Functional Safety',
      excerpt:
        b.excerpt ||
        'Technical engineering insights on automotive functional safety and cybersecurity.',
      image: b.coverImage || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
      readTimeLabel: b.readTime || '4 min read',
    }));

    const seen = new Set(dbPosts.map((p) => p.slug));
    const starterPosts: PostCardItem[] = POSTS.filter((p) => !seen.has(p.slug));
    return [...dbPosts, ...starterPosts];
  }, [initialBlogs]);

  const filters = useMemo(() => {
    const set = new Set<string>(DEFAULT_FILTERS);
    for (const p of allPosts) {
      if (p.category) set.add(p.category);
    }
    return Array.from(set);
  }, [allPosts]);

  const list = allPosts.filter((p) => f === 'All' || p.category === f);
  const [first, ...rest] = list;

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* hero */}
        <section className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
          <img
            src={IMG.engineer}
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.88),rgba(10,16,24,0.4)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Blog</p>
            <h1 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white">
              {['Notes', 'from', 'the', 'safety', 'desk.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 0 || i === 4 ? 'font-semibold text-white' : 'text-white/80'
                    }
                    style={{ animationDelay: `${150 + i * 100}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-up mt-8 max-w-lg text-[17px] leading-relaxed text-white/75"
              style={{ animationDelay: '0.9s' }}
            >
              All the blog articles of Drivvize.
            </p>
          </div>
        </section>

        {/* articles */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div
              className="mb-16 flex flex-wrap items-center gap-2 border-b border-ink/10 pb-6"
              role="tablist"
              aria-label="Filter articles"
            >
              {filters.map((x) => (
                <button
                  key={x}
                  type="button"
                  role="tab"
                  aria-selected={f === x}
                  onClick={() => setF(x)}
                  className={`rounded-full px-5 py-2.5 text-[13px] font-bold transition-colors cursor-pointer ${
                    f === x
                      ? 'bg-ink text-white'
                      : 'text-ink/55 hover:bg-paper hover:text-ink'
                  }`}
                >
                  {x}
                </button>
              ))}
              <span className="ml-auto self-center text-xs font-bold uppercase tracking-[0.14em] text-ink/40">
                {list.length} {list.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            <div key={f}>
              {first && (
                <Reveal className="mb-20 lg:mb-28">
                  <PostCard post={first} large />
                </Reveal>
              )}
              <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 100}>
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default BlogListClient;
