import type { Metadata } from 'next';
import { ServicesClient } from '@/components/services/ServicesClient';

export const metadata: Metadata = {
  title: 'Services | Functional Safety, Cybersecurity & Trainings | Drivvize',
  description:
    'Explore Drivvize Functional Safety Services (ISO 26262), Cybersecurity Services (ISO/SAE 21434 & EU-CRA), and technical practitioner certification trainings.',
};

export default function ServicesPage() {
  return <ServicesClient />;
}
