'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  EVENT_FORMATS,
  EVENT_IMAGE_PRESETS,
  EVENT_KINDS,
  EVENT_STATUSES,
  normalizeRegistrationUrl,
  slugifyEventTitle,
  type DbEventSerialized,
  type EventFormat,
  type EventStatus,
} from '@/lib/eventConstants';
import type { EventKind } from '@/components/events/events-data';
import { compressImageToDataUrl } from './blogEditorHelpers';

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

interface EventEditorFormProps {
  mode: 'create' | 'edit';
  eventId?: string;
  initialData?: DbEventSerialized;
}

export function EventEditorForm({ mode, eventId, initialData }: EventEditorFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');
  const [kind, setKind] = useState<EventKind>(initialData?.kind ?? 'internal');
  const [format, setFormat] = useState<EventFormat>(initialData?.format ?? 'Online');
  const [status, setStatus] = useState<EventStatus>(initialData?.status ?? 'upcoming');
  const [startDate, setStartDate] = useState(toDateTimeLocal(initialData?.startDate));
  const [endDate, setEndDate] = useState(toDateTimeLocal(initialData?.endDate));
  const [timeLabel, setTimeLabel] = useState(initialData?.timeLabel ?? '');
  const [location, setLocation] = useState(initialData?.location ?? 'Live online session');
  const [hostsText, setHostsText] = useState(
    initialData?.hosts?.join(', ') ?? 'Drivvize Engineering',
  );
  const [about, setAbout] = useState(initialData?.about ?? '');
  const [agendaText, setAgendaText] = useState(initialData?.agenda?.join('\n') ?? '');
  const [tagsText, setTagsText] = useState(initialData?.tags?.join(', ') ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');
  const [year, setYear] = useState(
    initialData?.year !== null && initialData?.year !== undefined
      ? String(initialData.year)
      : '',
  );
  const [image, setImage] = useState(initialData?.image ?? '');
  const [registrationUrl, setRegistrationUrl] = useState(initialData?.registrationUrl ?? '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);

  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugifyEventTitle(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingImage(true);
    setError(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !about.trim()) {
      setError('Event Title and About Description are required.');
      return;
    }

    const finalSlug = slugifyEventTitle(slug.trim() || title.trim());
    if (!finalSlug) {
      setError('Please enter a valid slug.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      kind,
      format,
      status,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      timeLabel: timeLabel.trim() || null,
      location: location.trim() || 'Live online session',
      hosts: hostsText
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean),
      about: about.trim(),
      agenda: agendaText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      tags: tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      role: role.trim() || null,
      year: year.trim() ? parseInt(year.trim(), 10) : null,
      image: image.trim() || null,
      registrationUrl: normalizeRegistrationUrl(registrationUrl),
      isFeatured,
      isPublished,
    };

    try {
      const endpoint =
        mode === 'edit' && eventId ? `/api/admin/events/${eventId}` : '/api/admin/events';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        event?: DbEventSerialized;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save event.');
      }

      if (mode === 'create') {
        router.push('/admin/events');
        router.refresh();
      } else {
        setSlug(data.event?.slug || finalSlug);
        setSaveSuccess('Event updated and synced to /events.');
        router.refresh();
        setTimeout(() => setSaveSuccess(null), 4000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== 'edit' || !eventId) return;
    if (!window.confirm('Are you sure you want to permanently delete this event?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE' });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete event.');
      }
      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div>
          <Link
            href="/admin/events"
            className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 transition-colors hover:text-ink"
          >
            <span>&larr; Back to all events</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              {mode === 'create' ? 'Post New Event' : 'Edit Event'}
            </h1>
            {mode === 'edit' && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                  isPublished
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {isPublished ? 'Published' : 'Draft'}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === 'edit' && slug && isPublished && (
            <Link
              href={`/events#${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink/75 shadow-xs hover:bg-paper hover:text-ink"
            >
              <span>View Live</span>
            </Link>
          )}
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="cursor-pointer rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : mode === 'create' ? 'Publish Event' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-500/25 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 font-bold">
            &times;
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          <span>{saveSuccess}</span>
          <Link href={`/events#${slug}`} target="_blank" className="underline">
            View on /events &rarr;
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., ISO 26262 Part-6 Software Safety Workshop"
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              URL Anchor / Slug *
            </label>
            <div className="flex items-center rounded-xl border border-line bg-paper px-3 py-2 text-xs focus-within:border-brand focus-within:bg-white">
              <span className="font-mono text-ink/40">/events#</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setSlug(e.target.value);
                }}
                placeholder="iso-26262-software-workshop"
                className="w-full bg-transparent pl-1 font-mono text-xs text-ink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Classification: Status, Kind, Format */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Event Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="w-full cursor-pointer rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            >
              {EVENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'upcoming' ? 'Upcoming Event' : 'Past Event'}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Event Type
            </label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as EventKind)}
              className="w-full cursor-pointer rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            >
              {EVENT_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as EventFormat)}
              className="w-full cursor-pointer rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            >
              {EVENT_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date, Time & Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Start Date &amp; Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-ink/45">Leave blank for TBA.</p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              End Date &amp; Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Display Time Label
            </label>
            <input
              type="text"
              value={timeLabel}
              onChange={(e) => setTimeLabel(e.target.value)}
              placeholder="e.g., 10:00 – 13:00 IST"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Location / Venue
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Live online session"
              className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Hosts, Tags, Past Role & Year */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Conducted By / Hosts (comma-separated)
            </label>
            <input
              type="text"
              value={hostsText}
              onChange={(e) => setHostsText(e.target.value)}
              placeholder="e.g., Sowmya Radhakrishnan, Sridharan Subramani"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g., Training, ISO 26262, SEooC"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {status === 'past' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
                Role (for Past Events)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Speaker, Media partner, Host"
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-xs">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
                Year (for Past Events)
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 2026"
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* About & Agenda */}
        <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              About This Event *
            </label>
            <textarea
              rows={4}
              required
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Describe what attendees will learn, key takeaways, and who should join..."
              className="w-full rounded-xl border border-line bg-paper p-3.5 text-xs leading-relaxed text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/70">
              Agenda / Key Topics (one bullet per line, optional)
            </label>
            <textarea
              rows={4}
              value={agendaText}
              onChange={(e) => setAgendaText(e.target.value)}
              placeholder={'Why functional safety matters\nISO 26262 lifecycle overview\nQ&A with our team'}
              className="w-full rounded-xl border border-line bg-paper p-3.5 font-mono text-xs leading-relaxed text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Image & External Registration Link */}
        <div className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-xs">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">
                Event Banner / Cover Image
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-line">
                  {isUploadingImage ? 'Optimizing...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowPresetPicker((prev) => !prev)}
                  className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-line"
                >
                  {showPresetPicker ? 'Hide Presets' : 'Select Preset Image'}
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="cursor-pointer rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Paste image URL (https://...) or upload / select a preset above"
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:bg-white focus:outline-none"
            />

            {showPresetPicker && (
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-line bg-paper p-3 sm:grid-cols-4">
                {EVENT_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setShowPresetPicker(false);
                    }}
                    className={`group cursor-pointer overflow-hidden rounded-lg border text-left transition-all ${
                      image === preset.url
                        ? 'border-ink ring-2 ring-signal'
                        : 'border-line hover:border-ink/40'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-deep">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="truncate bg-white px-2 py-1.5 text-[11px] font-semibold text-ink">
                      {preset.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {image && (
              <div className="mt-3 aspect-[16/7] w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
                <img src={image} alt="Event preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-brand/20 bg-paper/60 p-4">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/80">
                Google Form Registration Link
              </label>
              {normalizeRegistrationUrl(registrationUrl) && (
                <a
                  href={normalizeRegistrationUrl(registrationUrl)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-brand hover:underline"
                >
                  Open Google Form &rarr;
                </a>
              )}
            </div>
            <input
              type="text"
              value={registrationUrl}
              onChange={(e) => setRegistrationUrl(e.target.value)}
              placeholder="https://docs.google.com/forms/d/e/.../viewform"
              className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-xs text-ink placeholder-ink/40 focus:border-brand focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-ink/55">
              Paste the Google Form URL for this event. Clicking &ldquo;Register&rdquo; on{' '}
              <code>/events</code> will send attendees directly to this Google Form (if left
              blank, the built-in registration form is used).
            </p>
          </div>
        </div>

        {/* Toggles: Featured + Published */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-6 shadow-xs">
            <div>
              <p className="text-sm font-bold text-ink">Feature as &ldquo;Next Up&rdquo; Hero</p>
              <p className="mt-0.5 text-xs text-ink/55">
                Highlights this event at the top of /events with a live countdown.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full border border-line bg-paper after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-line after:bg-white after:transition-all after:content-[''] peer-checked:bg-signal peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-6 shadow-xs">
            <div>
              <p className="text-sm font-bold text-ink">Publish Status</p>
              <p className="mt-0.5 text-xs text-ink/55">
                {isPublished
                  ? 'Visible immediately to public visitors on /events'
                  : 'Saved as draft — only visible inside Admin'}
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full border border-line bg-paper after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-line after:bg-white after:transition-all after:content-[''] peer-checked:bg-signal peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/events"
            className="rounded-full border border-line px-5 py-2.5 text-xs font-bold text-ink hover:bg-paper"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-full bg-signal px-7 py-3 text-xs font-bold text-ink shadow-xs hover:bg-yellow-400 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : mode === 'create' ? 'Publish Event' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

