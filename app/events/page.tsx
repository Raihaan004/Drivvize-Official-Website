import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { EventsClient } from '@/components/events/EventsClient';

export const metadata: Metadata = {
  title: 'Events & Trainings | Meet Drivvize in person or online | Drivvize',
  description:
    'Our own automotive functional safety and cybersecurity trainings, workshops, and industry conferences where Drivvize speaks.',
};

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <EventsClient />
    </Suspense>
  );
}
