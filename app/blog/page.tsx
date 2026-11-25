import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getPublishedBlogRows } from '@/lib/blogQueries';
import { BlogListClient } from '@/components/blog/BlogListClient';

export const metadata: Metadata = {
  title: 'Engineering Blog & Technical Insights | Drivvize',
  description:
    'In-depth technical articles on ISO 26262 functional safety, ISO/SAE 21434 automotive cybersecurity, SOTIF methodologies, and Software-Defined Vehicle engineering.',
};

export default async function BlogIndexPage() {
  await connection();
  const formattedBlogs = await getPublishedBlogRows();

  return <BlogListClient initialBlogs={formattedBlogs} />;
}
