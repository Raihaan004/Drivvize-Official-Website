'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { Clock, Eye, User, ArrowRight, Search, BookOpen } from 'lucide-react';

interface BlogItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string;
  readTime: string | null;
  coverImage: string | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

interface BlogListClientProps {
  initialBlogs: BlogItem[];
}

const CATEGORIES = [
  'All Articles',
  'Functional Safety',
  'Automotive Cybersecurity',
  'SOTIF',
  'ADAS & Autonomous',
  'Software-Defined Vehicles (SDV)',
];

export function BlogListClient({ initialBlogs }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All Articles' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(q)) ||
        blog.author.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [initialBlogs, selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-screen bg-white">
      <AmbientGlow />
      <TechnicalGrid />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper border border-line text-xs font-semibold text-deep mb-6">
            <span className="w-2 h-2 rounded-full bg-signal" />
            <span>DRIVVIZE ENGINEERING PUBLICATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink font-heading leading-[1.1]">
            Engineering Insights & Automotive Safety Intelligence
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-ink/70 leading-relaxed font-sans">
            Authoritative perspectives on ISO 26262 functional safety, ISO/SAE 21434 automotive cybersecurity, SOTIF methodologies, and Software-Defined Vehicle architectures.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-paper text-ink/70 hover:text-ink hover:bg-paper/80 border border-line'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:w-72">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-line bg-paper/50 text-ink placeholder:text-ink/40 focus:outline-none focus:bg-white focus:border-deep transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="relative pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredBlogs.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-paper/50 border border-line">
            <BookOpen className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-ink">No articles found</h3>
            <p className="text-sm text-ink/60 mt-1 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'All Articles'
                ? 'Try adjusting your search criteria or selecting a different category.'
                : 'No published articles available right now. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col bg-white rounded-2xl border border-line overflow-hidden shadow-xs hover:shadow-md hover:border-deep/30 transition-all duration-300"
              >
                {/* Cover Image (or styled fallback banner) */}
                <Link
                  href={`/blog/${blog.slug}`}
                  className="relative h-48 w-full bg-gradient-to-br from-deep/10 via-paper to-white overflow-hidden block"
                >
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-end p-6 bg-gradient-to-br from-[#0B2545]/10 via-[#2563EB]/5 to-transparent">
                      <div className="text-[11px] font-mono font-bold tracking-widest text-deep uppercase opacity-60">
                        {blog.category}
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-xs text-ink shadow-xs border border-line/60">
                      {blog.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta bar */}
                    <div className="flex items-center gap-3 text-xs text-ink/50 mb-3 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime || '5 min read'}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {blog.views} views
                      </span>
                    </div>

                    <Link href={`/blog/${blog.slug}`} className="block group-hover:text-deep transition-colors">
                      <h2 className="text-xl font-extrabold text-ink font-heading leading-snug line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    {blog.excerpt && (
                      <p className="mt-3 text-xs sm:text-sm text-ink/65 leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Footer Author & Link */}
                  <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-paper flex items-center justify-center text-ink/60 border border-line">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-semibold text-ink/80">
                        {blog.author}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-deep group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
