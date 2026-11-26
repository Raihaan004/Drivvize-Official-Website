'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ExternalLink, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
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
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 hover:bg-slate-50"
          >
            <span>View Public Events</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={loadEvents}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Post New Event</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, host, location, or slug..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'upcoming', 'past'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold ${
                  statusFilter === s
                    ? 'bg-ink text-white'
                    : 'bg-slate-100 text-ink/70 hover:bg-slate-200'
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
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold ${
                  kindFilter === k
                    ? 'bg-deep text-white'
                    : 'bg-slate-100 text-ink/70 hover:bg-slate-200'
                }`}
              >
                {k === 'ALL' ? 'All Types' : k === 'internal' ? 'Internal' : 'External'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-ink/45">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span>Loading events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="mx-auto max-w-sm px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-ink/40">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-ink">No events found</h3>
            <p className="mb-5 mt-1 text-xs text-ink/60">
              Create your first event or adjust your filters.
            </p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink"
            >
              Post New Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                  <th className="px-6 py-4">Event</th>
                  <th className="px-4 py-4">Type &amp; Format</th>
                  <th className="px-4 py-4">Schedule</th>
                  <th className="px-4 py-4">Registration</th>
                  <th className="px-4 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="max-w-md px-6 py-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={ev.image || IMG.stage}
                          alt={ev.title}
                          className="h-14 w-20 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="line-clamp-1 text-sm font-bold text-ink">{ev.title}</p>
                            {ev.isFeatured && (
                              <span className="rounded-full bg-signal px-2.5 py-0.5 text-[10px] font-bold uppercase text-ink">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate font-mono text-xs text-ink/45">
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
                        <span className="inline-block w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold capitalize text-deep">
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
                          <p className="font-bold text-ink">
                            {new Date(ev.startDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          {ev.timeLabel && <p className="text-ink/50">{ev.timeLabel}</p>}
                        </>
                      ) : ev.year ? (
                        <p className="font-bold text-ink">{ev.year}</p>
                      ) : (
                        <p className="text-ink/45">TBA</p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {ev.registrationUrl ? (
                        <a
                          href={ev.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-deep hover:bg-blue-100"
                        >
                          <span>Google Form</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openRegistrationsModal(ev)}
                          className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-ink hover:bg-slate-100"
                        >
                          {ev.registrationCount ?? 0} registered
                        </button>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <button
                        type="button"
                        disabled={togglingId === ev.id}
                        onClick={() => handleTogglePublish(ev)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold disabled:opacity-50 ${
                          ev.isPublished
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            ev.isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {togglingId === ev.id
                          ? 'Updating...'
                          : ev.isPublished
                          ? 'Published'
                          : 'Draft'}
                      </button>
                    </td>

                    <td className="space-x-1.5 whitespace-nowrap px-6 py-4 text-right">
                      {ev.isPublished && (
                        <Link
                          href={`/events#${ev.slug}`}
                          target="_blank"
                          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-deep hover:bg-slate-50"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/events/${ev.id}`}
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-ink hover:bg-slate-200"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === ev.id}
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{deletingId === ev.id ? '...' : 'Delete'}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-ink px-6 py-5 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-signal">
                  Event Registrations
                </p>
                <h2 className="mt-0.5 text-base font-bold">{regsModalEvent.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setRegsModalEvent(null)}
                className="cursor-pointer rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
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
                <div className="divide-y divide-slate-100">
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
