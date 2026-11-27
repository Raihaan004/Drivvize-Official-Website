'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { Reveal } from '@/components/premium-home/hooks';
import {
  VIDEOS,
  YOUTUBE_URL,
} from './learn-data';
import { mergeBlogCards, type DbBlogRow } from '@/lib/blogConstants';
import PostCard from './PostCard';
import { KnowledgeMineSection } from './KnowledgeMineSection';
import { DownloadsSection } from './DownloadsSection';
import type { KnowledgeArticle } from '@/lib/functionalsafetyfirst';

const TABS = [
  { id: 'blog', label: 'Blog' },
  { id: 'knowledge', label: 'Knowledge Mine' },
  { id: 'videos', label: 'Videos' },
  { id: 'downloads', label: 'Downloads' },
];

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="10" viewBox="0 0 18 10" className={className}>
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export function LearnClient({
  initialKnowledge = [],
  initialBlogs = [],
}: {
  initialKnowledge?: KnowledgeArticle[];
  initialBlogs?: DbBlogRow[];
}) {
  const latestArticles = mergeBlogCards(initialBlogs).slice(0, 3);
  const [active, setActive] = useState(TABS[0].id);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 150);
    }
  }, []);

  useEffect(() => {
    const on = () => {
      let a = TABS[0].id;
      TABS.forEach((t) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          a = t.id;
        }
      });
      setActive(a);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const jump = (id: string) => {
    window.history.replaceState({}, '', `/learn#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* hero */}
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink text-white">
          <img
            src="/images/learn_img/learn-banner.jpg"
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.88),rgba(10,16,24,0.35)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Learn</p>
            <h1 className="title text-white max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)]">
              {['Learn', 'from', 'engineers', 'who', 'build.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={i === 0 || i === 4 ? 'font-semibold text-white' : 'text-white/80'}
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
              Blog articles, our knowledge mine, videos and downloads.
            </p>
            <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: '1.1s' }}>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => jump(t.id)}
                  className={`rounded-full px-6 py-3.5 text-[14px] font-bold transition-all hover:-translate-y-0.5 ${
                    i === 0
                      ? 'bg-signal text-ink'
                      : 'border border-white/40 font-semibold hover:bg-white hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* sticky tabs */}
        <div className="sticky top-16 sm:top-20 z-30 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1320px] gap-8 overflow-x-auto px-6 lg:px-10">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => jump(t.id)}
                className={`relative whitespace-nowrap py-4 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  active === t.id ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {t.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-signal transition-transform duration-500 ${
                    active === t.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* blog */}
        <section id="blog" className="scroll-mt-32 py-28 lg:py-40">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow mb-6 text-brand">Blog</p>
                <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
                  Latest <b>articles.</b>
                </h2>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 self-start rounded-full border border-ink px-6 py-3.5 text-[14px] font-bold transition-colors hover:bg-ink hover:text-white lg:self-auto"
              >
                View all articles
                <Arrow className="transition-transform group-hover:translate-x-1.5" />
              </Link>
            </Reveal>
            {latestArticles.length === 0 ? (
              <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-14 text-center">
                <p className="text-lg font-light text-ink">No blog articles published yet</p>
                <p className="mt-2 text-sm text-ink/60">
                  Published engineering articles will appear here as soon as they go live.
                </p>
              </div>
            ) : (
              <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
                {latestArticles.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 110} className="h-full">
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* knowledge mine */}
        <KnowledgeMineSection initialArticles={initialKnowledge} />

        {/* videos */}
        <section id="videos" className="scroll-mt-32 py-28 lg:py-40">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow mb-6 text-brand">Videos</p>
                <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
                  Watch, <b>then apply.</b>
                </h2>
                <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink/60">
                  The top videos of our YouTube channel. Click to continue on YouTube.
                </p>
              </div>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 self-start rounded-full border border-ink px-6 py-3.5 text-[14px] font-bold transition-colors hover:bg-ink hover:text-white lg:self-auto"
              >
                Visit our channel
                <Arrow className="transition-transform group-hover:translate-x-1.5" />
              </a>
            </Reveal>

            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {VIDEOS.map((v, i) => (
                <Reveal key={v.url} delay={(i % 2) * 120}>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <div className="relative aspect-video overflow-hidden bg-ink">
                      <img
                        src={v.image}
                        alt={v.title}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-90 transition-all duration-[1600ms] group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                      <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal text-ink shadow-xl transition-transform duration-500 group-hover:scale-110">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 4l14 8-14 8z" />
                        </svg>
                      </span>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-6">
                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                          {v.tag}
                        </p>
                        <h3 className="text-2xl font-light tracking-tight transition-colors group-hover:text-deep">
                          {v.title}
                        </h3>
                      </div>
                      <span className="mt-1 shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
                        Watch on YouTube
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* downloads */}
        <DownloadsSection />
      </main>
      <Footer />
    </div>
  );
}

export default LearnClient;
