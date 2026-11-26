'use client';

import React, { useEffect, useState } from 'react';
import { CountUp, Reveal } from '@/components/premium-home/hooks';
import { FSF_URL } from './learn-data';
import type { KnowledgeArticle } from '@/lib/functionalsafetyfirst';

interface KnowledgeMineApiResponse {
  success?: boolean;
  articles?: KnowledgeArticle[];
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function formatPublishedDate(iso: string | null): string | null {
  if (!iso) return null;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export function KnowledgeMineSection({
  initialArticles,
}: {
  initialArticles: KnowledgeArticle[];
}) {
  const [liveArticles, setLiveArticles] = useState<KnowledgeArticle[] | null>(null);
  const articles = liveArticles ?? initialArticles;

  useEffect(() => {
    const controller = new AbortController();

    async function syncLatestArticles() {
      try {
        const res = await fetch('/api/knowledge-mine', {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as KnowledgeMineApiResponse;
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setLiveArticles(data.articles);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Knowledge Mine sync skipped:', error);
        }
      }
    }

    const timer = window.setInterval(() => {
      void syncLatestArticles();
    }, TWO_HOURS_MS);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section id="knowledge" className="scroll-mt-32 bg-ink py-28 text-white lg:py-40">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <div className="mb-16 grid gap-10 lg:mb-24 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-6 text-signal">Our knowledge mine</p>
            <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
              Read a paragraph. <b>Go deeper.</b>
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-white/60">
              Latest articles synced automatically from{' '}
              <a
                href={FSF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-signal/60 underline-offset-4 transition-colors hover:text-signal"
              >
                Functional Safety First
              </a>
              . Read a paragraph here, then continue on functionalsafetyfirst.com for the entire
              content.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:text-right" delay={120}>
            <div className="title text-[clamp(4rem,8vw,7rem)] !font-extralight leading-none text-signal">
              <CountUp to={560} suffix="K+" />
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              viewers till now
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px bg-white/10 md:grid-cols-2">
          {articles.map((article, i) => {
            const publishedLabel = formatPublishedDate(article.publishedAt);
            const primaryCategory = article.categories[0];

            return (
              <Reveal key={article.id} delay={(i % 2) * 100} className="bg-ink">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col p-8 text-white transition-colors hover:bg-white/[0.04] lg:p-12"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold tabular-nums text-signal">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {publishedLabel && (
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                          {publishedLabel}
                        </span>
                      )}
                    </div>
                    {primaryCategory && (
                      <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                        {primaryCategory}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-light leading-tight tracking-tight text-white">
                    {article.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-[16px] leading-[1.75] text-white/60">
                    {article.excerpt}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-3 pt-8 text-[13px] font-bold text-signal">
                    Read the full article on functionalsafetyfirst.com
                    <svg
                      width="18"
                      height="10"
                      viewBox="0 0 18 10"
                      className="transition-transform group-hover:translate-x-1.5"
                    >
                      <path
                        d="M0 5h16M12 1l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
