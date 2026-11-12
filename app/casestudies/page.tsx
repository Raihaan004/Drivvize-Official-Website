import type { Metadata } from 'next';
import { CaseStudiesClient } from '@/components/casestudies/CaseStudiesClient';

export const metadata: Metadata = {
  title: 'Case Studies | Functional Safety & ADAS Engagements | Drivvize',
  description:
    'Explore Drivvize automotive functional safety case studies: ASIL-D Steer-by-wire, ASIL-B Electronic Park Brake, Rail-Auto OEM solution, ASIL-D AUTOSAR SW assessment, and L2+ ADAS Technical Safety Concept.',
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}

