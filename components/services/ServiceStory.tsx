'use client';

import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Reveal } from '@/components/premium-home/hooks';

export type ServiceItem = { title: string; body: string; image: string };

/** Heading, then a sticky photo that changes as each service scrolls into focus. */
export default function ServiceStory({
  id,
  eyebrow,
  title,
  items,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  items: ServiceItem[];
  dark?: boolean;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      let currentActive = 0;
      const triggerY = window.innerHeight * 0.45;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) {
          currentActive = i;
        }
      });
      setActive(currentActive);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-30% 0px -50% 0px' }
    );
    refs.current.forEach((el) => el && io.observe(el));

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [items.length]);

  const pad = (n: number) => String(n).padStart(2, '0');
  const line = dark ? 'border-white/15' : 'border-ink/10';

  return (
    <section
      id={id}
      className={`scroll-mt-32 py-32 lg:py-44 ${
        dark ? 'bg-ink text-white' : 'bg-white text-ink'
      }`}
    >
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-24">
          <p className={`eyebrow mb-6 ${dark ? 'text-signal' : 'text-brand'}`}>{eyebrow}</p>
          <h2
            className={`title text-[clamp(2.4rem,5.4vw,4.8rem)] ${
              dark ? 'text-white' : 'text-ink'
            }`}
          >
            {title}
          </h2>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden bg-deep lg:sticky lg:top-36 lg:aspect-[4/5]">
              {items.map((it, i) => (
                <img
                  key={it.title}
                  src={it.image}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out ${
                    i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
                <p className="max-w-[70%] text-sm font-semibold leading-snug">
                  {items[active].title}
                </p>
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold tabular-nums text-ink">
                  {pad(active + 1)} / {pad(items.length)}
                </span>
              </div>
              <span
                className="absolute bottom-0 left-0 h-[3px] bg-signal transition-all duration-700"
                style={{ width: `${((active + 1) / items.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            {items.map((it, i) => (
              <article
                key={it.title}
                data-i={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`border-t py-12 first:pt-0 first:border-t-0 lg:py-16 ${line}`}
              >
                <Reveal>
                  <p
                    className={`mb-4 text-sm font-bold tabular-nums transition-colors duration-500 ${
                      i === active
                        ? dark
                          ? 'text-signal'
                          : 'text-brand'
                        : dark
                        ? 'text-white/30'
                        : 'text-ink/30'
                    }`}
                  >
                    {pad(i + 1)}
                  </p>
                  <h3
                    className={`text-[clamp(1.6rem,2.7vw,2.4rem)] font-light leading-[1.15] tracking-tight ${
                      dark ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {it.title}
                  </h3>
                  <p
                    className={`mt-6 max-w-2xl text-[16px] leading-[1.75] ${
                      dark ? 'text-white/65' : 'text-ink/65'
                    }`}
                  >
                    {it.body}
                  </p>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

