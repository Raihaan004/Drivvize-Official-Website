import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { EventsClient } from '@/components/events/EventsClient';
import { getPublicEventsData } from '@/lib/eventQueries';

export const metadata: Metadata = {
  title: 'Events & Trainings | Meet Drivvize in person or online | Drivvize',
  description:
    'Our own automotive functional safety and cybersecurity trainings, workshops, and industry conferences where Drivvize speaks.',
};

async function EventsContent() {
  await connection();
  const { upcoming, past } = await getPublicEventsData();
  return <EventsClient initialUpcoming={upcoming} initialPast={past} />;
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <EventsContent />
    </Suspense>
  );
}
