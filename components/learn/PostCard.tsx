'use client'

import Link from 'next/link'
import { readMinutes, type Post } from './learn-data'

export default function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block ${large ? 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-14' : ''}`}
    >
      <div className={`relative overflow-hidden bg-deep ${large ? 'aspect-[16/10] lg:col-span-7' : 'aspect-[4/3]'}`}>
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
          {post.category}
        </span>
        <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
      </div>
      <div className={large ? 'mt-8 lg:col-span-5 lg:mt-0' : 'mt-6'}>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/45">
          {readMinutes(post)} min read
        </p>
        <h3
          className={`font-light tracking-tight transition-colors group-hover:text-deep ${
            large ? 'text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1]' : 'text-2xl leading-snug'
          }`}
        >
          {post.title}
        </h3>
        <p className={`mt-4 leading-relaxed text-ink/60 ${large ? 'text-[16px]' : 'text-[15px]'}`}>
          {post.excerpt}
        </p>
        <span className="mt-6 inline-flex items-center gap-3 text-[13px] font-bold">
          Read article
          <svg width="18" height="10" viewBox="0 0 18 10" className="transition-transform group-hover:translate-x-1.5">
            <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

