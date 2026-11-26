'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IMG } from '@/components/premium-home/data';
import type { DbEventSerialized } from '@/lib/eventConstants';

interface RegistrationRow {
  id: number;
  eventSlug: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: string;
}

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState<DbEventSerialized[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'upcoming' | 'past'>('ALL');
  const [kindFilter, setKindFilter] = useState<'ALL' | 'internal' | 'external'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [regsModalEvent, setRegsModalEvent] = useState<DbEventSerialized | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data?.success) {
        setEventsList(data.events || []);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/events')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.success) {
          setEventsList(data.events || []);
        }
      })
      .catch((err) => {
        if (mounted) console.error('Failed to load events:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTogglePublish = async (ev: DbEventSerialized) => {
    setTogglingId(ev.id);
    try {
      const res = await fetch(`/api/admin/events/${ev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !ev.isPublished }),
      });
      const data = await res.json();
      if (res.ok && data?.success && data.event) {
        setEventsList((prev) =>
          prev.map((item) =>
            item.id === ev.id
              ? { ...data.event, registrationCount: item.registrationCount }
              : item,
          ),
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data?.success) {
        setEventsList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data?.error || 'Failed to delete event');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const openRegistrationsModal = async (ev: DbEventSerialized) => {
    setRegsModalEvent(ev);
    setLoadingRegs(true);
    try {
      const res = await fetch(
        `/api/admin/events/registrations?slug=${encodeURIComponent(ev.slug)}`,
      );
      const data = await res.json();
      if (data?.success) {
        setRegistrations(data.registrations || []);
      }
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleDeleteRegistration = async (regId: number) => {
    if (!confirm('Remove this registration record?')) return;
    const res = await fetch(`/api/admin/events/registrations?id=${regId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
      if (regsModalEvent) {
        setEventsList((prev) =>
          prev.map((item) =>
            item.id === regsModalEvent.id
              ? {
                  ...item,
                  registrationCount: Math.max(0, (item.registrationCount ?? 1) - 1),
                }
              : item,
          ),
        );
      }
    }
  };

  const filteredEvents = eventsList.filter((ev) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      ev.title.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.hosts.join(' ').toLowerCase().includes(q) ||
      ev.slug.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
    const matchesKind = kindFilter === 'ALL' || ev.kind === kindFilter;
    return matchesSearch && matchesStatus && matchesKind;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            Trainings &amp; Conferences
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Events Manager
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Post upcoming workshops, webinars, and past conference appearances to /events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/events"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink/70 shadow-xs hover:bg-paper"
          >
            View Public Events
          </Link>
          <button
            type="button"
            onClick={loadEvents}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink/70 shadow-xs hover:bg-paper"
          >
            Refresh
          </button>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400"
          >
            <span>+ Post New Event</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 rounded-2xl border border-line bg-white p-4 shadow-xs">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by title, host, location, or slug..."
            className="w-full max-w-md rounded-xl border border-line bg-paper px-4 py-2 text-xs text-ink placeholder-ink/40 focus:border-brand focus:outline-none sm:text-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'upcoming', 'past'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  statusFilter === s
                    ? 'bg-ink text-white'
                    : 'bg-paper text-ink/70 hover:bg-line'
                }`}
              >
                {s === 'ALL' ? 'All Status' : s === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
            {(['ALL', 'internal', 'external'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKindFilter(k)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  kindFilter === k
                    ? 'bg-deep text-white'
                    : 'bg-paper text-ink/70 hover:bg-line'
                }`}
              >
                {k === 'ALL' ? 'All Types' : k === 'internal' ? 'Internal' : 'External'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-ink/40">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span>Loading events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="mx-auto max-w-sm px-4 py-16 text-center">
            <h3 className="text-base font-bold text-ink">No events found</h3>
            <p className="mb-5 mt-1 text-xs text-ink/60">
              Create your first event or adjust your filters.
            </p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2 text-xs font-bold text-ink"
            >
              Post New Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-line bg-paper/60 text-[11px] font-bold uppercase tracking-wider text-ink/60">
                  <th className="px-6 py-3.5">Event</th>
                  <th className="px-4 py-3.5">Type &amp; Format</th>
                  <th className="px-4 py-3.5">Schedule</th>
                  <th className="px-4 py-3.5">Registrations</th>
                  <th className="px-4 py-3.5">Visibility</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="transition-colors hover:bg-paper/40">
                    <td className="max-w-md px-6 py-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={ev.image || IMG.stage}
                          alt={ev.title}
                          className="h-14 w-20 shrink-0 rounded-lg border border-line bg-paper object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="line-clamp-1 text-sm font-bold text-ink">
                              {ev.title}
                            </p>
                            {ev.isFeatured && (
                              <span className="rounded-full bg-signal px-2 py-0.5 text-[10px] font-bold uppercase text-ink">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate font-mono text-xs text-ink/40">
                            /events#{ev.slug}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-ink/60">
                            {ev.location} &bull; {ev.hosts.join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block w-fit rounded-md bg-brand/10 px-2.5 py-0.5 text-xs font-bold capitalize text-brand">
                          {ev.kind}
                        </span>
                        <span className="text-xs text-ink/60">
                          {ev.format} &bull; {ev.status}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/70">
                      {ev.startDate ? (
                        <>
                          <p className="font-semibold text-ink">
                            {new Date(ev.startDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          {ev.timeLabel && <p className="text-ink/50">{ev.timeLabel}</p>}
                        </>
                      ) : ev.year ? (
                        <p className="font-semibold text-ink">{ev.year}</p>
                      ) : (
                        <p className="text-ink/45">TBA</p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        {ev.registrationUrl ? (
                          <a
                            href={ev.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand hover:bg-brand/20"
                          >
                            <span>Google Form</span>
                            <span aria-hidden="true">&nearr;</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openRegistrationsModal(ev)}
                            className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1 text-xs font-bold text-ink hover:bg-line"
                          >
                            {ev.registrationCount ?? 0} registered
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <button
                        type="button"
                        disabled={togglingId === ev.id}
                        onClick={() => handleTogglePublish(ev)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold disabled:opacity-50 ${
                          ev.isPublished
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {togglingId === ev.id
                          ? 'Updating...'
                          : ev.isPublished
                          ? 'Published'
                          : 'Draft'}
                      </button>
                    </td>

                    <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right">
                      {ev.isPublished && (
                        <Link
                          href={`/events#${ev.slug}`}
                          target="_blank"
                          className="inline-flex items-center rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-bold text-deep hover:bg-paper"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/events/${ev.id}`}
                        className="inline-flex items-center rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-bold text-ink hover:text-brand"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === ev.id}
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="cursor-pointer rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                      >
                        {deletingId === ev.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registrations Modal */}
      {regsModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand">
                  Event Registrations
                </p>
                <h2 className="text-base font-bold text-ink">{regsModalEvent.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setRegsModalEvent(null)}
                className="cursor-pointer rounded-full px-3 py-1 text-sm font-bold text-ink/60 hover:bg-paper"
              >
                &times;
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-6">
              {loadingRegs ? (
                <p className="py-8 text-center text-xs text-ink/50">Loading attendees...</p>
              ) : registrations.length === 0 ? (
                <p className="py-8 text-center text-xs text-ink/50">
                  No registrations recorded for this event yet.
                </p>
              ) : (
                <div className="divide-y divide-line">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="flex items-start justify-between gap-4 py-3.5">
                      <div>
                        <p className="text-sm font-bold text-ink">{reg.name}</p>
                        <p className="text-xs text-ink/70">
                          {reg.email}
                          {reg.phone ? ` · ${reg.phone}` : ''}
                          {reg.company ? ` · ${reg.company}` : ''}
                        </p>
                        {reg.notes && (
                          <p className="mt-1 text-xs italic text-ink/55">&ldquo;{reg.notes}&rdquo;</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteRegistration(reg.id)}
                        className="cursor-pointer rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

