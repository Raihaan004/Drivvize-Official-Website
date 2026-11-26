'use client';

import React from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { Reveal } from '@/components/premium-home/hooks';
import { formatBlogDate, mergeBlogCards } from '@/lib/blogConstants';
import type { PublicAuthorProfile } from '@/lib/blogQueries';
import PostCard from '@/components/learn/PostCard';

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export function AuthorProfileClient({ profile }: { profile: PublicAuthorProfile }) {
  const posts = mergeBlogCards(profile.posts);
  const joinDateLabel = formatBlogDate(profile.joinedAt);
  const linkedinHref = profile.linkedinUrl || 'https://www.linkedin.com/company/drivvize/';
  const bannerColor = profile.avatarColor || '#1d3f6e';

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav forceSolid />

      <main id="main-content" className="pt-20 sm:pt-24">
        <section className="mx-auto max-w-[1160px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2.5 text-[13px] font-bold text-ink/60 transition-colors hover:text-ink"
            >
              <svg width="18" height="10" viewBox="0 0 18 10" className="rotate-180">
                <path
                  d="M0 5h16M12 1l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              <span>All articles</span>
            </Link>
          </div>

          {/* Profile Card Shell matching editorial profile layout */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
            {/* Colored Hero Banner */}
            <div
              className="relative px-6 py-10 text-white sm:px-10 sm:py-12"
              style={{
                background: `linear-gradient(135deg, ${bannerColor} 0%, #0a1018 140%)`,
              }}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-24 w-24 shrink-0 rounded-full border-4 border-white/25 object-cover shadow-lg sm:h-28 sm:w-28"
                    />
                  ) : (
                    <div
                      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/25 text-3xl font-bold tracking-tight text-white shadow-lg sm:h-28 sm:w-28"
                      style={{ backgroundColor: bannerColor }}
                    >
                      {getInitials(profile.name)}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-2xl font-medium tracking-tight text-white sm:text-4xl">
                        {profile.name}
                      </h1>
                      {profile.role && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[11px] font-bold tracking-wide text-white/95">
                          {profile.role === 'Owner' ? 'Admin' : profile.role}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-medium text-white/85 sm:text-base">
                      {profile.title}
                    </p>
                  </div>
                </div>

                {/* LinkedIn Action Button (instead of Follow) */}
                <div className="shrink-0">
                  <a
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with ${profile.name} on LinkedIn`}
                    className="inline-flex items-center gap-2.5 rounded-lg border border-white/55 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-xs transition-all hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:shadow-md"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Tab Bar */}
            <div className="border-b border-line px-6 sm:px-10">
              <div className="flex items-center gap-6">
                <span
                  className="inline-block border-b-2 py-4 text-sm font-bold text-deep"
                  style={{ borderColor: bannerColor }}
                >
                  Profile
                </span>
              </div>
            </div>

            {/* Profile Details + Posts */}
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div>
                <h2 className="text-2xl font-light tracking-tight text-deep">Profile</h2>
                {joinDateLabel && (
                  <p className="mt-2.5 text-sm font-medium text-ink/65">
                    Join date: <span className="text-ink/85">{joinDateLabel}</span>
                  </p>
                )}
                {profile.bio && (
                  <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink/75">
                    {profile.bio}
                  </p>
                )}
              </div>

              <hr className="my-8 border-line" />

              <div>
                <div className="mb-8 flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-light tracking-tight text-deep">
                    Posts{' '}
                    <span className="text-sm font-bold text-ink/45">({posts.length})</span>
                  </h2>
                </div>

                {posts.length === 0 ? (
                  <div className="rounded-xl border border-line bg-paper px-6 py-12 text-center">
                    <p className="text-base font-light text-ink">
                      No published articles by {profile.name} yet.
                    </p>
                    <Link
                      href="/blog"
                      className="mt-4 inline-block text-xs font-bold text-deep hover:underline"
                    >
                      Browse all Drivvize articles &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, i) => (
                      <Reveal key={post.slug} delay={(i % 3) * 90} className="h-full">
                        <PostCard post={post} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

