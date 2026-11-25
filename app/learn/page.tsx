import type { Metadata } from 'next';
import { LearnClient } from '@/components/learn/LearnClient';
import { getCachedFsfArticles } from '@/lib/functionalsafetyfirst';

export const metadata: Metadata = {
  title: 'Learn & Publications | Whitepapers, ISO 26262 SEooC & EU CRA Guides | Drivvize',
  description:
    'Download authoritative automotive engineering whitepapers and guides: ISO 26262 SEooC Functional Safety Training, Vehicle-to-Everything (V2X) architecture, and EU Cyber Resilience Act (CRA) compliance.',
};

export default async function LearnPage() {
  const initialKnowledge = await getCachedFsfArticles(4);

  return <LearnClient initialKnowledge={initialKnowledge} />;
}
