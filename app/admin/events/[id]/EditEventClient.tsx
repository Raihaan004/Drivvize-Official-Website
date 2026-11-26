'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EventEditorForm } from '@/components/admin/EventEditorForm';
import type { DbEventSerialized } from '@/lib/eventConstants';

export function EditEventClient({ eventId }: { eventId: string }) {
  const [eventData, setEventData] = useState<DbEventSerialized | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let mounted = true;
    fetch(`/api/admin/events/${eventId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load event');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data?.success && data.event) {
          setEventData(data.event as DbEventSerialized);
        } else {
          setError(data?.error || 'Event not found');
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Could not load event');
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
          Loading Event #{eventId}...
        </p>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-bold text-rose-800">{error || 'Event not found'}</p>
        <Link
          href="/admin/events"
          className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-xs font-bold text-white"
        >
          Back to all events
        </Link>
      </div>
    );
  }

  return <EventEditorForm mode="edit" eventId={eventId} initialData={eventData} />;
}

