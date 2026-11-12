import type { Metadata } from 'next';
import { ContactClient } from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Drivvize',
  description:
    'Contact Drivvize for Automotive Functional Safety (ISO 26262), Cybersecurity (ISO/SAE 21434 & EU-CRA), ISO 26262 Kit editions, and practitioner trainings.',
};

export default function ContactPage() {
  return <ContactClient />;
}

