'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { Reveal } from '@/components/premium-home/hooks';
import {
  dayRange,
  icsFor,
  longDate,
  month,
  PAST,
  UPCOMING,
  weekday,
  type DrivvizeEvent,
  type EventKind,
} from './events-data';

type KindFilter = 'all' | EventKind;

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="10" viewBox="0 0 18 10" className={className}>
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const KindBadge = ({ kind, dark = false }: { kind: EventKind; dark?: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
      kind === 'internal'
        ? dark
          ? 'bg-white text-ink'
          : 'bg-ink text-white'
        : 'bg-signal text-ink'
    }`}
  >
    <i className="h-1.5 w-1.5 rotate-45 bg-current" />
    {kind === 'internal' ? 'Internal event' : 'External event'}
  </span>
);

const initials = (n: string) =>
  n
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

function Hosts({ names, dark = false }: { names: string[]; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {names.map((n) => (
          <span
            key={n}
            title={n}
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
              dark ? 'border-ink bg-white text-ink' : 'border-white bg-deep text-white'
            }`}
          >
            {initials(n)}
          </span>
        ))}
      </div>
      <p className={`text-sm font-semibold leading-tight ${dark ? 'text-white' : 'text-ink'}`}>
        <span
          className={`block text-[10px] font-bold uppercase tracking-[0.16em] ${
            dark ? 'text-white/50' : 'text-ink/40'
          }`}
        >
          Conducted by
        </span>
        {names.join(' & ')}
      </p>
    </div>
  );
}

function useCountdown(iso?: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!iso || now === null) return null;
  const ms = Math.max(0, new Date(iso).getTime() - now);
  return {
    d: Math.floor(ms / 864e5),
    h: Math.floor(ms / 36e5) % 24,
    m: Math.floor(ms / 6e4) % 60,
    s: Math.floor(ms / 1e3) % 60,
    over: ms === 0,
  };
}

const registerHref = (e: DrivvizeEvent) =>
  `mailto:consult@drivvize.com?subject=${encodeURIComponent(
    `${e.start ? 'Registration' : 'Notify me'}: ${e.title}`
  )}&body=${encodeURIComponent(
    `I would like to ${e.start ? 'register for' : 'be notified about'} "${e.title}"${
      e.start ? ` (${longDate(e)})` : ''
    }.\n\nName:\nCompany:\nPhone:`
  )}`;

