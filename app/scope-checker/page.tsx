import type { Metadata } from 'next';
import { ScopeCheckerClient } from '@/components/scope-checker/ScopeCheckerClient';

export const metadata: Metadata = {
  title: 'EU CRA Scope Checker | Drivvize',
  description:
    'Interactive EU Cyber Resilience Act (Regulation (EU) 2024/2847) scope checker with product catalog lookup, screening wizard, timeline, and Annex III/IV classification.',
};

export default function ScopeCheckerPage() {
  return <ScopeCheckerClient />;
}

