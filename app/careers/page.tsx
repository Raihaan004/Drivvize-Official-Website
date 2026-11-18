import type { Metadata } from 'next';
import { CareersClient } from '@/components/careers/CareersClient';

export const metadata: Metadata = {
  title: 'Careers | Help Build What Is Safe to Drive | Drivvize',
  description:
    'Share your resume with Drivvize. Work on automotive functional safety (ISO 26262), cybersecurity (ISO 21434), and safety-critical vehicle programs.',
};

export default function CareersPage() {
  return <CareersClient />;
}

