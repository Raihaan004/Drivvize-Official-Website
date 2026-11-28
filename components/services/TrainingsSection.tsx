'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Photo, Reveal } from '@/components/premium-home/hooks';
import {
  TRAINING_CATEGORIES,
  TRAINING_OFFERINGS,
  type TrainingCategory,
} from './trainings-data';

export function TrainingsSection() {
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const visibleOfferings = TRAINING_OFFERINGS.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory,
  );

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="trainings" className="scroll-mt-32 bg-paper py-32 lg:py-44">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-24">
          <p className="eyebrow mb-6 text-brand">Trainings</p>
          <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)] text-ink">
            Practical, <b>from day one.</b>
          </h2>
        </Reveal>

        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Photo
            src="/images/services_img/trainings/Train-img1.jpg"
            alt="Trainer presenting to a group"
            className="aspect-[4/3] lg:col-span-6"
            speed={0.06}
          />
          <Reveal className="lg:col-span-6" delay={150}>
            <p className="title text-[clamp(1.35rem,2.1vw,1.9rem)] !leading-[1.4] text-ink/60">
              We offer a wide variety of trainings. Our trainings are{' '}
              <b className="text-ink">practical</b>, filled with lots of examples and tips that you
              can start using at work right after.
            </p>
            <p className="mt-6 max-w-xl text-[16px] leading-[1.75] text-ink/65">
              We also offer certification trainings in which you are certified as a functional safety
              practitioner once you pass our exam. Our certifications are issued by a well-renowned
              international certification body.
            </p>
          </Reveal>
        </div>

        {/* Interactive Offerings Catalogue */}
        <div className="mt-24">
          <div className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-2 !text-[11px] text-brand">Training Offerings</p>
              <h3 className="text-2xl font-light tracking-tight text-ink sm:text-3xl">
                Click any course to explore its full syllabus
              </h3>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filter training offerings"
            >
              {TRAINING_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenId(null);
                  }}
                  className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-bold transition-colors ${
                    selectedCategory === category
                      ? 'bg-ink text-white'
                      : 'bg-white text-ink/60 hover:bg-ink/5 hover:text-ink'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-ink/10">
            {visibleOfferings.map((offering) => {
              const isOpen = openId === offering.id;
              const multiModule = offering.modules.length > 1;

              return (
                <article key={offering.id} className="border-t border-ink/10">
                  <button
                    type="button"
                    onClick={() => toggle(offering.id)}
                    aria-expanded={isOpen}
                    className="group grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left transition-colors hover:bg-white/60 sm:grid-cols-[4rem_1fr_auto_auto] sm:gap-8 sm:px-4"
                  >
                    <span className="text-sm font-bold tabular-nums text-brand">
                      {offering.number}
                    </span>

                    <div className="min-w-0">
                      <h4 className="text-[clamp(1.15rem,2vw,1.65rem)] font-light leading-snug tracking-tight text-ink transition-colors group-hover:text-deep">
                        {offering.title}
                      </h4>
                    </div>

                    <span className="hidden rounded-full border border-ink/15 bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/70 sm:inline-block">
                      {offering.duration}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-signal group-hover:bg-signal ${
                        isOpen ? 'rotate-45 border-signal bg-signal text-ink' : 'bg-white text-ink'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-ink/5 bg-white px-5 py-8 sm:px-10 sm:py-10">
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
                          <div className="max-w-2xl">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-signal/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
                                Duration: {offering.duration}
                              </span>
                              <span className="rounded-full border border-ink/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/60">
                                {offering.category}
                              </span>
                            </div>
                            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                              {offering.summary}
                            </p>
                          </div>

                          <Link
                            href="/contact"
                            className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-deep"
                          >
                            <span>Enquire for this training</span>
                            <svg width="15" height="9" viewBox="0 0 18 10">
                              <path
                                d="M0 5h16M12 1l4 4-4 4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              />
                            </svg>
                          </Link>
                        </div>

                        <div
                          className={`grid gap-8 ${
                            offering.modules.length >= 3
                              ? 'md:grid-cols-2 lg:grid-cols-3'
                              : multiModule
                              ? 'md:grid-cols-2'
                              : 'grid-cols-1'
                          }`}
                        >
                          {offering.modules.map((mod) => (
                            <div
                              key={mod.heading}
                              className="rounded-xl border border-ink/10 bg-paper/60 p-6"
                            >
                              <h5 className="mb-4 border-b border-ink/10 pb-3 text-sm font-bold uppercase tracking-[0.12em] text-deep">
                                {mod.heading}
                              </h5>
                              <ul
                                className={`grid gap-2.5 ${
                                  !multiModule ? 'sm:grid-cols-2 sm:gap-x-8' : ''
                                }`}
                              >
                                {mod.topics.map((topic) => (
                                  <li
                                    key={topic}
                                    className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/80"
                                  >
                                    <i className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-4">
          <Photo
            src="/images/services_img/trainings/Train-img2.jpg"
            alt="Whiteboard workshop"
            className="aspect-[4/3]"
            speed={0.07}
          />
          <Photo
            src="/images/services_img/trainings/Train-img3.jpg"
            alt="Team in a conference room presentation"
            className="aspect-[4/3]"
            speed={0.07}
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}

