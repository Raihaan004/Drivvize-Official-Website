import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { getBlogAuthorProfile } from '@/lib/blogQueries';
import { AuthorProfileClient } from '@/components/blog/AuthorProfileClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getBlogAuthorProfile(slug);

  if (!profile) {
    return { title: 'Author Not Found | Drivvize' };
  }

  return {
    title: `${profile.name} — Author Profile | Drivvize`,
    description:
      profile.bio ||
      `${profile.name} (${profile.title}) — Technical articles and engineering insights at Drivvize.`,
  };
}

export default async function BlogAuthorPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const profile = await getBlogAuthorProfile(slug);

  if (!profile) {
    notFound();
  }

  return <AuthorProfileClient profile={profile} />;
}

