'use client';

import React from 'react';
import { IMG, RECOGNITION } from './data';
import { CountUp, Photo, Reveal } from './hooks';

export default function Recognition() {
  return (
    <section id="recognition" className="py-32 lg:py-44">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-24">
          <p className="eyebrow mb-6 text-brand">Industry recognition</p>
          <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
            A voice the industry <b>listens to.</b>
          </h2>
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <Photo
              src={IMG.stage}
              alt="Speaker addressing a large conference audience"
              className="aspect-[4/5]"
              speed={0.06}
            />
            <Photo
              src={IMG.audience}
              alt="Audience watching a speaker in a dark room"
              className="absolute -bottom-10 -right-4 hidden aspect-[4/3] w-1/2 border-8 border-white sm:block"
              speed={0.1}
              delay={300}
            />
          </div>

          <div className="lg:col-span-7">
            <Reveal className="mb-10 flex items-end gap-6">
              <div className="title text-[clamp(4rem,8vw,7.5rem)] !font-extralight leading-none text-deep">
                <CountUp to={560} suffix="K+" />
              </div>
              <p className="pb-3 text-sm font-semibold uppercase leading-snug tracking-[0.12em] text-ink/55">
                viewers on
                <br />
                <a
                  href="https://www.functionalsafetyfirst.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink underline decoration-signal decoration-2 underline-offset-4"
                >
                  functionalsafetyfirst.com
                </a>
              </p>
            </Reveal>

            <ul>
              {RECOGNITION.map((r, i) => {
                const inner = (
                  <>
                    <span className="w-32 shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                      {r.kind}
                    </span>
                    <span className="flex-1 text-[clamp(1.05rem,1.6vw,1.4rem)] font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                      {r.title}
                    </span>
                    <span className="flex items-center gap-3 text-xs font-semibold text-ink/50">
                      {r.soon && (
                        <span className="rounded-full bg-signal px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                          Announcing soon
                        </span>
                      )}
                      {r.note}
                    </span>
                  </>
                );
                const cls =
                  'group flex flex-col gap-1 border-t border-ink/10 py-5 sm:flex-row sm:items-center sm:gap-6';
                return (
                  <Reveal as="li" key={r.title} delay={i * 50}>
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noreferrer" className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </Reveal>
                );
              })}
              <li className="border-t border-ink/10" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