function addToCalendar(e: DrivvizeEvent) {
  const url = URL.createObjectURL(new Blob([icsFor(e)], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${e.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function Featured({ e }: { e: DrivvizeEvent }) {
  const c = useCountdown(e.start);
  return (
    <Reveal className="mb-20">
      <div id={e.id} className="relative isolate overflow-hidden bg-ink text-white scroll-mt-28">
        <img src={e.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.95),rgba(10,16,24,0.7)_55%,rgba(10,16,24,0.5))]" />
        <div className="grid gap-12 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-7">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="eyebrow !text-[11px] text-signal">Next up</span>
              <KindBadge kind={e.kind} dark />
              <span className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                {e.format}
              </span>
            </div>
            <h2 className="title text-white text-[clamp(2rem,4.2vw,3.8rem)]">{e.title}</h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70">{e.about}</p>

            <dl className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ['Date', longDate(e)],
                ['Time', e.time ?? 'To be announced'],
                ['Where', e.location],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {k}
                  </dt>
                  <dd className="mt-1.5 text-[15px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <Hosts names={e.hosts} dark />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            {c && (
              <div className="grid grid-cols-4 gap-3" aria-label="Countdown to event">
                {(
                  [
                    ['Days', c.d],
                    ['Hours', c.h],
                    ['Mins', c.m],
                    ['Secs', c.s],
                  ] as const
                ).map(([l, n]) => (
                  <div
                    key={l}
                    className="border border-white/15 bg-white/[0.04] py-5 text-center backdrop-blur"
                  >
                    <div className="title text-white text-[clamp(2rem,3.4vw,3.2rem)] !font-extralight tabular-nums leading-none">
                      {String(n).padStart(2, '0')}
                    </div>
                    <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href={registerHref(e)}
                className="group inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                {e.start ? 'Register' : 'Notify me'}
                <Arrow className="transition-transform group-hover:translate-x-1.5" />
              </a>
              {e.start && (
                <button
                  onClick={() => addToCalendar(e)}
                  className="rounded-full border border-white/40 px-7 py-4 text-[14px] font-semibold transition-colors hover:bg-white hover:text-ink"
                >
                  Add to calendar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function EventRow({
  e,
  open,
  toggle,
  i,
}: {
  e: DrivvizeEvent;
  open: boolean;
  toggle: () => void;
  i: number;
}) {
  return (
    <Reveal delay={(i % 3) * 70}>
      <article className="border-t border-ink/10">
        <button
          onClick={toggle}
          aria-expanded={open}
          className="group grid w-full grid-cols-[4.5rem_1fr] items-center gap-5 py-8 text-left sm:grid-cols-[7rem_1fr_auto] sm:gap-10"
        >
          <div className="text-center sm:text-left">
            {e.start ? (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  {month(e.start)}
                </p>
                <p className="title text-[clamp(2.2rem,4vw,3.6rem)] !font-extralight leading-none">
                  {dayRange(e)}
                </p>
                <p className="mt-1 hidden text-xs font-semibold text-ink/45 sm:block">
                  {weekday(e.start)}
                </p>
              </>
            ) : (
              <p className="title text-4xl !font-extralight text-ink/40">TBA</p>
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <KindBadge kind={e.kind} />
              <span className="rounded-full border border-ink/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/60">
                {e.format}
              </span>
            </div>
            <h3 className="text-[clamp(1.35rem,2.3vw,2rem)] font-light leading-tight tracking-tight transition-colors group-hover:text-deep">
              {e.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-ink/55">
              {e.time ? `${e.time} · ` : ''}
              {e.location}
            </p>
          </div>

          <span
            className={`col-span-2 flex items-center gap-3 text-[13px] font-bold sm:col-span-1 ${
              open ? 'text-deep' : ''
            }`}
          >
            {open ? 'Hide details' : 'Details'}
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:border-signal group-hover:bg-signal ${
                open ? 'rotate-45 bg-signal !border-signal' : ''
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
          </span>
        </button>

        <div
          className={`grid transition-all duration-700 ease-out ${
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-10 pb-12 sm:pl-[9rem] lg:grid-cols-12">
              <div className="relative aspect-[4/3] overflow-hidden bg-deep lg:col-span-4">
                <img src={e.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="lg:col-span-8">
                <p className="eyebrow mb-4 !text-[11px] text-brand">About this event</p>
                <p className="max-w-2xl text-[17px] leading-[1.75] text-ink/70">{e.about}</p>

                <dl className="mt-8 grid gap-6 border-y border-ink/10 py-6 sm:grid-cols-3">
                  {[
                    ['Date', longDate(e)],
                    ['Time', e.time ?? 'To be announced'],
                    ['Where', e.location],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/40">
                        {k}
                      </dt>
                      <dd className="mt-1.5 text-[15px] font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>

                {e.agenda && (
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {e.agenda.map((a) => (
                      <li key={a} className="flex gap-3 text-[15px] text-ink/75">
                        <i className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                  <Hosts names={e.hosts} />
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={registerHref(e)}
                      className="group/b inline-flex items-center gap-3 rounded-full bg-signal px-6 py-3.5 text-[13px] font-bold transition-transform hover:-translate-y-0.5"
                    >
                      {e.start ? 'Register' : 'Notify me'}
                      <Arrow className="transition-transform group-hover/b:translate-x-1.5" />
                    </a>
                    {e.start && (
                      <button
                        onClick={() => addToCalendar(e)}
                        className="rounded-full border border-ink px-6 py-3.5 text-[13px] font-bold transition-colors hover:bg-ink hover:text-white"
                      >
                        Add to calendar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function EventsClient() {
  const [kind, setKind] = useState<KindFilter>('all');
  const [scope, setScope] = useState<'upcoming' | 'past'>('upcoming');
  const [open, setOpen] = useState<string | null>(null);

  const up = UPCOMING.filter((e) => kind === 'all' || e.kind === kind).sort((a, b) =>
    (a.start ?? '9').localeCompare(b.start ?? '9')
  );
  const featured = up.find((e) => e.start);
  const rest = up.filter((e) => e !== featured);
  const past = PAST.filter((e) => kind === 'all' || e.kind === kind).sort(
    (a, b) => b.year - a.year
  );

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        <section className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
          <img
            src={IMG.stage}
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.88),rgba(10,16,24,0.35)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Events</p>
            <h1 className="title text-white max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)]">
              {['Meet', 'us', 'in', 'person,', 'or', 'online.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 0 || i === 3 ? 'font-semibold text-white' : 'text-white/80'
                    }
                    style={{ animationDelay: `${150 + i * 90}ms` }}
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
              Our own trainings and workshops, and the industry conferences where we speak.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            {/* controls */}
            <div className="mb-16 flex flex-col gap-6 border-b border-ink/10 pb-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-8" role="tablist" aria-label="Upcoming or past">
                {(['upcoming', 'past'] as const).map((s) => (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={scope === s}
                    onClick={() => setScope(s)}
                    className={`relative pb-3 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
                      scope === s ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                    }`}
                  >
                    {s}
                    <span
                      className={`absolute inset-x-0 -bottom-[25px] h-[3px] origin-left bg-signal transition-transform duration-500 ${
                        scope === s ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Event type">
                {(
                  [
                    ['all', 'All events'],
                    ['internal', 'Internal'],
                    ['external', 'External'],
                  ] as const
                ).map(([k, l]) => (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={kind === k}
                    onClick={() => setKind(k)}
                    className={`rounded-full px-5 py-2.5 text-[13px] font-bold transition-colors ${
                      kind === k
                        ? 'bg-ink text-white'
                        : 'text-ink/55 hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {scope === 'upcoming' ? (
              <div key={`u-${kind}`}>
                {featured && <Featured e={featured} />}
                {rest.length > 0 && (
                  <div>
                    {featured && (
                      <Reveal className="mb-6 flex items-center gap-4">
                        <p className="eyebrow text-ink/50">Also coming up</p>
                        <span className="h-px flex-1 bg-ink/10" />
                      </Reveal>
                    )}
                    {rest.map((e, i) => (
                      <EventRow
                        key={e.id}
                        e={e}
                        i={i}
                        open={open === e.id}
                        toggle={() => setOpen(open === e.id ? null : e.id)}
                      />
                    ))}
                    <div className="border-t border-ink/10" />
                  </div>
                )}
                {up.length === 0 && (
                  <p className="py-24 text-center text-lg text-ink/50">
                    No upcoming events of this type right now.
                  </p>
                )}
              </div>
            ) : (
              <div
                key={`p-${kind}`}
                className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              >
                {past.map((e, i) => (
                  <Reveal key={e.id} delay={(i % 3) * 100}>
                    <article className="group">
                      <div className="relative aspect-[4/3] overflow-hidden bg-deep">
                        <img
                          src={e.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover grayscale transition-all duration-[1400ms] group-hover:scale-105 group-hover:grayscale-0"
                        />
                        <div className="absolute left-4 top-4">
                          <KindBadge kind={e.kind} dark />
                        </div>
                        <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
                      </div>
                      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
                        {e.role}
                        {e.year ? ` · ${e.year}` : ''}
                      </p>
                      <h3 className="mt-2 text-2xl font-light leading-snug tracking-tight">
                        {e.title}
                      </h3>
                    </article>
                  </Reveal>
                ))}
                {past.length === 0 && (
                  <p className="col-span-full py-24 text-center text-lg text-ink/50">
                    No past events of this type.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-paper py-24 lg:py-32">
          <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-10 px-6 lg:flex-row lg:items-center lg:px-10">
            <Reveal>
              <h2 className="title max-w-2xl text-[clamp(2rem,4vw,3.4rem)]">
                Want Drivvize at your event, or a <b>training for your team?</b>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 rounded-full bg-signal px-8 py-5 text-[15px] font-bold transition-transform hover:-translate-y-1"
              >
                Get in touch
                <Arrow className="transition-transform group-hover:translate-x-2" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default EventsClient;
