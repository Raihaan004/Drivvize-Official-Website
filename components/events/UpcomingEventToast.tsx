'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UPCOMING, month, dayRange, type DrivvizeEvent } from './events-data';

interface EventsApiResponse {
  success?: boolean;
  upcoming?: (DrivvizeEvent & { isFeatured?: boolean })[];
}

export default function UpcomingEventToast() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nextEvent, setNextEvent] = useState<DrivvizeEvent | null>(
    () => UPCOMING.find((e) => e.start) || UPCOMING[0] || null,
  );

  useEffect(() => {
    let active = true;

    try {
      if (sessionStorage.getItem('drivvize_event_toast_dismissed') === 'true') {
        return;
      }
    } catch {
      // Ignore sessionStorage exceptions
    }

    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: EventsApiResponse | null) => {
        if (!active || !data?.success || !Array.isArray(data.upcoming) || data.upcoming.length === 0) {
          return;
        }
        const picked =
          data.upcoming.find((e) => e.isFeatured && e.start) ??
          data.upcoming.find((e) => e.start) ??
          data.upcoming[0];
        if (picked) {
          setNextEvent(picked);
        }
      })
      .catch(() => {
        // Keep starter fallback event
      });

    const timer = window.setTimeout(() => {
      if (active) setVisible(true);
    }, 1200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      setDismissed(true);
    }, 400);

    try {
      sessionStorage.setItem('drivvize_event_toast_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  if (dismissed || !nextEvent) {
    return null;
  }

  return (
    <aside
      aria-label="Upcoming Event Announcement"
      className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[380px] max-w-[380px] sm:ml-auto z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a1018]/95 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-signal to-transparent" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-signal">
              Upcoming Event
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
              {nextEvent.format}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close notification"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mt-3">
          <h4 className="text-[15px] font-semibold leading-snug tracking-tight text-white transition-colors hover:text-signal">
            <Link href={`/events#${nextEvent.id}`}>{nextEvent.title}</Link>
          </h4>

          <div className="mt-2.5 flex items-center gap-2 text-[12.5px] text-white/75">
            <svg
              className="h-4 w-4 shrink-0 text-signal"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="font-semibold text-white">
              {nextEvent.start ? `${month(nextEvent.start)} ${dayRange(nextEvent)}` : 'Coming soon'}
            </span>
            {nextEvent.time && (
              <>
                <span className="text-white/30">•</span>
                <span className="truncate text-white/60">{nextEvent.time.split(',')[0]}</span>
              </>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-[12px] text-white/50">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-white/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span className="truncate">{nextEvent.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <Link
            href={`/events#${nextEvent.id}`}
            className="group inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-signal px-4 py-2 text-xs font-bold text-ink shadow-sm transition-all hover:scale-[1.02] hover:bg-signal/90 active:scale-[0.98]"
          >
            <span>View event details</span>
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            className="cursor-pointer text-[11.5px] font-medium text-white/45 transition-colors hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </aside>
  );
}
