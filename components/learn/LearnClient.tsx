'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { CountUp, Reveal } from '@/components/premium-home/hooks';
import {
  DOWNLOADS,
  FSF_URL,
  KNOWLEDGE,
  POSTS,
  VIDEOS,
  YOUTUBE_URL,
} from './learn-data';
import PostCard from './PostCard';

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

function DownloadCard({ item, i }: { item: (typeof DOWNLOADS)[number]; i: number }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (item.file) {
      const a = document.createElement('a');
      a.href = item.file;
      a.download = '';
      a.click();
    } else {
      const subject = `Download request: ${item.title}`;
      const body = `Please share "${item.title}" with me.\n\nMy email: ${email.trim()}`;
      window.location.href = `mailto:consult@drivvize.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    setDone(true);
  };

  return (
    <Reveal delay={(i % 2) * 100}>
      <article className="group flex h-full flex-col bg-white ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-ink/10">
        <div className="relative aspect-[16/9] overflow-hidden bg-deep">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
          />
          <span className="absolute left-4 top-4 rounded-full bg-signal px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
            PDF
          </span>
        </div>
        <div className="flex flex-1 flex-col p-7">
          <h3 className="text-2xl font-light tracking-tight">{item.title}</h3>
          <p className="mt-2 text-[15px] text-ink/55">{item.note}</p>

          <div className="mt-auto pt-7">
            {done ? (
              <p className="text-[14px] font-semibold leading-relaxed text-deep">
                {item.file
                  ? 'Your download has started.'
                  : 'Your email app has opened with your request. Press send and we will share it with you.'}
              </p>
            ) : open ? (
              <form onSubmit={submit} noValidate>
                <label htmlFor={`dl-${i}`} className="sr-only">
                  Email id
                </label>
                <div
                  className={`flex items-center gap-2 border-b ${
                    error ? 'border-red-500' : 'border-ink/25 focus-within:border-ink'
                  }`}
                >
                  <input
                    id={`dl-${i}`}
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email id"
                    className="w-full bg-transparent py-3 text-[15px] outline-none placeholder:text-ink/30"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-ink px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-deep"
                  >
                    Get access
                  </button>
                </div>
                <p className="min-h-5 pt-1.5 text-xs font-medium text-red-600">{error}</p>
              </form>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="group/b inline-flex items-center gap-3 text-[13px] font-bold"
              >
                Get access
                <Arrow className="transition-transform group-hover/b:translate-x-1.5" />
              </button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function LearnClient() {
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
            src={IMG.office}
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
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
              {POSTS.slice(0, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i * 110}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* knowledge mine */}
        <section id="knowledge" className="scroll-mt-32 bg-ink py-28 text-white lg:py-40">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="mb-16 grid gap-10 lg:mb-24 lg:grid-cols-12 lg:items-end">
              <Reveal className="lg:col-span-7">
                <p className="eyebrow mb-6 text-signal">Our knowledge mine</p>
                <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
                  Read a paragraph. <b>Go deeper.</b>
                </h2>
                <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-white/60">
                  A peek at articles from Functional Safety First. Read a paragraph here, then
                  continue on functionalsafetyfirst.com for the entire content.
                </p>
              </Reveal>
              <Reveal className="lg:col-span-5 lg:text-right" delay={120}>
                <div className="title text-[clamp(4rem,8vw,7rem)] !font-extralight leading-none text-signal">
                  <CountUp to={400} suffix="K+" />
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                  viewers till now
                </p>
              </Reveal>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {KNOWLEDGE.map((k, i) => (
                <Reveal key={k.title} delay={(i % 2) * 100} className="bg-ink">
                  <a
                    href={FSF_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block h-full p-8 text-white transition-colors hover:bg-white/[0.04] lg:p-12"
                  >
                    <p className="mb-5 text-sm font-bold tabular-nums text-signal">0{i + 1}</p>
                    <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-light leading-tight tracking-tight text-white">
                      {k.title}
                    </h3>
                    <p className="mt-5 max-w-lg text-[16px] leading-[1.75] text-white/60">{k.para}</p>
                    <span className="mt-8 inline-flex items-center gap-3 text-[13px] font-bold text-signal">
                      Read the full article on functionalsafetyfirst.com
                      <Arrow className="transition-transform group-hover:translate-x-1.5" />
                    </span>
                    <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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
                <Reveal key={v.title} delay={(i % 2) * 120}>
                  <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="group block">
                    <div className="relative aspect-video overflow-hidden bg-ink">
                      <img
                        src={v.image}
                        alt=""
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
        <section id="downloads" className="scroll-mt-32 bg-paper py-28 lg:py-40">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 lg:mb-20">
              <p className="eyebrow mb-6 text-brand">Downloads</p>
              <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
                Take it <b>with you.</b>
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/60">
                Enter your email id to get access to any of our downloads.
              </p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {DOWNLOADS.map((d, i) => (
                <DownloadCard key={d.title} item={d} i={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LearnClient;
