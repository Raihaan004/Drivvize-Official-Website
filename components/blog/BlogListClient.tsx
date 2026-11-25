'use client';

import React, { useMemo, useState } from 'react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { Reveal } from '@/components/premium-home/hooks';
import {
  BLOG_CATEGORIES,
  mergeBlogCards,
  type DbBlogRow,
} from '@/lib/blogConstants';
import PostCard from '@/components/learn/PostCard';

export type { DbBlogRow };

export function BlogListClient({ initialBlogs = [] }: { initialBlogs?: DbBlogRow[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPosts = useMemo(() => mergeBlogCards(initialBlogs), [initialBlogs]);

  const filters = useMemo(() => {
    const present = new Set<string>();
    for (const post of allPosts) {
      if (post.category) present.add(post.category);
    }

    const orderedKnown = BLOG_CATEGORIES.filter((cat) => present.has(cat));
    const customCategories = Array.from(present)
      .filter((cat) => !(BLOG_CATEGORIES as readonly string[]).includes(cat))
      .sort((a, b) => a.localeCompare(b));

    return ['All', ...orderedKnown, ...customCategories];
  }, [allPosts]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      return (
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.category.toLowerCase().includes(normalizedQuery) ||
        post.author.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [allPosts, activeCategory, normalizedQuery]);

  const [featured, ...rest] = filteredPosts;

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* hero */}
        <section className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
          <img
            src={IMG.engineer}
            alt="Automotive safety engineering desk"
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
              Engineering articles on ISO 26262 functional safety, automotive cybersecurity, SOTIF,
              and software-defined vehicles.
            </p>
          </div>
        </section>

        {/* articles */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="mb-14 flex flex-col gap-5 border-b border-ink/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div
                className="flex flex-wrap items-center gap-2"
                role="tablist"
                aria-label="Filter articles by category"
              >
                {filters.map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={`cursor-pointer rounded-full px-5 py-2.5 text-[13px] font-bold transition-colors ${
                      activeCategory === category
                        ? 'bg-ink text-white'
                        : 'text-ink/55 hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                  <svg
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles or author..."
                    aria-label="Search articles"
                    className="w-full rounded-full border border-ink/15 bg-paper py-2 pl-10 pr-4 text-[13px] text-ink placeholder:text-ink/40 focus:border-ink focus:bg-white focus:outline-none"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-16 text-center">
                <h2 className="text-2xl font-light text-ink">No matching articles found</h2>
                <p className="mt-2 text-sm text-ink/60">
                  Try clearing your search or switching back to all categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-6 rounded-full bg-ink px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-deep"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div key={`${activeCategory}-${normalizedQuery}`}>
                {featured && (
                  <Reveal className="mb-20 lg:mb-28">
                    <PostCard post={featured} large />
                  </Reveal>
                )}
                <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.slug} delay={(i % 3) * 100} className="h-full">
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default BlogListClient;
