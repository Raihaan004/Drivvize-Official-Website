'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { Reveal } from '@/components/premium-home/hooks';
import { formatBlogDate } from '@/lib/blogConstants';
import type { BlogEngagementStats } from '@/lib/blogQueries';
import { POSTS, readMinutes, type Block, type Post } from '@/components/learn/learn-data';
import PostCard, { type PostCardItem } from '@/components/learn/PostCard';
import { ArticleContent } from './ArticleContent';
import { BlogComments, type PublicBlogComment } from './BlogComments';
import {
  BlogDocumentCard,
  BlogShareAndLikeBar,
  BlogStarRating,
} from './BlogInteractions';

export interface BlogArticleData {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt?: string | null;
  readTimeLabel: string;
  documentName?: string | null;
  documentSize?: string | null;
  documentUrl?: string | null;
  blocks?: Block[];
  htmlContent?: string;
}

export function BlogPostClient({
  post,
  relatedPosts,
  initialEngagement,
  initialComments,
}: {
  post: BlogArticleData;
  relatedPosts?: PostCardItem[];
  initialEngagement?: BlogEngagementStats;
  initialComments?: PublicBlogComment[];
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [post.slug]);

  const related: PostCardItem[] =
    relatedPosts && relatedPosts.length > 0
      ? relatedPosts
      : POSTS.filter((p) => p.slug !== post.slug)
          .sort(
            (a, b) =>
              Number(b.category === post.category) - Number(a.category === post.category),
          )
          .slice(0, 3);

  let firstPara = true;
  const engagement = initialEngagement ?? { likes: 0, ratingSum: 0, ratingCount: 0 };

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      {/* Reading progress bar */}
      <div className="print:hidden pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full origin-left bg-signal transition-transform duration-75"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className="print:hidden">
        <Nav />
      </div>

      <main id="main-content">
        <article className="blog-printable">
          <header className="blog-print-header relative isolate overflow-hidden bg-ink text-white">
            <img
              src={post.image}
              alt={post.title}
              className="kenburns print:hidden absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div className="print:hidden absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(10,16,24,0.92),rgba(10,16,24,0.5)_60%,rgba(10,16,24,0.6))]" />
            <div className="mx-auto max-w-[980px] px-6 pb-20 pt-44 print:px-0 print:pb-8 print:pt-4 lg:px-10 lg:pb-28 lg:pt-56">
              <Link
                href="/blog"
                className="fade-up print:hidden mb-10 inline-flex items-center gap-3 text-[13px] font-bold text-white/70 transition-colors hover:text-white"
              >
                <svg width="18" height="10" viewBox="0 0 18 10" className="rotate-180">
                  <path
                    d="M0 5h16M12 1l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
                All articles
              </Link>
              <p
                className="eyebrow fade-up mb-6 text-signal print:text-ink"
                style={{ animationDelay: '0.15s' }}
              >
                {post.category} · {post.readTimeLabel}
              </p>
              <h1
                className="title fade-up text-[clamp(2.2rem,5vw,4.4rem)] text-white print:text-3xl print:text-ink"
                style={{ animationDelay: '0.3s' }}
              >
                {post.title}
              </h1>
              <p
                className="fade-up mt-8 text-sm font-semibold text-white/60 print:mt-4 print:text-ink/70"
                style={{ animationDelay: '0.5s' }}
              >
                By {post.author}
                {formatBlogDate(post.publishedAt) ? (
                  <> &middot; {formatBlogDate(post.publishedAt)}</>
                ) : null}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-[760px] px-6 py-16 print:max-w-none print:px-0 print:py-6 lg:py-24">
            <BlogStarRating
              slug={post.slug}
              initialRatingSum={engagement.ratingSum}
              initialRatingCount={engagement.ratingCount}
            />

            {post.excerpt && (
              <Reveal>
                <p className="title mb-14 border-l-[3px] border-signal pl-6 text-[clamp(1.25rem,2vw,1.6rem)] !leading-[1.5] text-ink/65">
                  {post.excerpt}
                </p>
              </Reveal>
            )}

            {post.blocks ? (
              post.blocks.map((b, i) => {
                if (b.t === 'h') {
                  return (
                    <Reveal key={i}>
                      <h2 className="mb-5 mt-14 text-3xl font-light tracking-tight text-ink">
                        {b.x}
                      </h2>
                    </Reveal>
                  );
                }
                if (b.t === 'ul') {
                  return (
                    <Reveal key={i}>
                      <ul className="my-8 space-y-4">
                        {b.x.map((li) => (
                          <li
                            key={li}
                            className="flex gap-4 text-[17px] leading-[1.7] text-ink/80"
                          >
                            <i className="mt-[0.75em] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand" />
                            {li}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  );
                }
                const lead = firstPara;
                firstPara = false;
                return (
                  <Reveal key={i}>
                    <p
                      className={`mb-6 text-[18px] leading-[1.85] text-ink/75 ${
                        lead
                          ? 'first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-deep'
                          : ''
                      }`}
                    >
                      {b.x}
                    </p>
                  </Reveal>
                );
              })
            ) : post.htmlContent ? (
              <Reveal>
                <ArticleContent content={post.htmlContent} />
              </Reveal>
            ) : null}

            <BlogDocumentCard
              documentName={post.documentName}
              documentSize={post.documentSize}
              documentUrl={post.documentUrl}
            />

            <BlogShareAndLikeBar
              slug={post.slug}
              title={post.title}
              initialLikes={engagement.likes}
            />

            <BlogComments
              slug={post.slug}
              blogTitle={post.title}
              initialComments={initialComments}
            />

            <Reveal className="print:hidden mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-10">
              <p className="max-w-xs text-[15px] text-ink/60">
                Have a question about your own program?
              </p>
              <Link
                href="/contact"
                className="rounded-full bg-signal px-7 py-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Talk to our team
              </Link>
            </Reveal>
          </div>
        </article>

        {/* Keep reading */}
        <section className="print:hidden bg-paper py-24 lg:py-32">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-14 flex items-center gap-4">
              <p className="eyebrow text-brand">Keep reading</p>
              <span className="h-px flex-1 bg-ink/10" />
            </Reveal>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

export function fromStaticPost(p: Post): BlogArticleData {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    image: p.image,
    author: 'Drivvize Engineering',
    readTimeLabel: `${readMinutes(p)} min read`,
    blocks: p.blocks,
  };
}
