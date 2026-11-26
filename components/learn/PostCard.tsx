'use client';

import Link from 'next/link';
import { formatBlogDate, slugifyBlogTitle } from '@/lib/blogConstants';
import { readMinutes, type Post } from './learn-data';

export type PostCardItem = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  author?: string;
  publishedAt?: string | null;
  blocks?: Post['blocks'];
  readTimeLabel?: string;
};

export default function PostCard({
  post,
  large = false,
  previewOnly = false,
}: {
  post: PostCardItem;
  large?: boolean;
  previewOnly?: boolean;
}) {
  const readLabel =
    post.readTimeLabel ||
    (post.blocks ? `${readMinutes(post as Post)} min read` : '5 min read');
  const publishedLabel = formatBlogDate(post.publishedAt);
  const authorName = post.author || 'Drivvize Engineering';
  const authorHref = `/blog/author/${slugifyBlogTitle(authorName)}`;
  const postHref = `/blog/${post.slug}`;

  const imageBlock = (
    <div
      className={`relative overflow-hidden bg-deep ${
        large ? 'aspect-[16/10]' : 'aspect-[4/3]'
      }`}
    >
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-xs">
        {post.category}
      </span>
      <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
    </div>
  );

  const metaBlock = (
    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.14em] text-ink/45">
      {publishedLabel && (
        <>
          <time dateTime={post.publishedAt ?? undefined}>{publishedLabel}</time>
          <span aria-hidden="true">&middot;</span>
        </>
      )}
      <span>{readLabel}</span>
    </div>
  );

  const titleAndExcerpt = (
    <>
      <h3
        className={`font-light tracking-tight transition-colors group-hover:text-deep ${
          large ? 'text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1]' : 'text-2xl leading-snug'
        }`}
      >
        {post.title}
      </h3>

      <p
        className={`mt-4 line-clamp-3 leading-relaxed text-ink/60 ${
          large ? 'text-[16px]' : 'text-[15px]'
        }`}
      >
        {post.excerpt}
      </p>
    </>
  );

  return (
    <article
      className={`group flex h-full flex-col ${
        large ? 'lg:grid lg:grid-cols-12 lg:items-center lg:gap-14' : ''
      }`}
    >
      <div className={large ? 'lg:col-span-7' : ''}>
        {previewOnly ? (
          imageBlock
        ) : (
          <Link href={postHref} className="block">
            {imageBlock}
          </Link>
        )}
      </div>

      <div className={large ? 'mt-8 flex flex-col lg:col-span-5 lg:mt-0' : 'mt-6 flex flex-1 flex-col'}>
        {metaBlock}

        {previewOnly ? (
          titleAndExcerpt
        ) : (
          <Link href={postHref} className="block">
            {titleAndExcerpt}
          </Link>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5 mt-6">
          {previewOnly ? (
            <span className="text-xs font-semibold text-ink/65">
              By <span className="font-bold text-ink">{authorName}</span>
            </span>
          ) : (
            <Link
              href={authorHref}
              className="text-xs font-semibold text-ink/65 transition-colors hover:text-deep"
            >
              By{' '}
              <span className="font-bold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-signal">
                {authorName}
              </span>
            </Link>
          )}

          {previewOnly ? (
            <span className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-4 py-1.5 text-[12px] font-bold text-ink">
              Read More
            </span>
          ) : (
            <Link
              href={postHref}
              className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-4 py-1.5 text-[12px] font-bold text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white"
            >
              Read More
              <svg
                width="16"
                height="9"
                viewBox="0 0 18 10"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M0 5h16M12 1l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
