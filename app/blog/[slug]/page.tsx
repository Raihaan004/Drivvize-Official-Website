import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogs } from '@/lib/db/schema';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { ArticleContent } from '@/components/blog/ArticleContent';


import {
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [blog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);

    if (!blog || !blog.isPublished) {
      return { title: 'Article Not Found | Drivvize' };
    }

    return {
      title: `${blog.title} | Drivvize Engineering`,
      description:
        blog.excerpt ||
        'Automotive functional safety and cybersecurity intelligence from Drivvize.',
      openGraph: {
        title: blog.title,
        description: blog.excerpt || '',
        images: blog.coverImage ? [blog.coverImage] : [],
      },
    };
  } catch {
    return { title: 'Engineering Insights | Drivvize' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let blog = null;
  try {
    const [result] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);

    if (result && result.isPublished) {
      blog = result;
      // Increment views
      await db
        .update(blogs)
        .set({ views: sql`${blogs.views} + 1` })
        .where(eq(blogs.id, result.id));
    }
  } catch (error) {
    console.error('Failed to query blog by slug:', error);
  }

  if (!blog) {
    notFound();
  }

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <div className="relative min-h-screen bg-white">
      <AmbientGlow />
      <TechnicalGrid />

      <main className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all publications</span>
          </Link>
        </div>

        {/* Header Block */}
        <header className="pb-8 border-b border-line">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-paper text-deep border border-line">
              {blog.category}
            </span>
            <span className="text-xs text-ink/40 font-mono">
              &bull; {blog.views + 1} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink font-heading leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 text-lg sm:text-xl text-ink/70 leading-relaxed font-sans">
              {blog.excerpt}
            </p>
          )}

          {/* Author & Timestamp Bar */}
          <div className="mt-8 pt-6 border-t border-line/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-deep text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{blog.author}</p>
                <p className="text-xs text-ink/50">Drivvize Engineering Practice</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-ink/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime || '5 min read'}
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="my-8 rounded-2xl overflow-hidden border border-line shadow-sm">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="mt-10">
          <ArticleContent content={blog.content} />
        </div>

        {/* Author Bio Box */}
        <section className="mt-16 p-6 sm:p-8 rounded-2xl bg-paper/60 border border-line flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-deep text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm">
            {blog.author.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-deep/70">
              Authored By
            </span>
            <h3 className="text-lg font-extrabold text-ink mt-0.5">{blog.author}</h3>
            <p className="text-xs sm:text-sm text-ink/70 mt-2 leading-relaxed">
              Specialist in automotive system safety, ISO 26262 ASIL decompositions, ISO/SAE 21434 threat analysis, and Software-Defined Vehicle validation at Drivvize.
            </p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
              <Link
                href="/contact"
                className="text-xs font-bold text-deep hover:underline flex items-center gap-1"
              >
                <span>Request technical consult</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="mt-12 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#1D3F6E] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-signal mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Automotive Safety Acceleration</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Ready to accelerate your vehicle safety program?
            </h3>
            <p className="text-sm text-white/80 mt-3 leading-relaxed">
              Discover Drivvize ISO 26262 Toolkits or partner directly with our automotive functional safety and cybersecurity engineers.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-xl bg-signal hover:bg-signal/90 text-ink font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Explore Toolkits
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors"
              >
                Book Engineering Consult
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
