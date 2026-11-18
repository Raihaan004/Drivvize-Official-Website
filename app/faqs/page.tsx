import type { Metadata } from 'next';
import { FaqsClient } from '@/components/faqs/FaqsClient';

export const metadata: Metadata = {
  title: 'FAQs | Automotive Functional Safety & Cybersecurity | Drivvize',
  description:
    'Frequently asked questions about Drivvize services, ISO 26262 Functional Safety, ISO 21434 Cybersecurity, EU CRA compliance, SOTIF, PAS 8800 AI Safety, trainings, templates, audits, and supported ECUs.',
};

export default function FaqsPage() {
  return <FaqsClient />;
}

