import type { Metadata } from 'next';
import { ProductsClient } from '@/components/products/ProductsClient';

export const metadata: Metadata = {
  title: 'Products | ISO 26262 Kit Editions | Drivvize',
  description:
    'Explore Drivvize ISO 26262 Kit editions — Basic Edition, Custom Edition, and Consultant Edition — including workflows, templates, checklists, guidelines, and 1:1 consulting hours.',
};

export default function ProductsPage() {
  return <ProductsClient />;
}

