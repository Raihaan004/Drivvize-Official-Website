'use client';

import React, { useState } from 'react';
import { Reveal } from '@/components/premium-home/hooks';
import { LEARN_RESOURCES, type LearnResource } from '@/constants/learnResources';

const RESOURCE_IMAGES: Record<string, string> = {
  'iso-26262-seooc': '/images/learn_img/download_img/training.jpg',
  'v2x-whitepaper': '/images/learn_img/download_img/vehicle-to-everything.jpg',
  'eu-cra-intro': '/images/learn_img/download_img/cyber-act.jpg',
};

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="10" viewBox="0 0 18 10" className={className}>
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

function DownloadCard({ item, i }: { item: LearnResource; i: number }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const image = RESOURCE_IMAGES[item.id] ?? '/images/learn_img/download_img/training.jpg';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/learn/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          fileId: item.id,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.success) {
        setError(data.error || 'Could not send the publication. Please try again.');
        return;
      }

      setSentMessage(
        data.message ||
          `We've sent "${item.title}" directly to ${trimmed}. Please check your inbox shortly.`,
      );
    } catch {
      setError('Network error while sending the document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Reveal delay={(i % 3) * 100}>
      <article className="group flex h-full flex-col bg-white ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-ink/10">
        <div className="relative aspect-[16/9] overflow-hidden bg-deep">
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col p-7">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
            {item.field}
          </p>
          <h3 className="text-2xl font-light tracking-tight">{item.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/60">{item.description}</p>

          <div className="mt-auto pt-7">
            {sentMessage ? (
              <div className="rounded-xl border border-deep/15 bg-paper p-4">
                <p className="text-[14px] font-semibold leading-relaxed text-deep">{sentMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSentMessage(null);
                    setEmail('');
                    setOpen(false);
                  }}
                  className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-ink/55 transition-colors hover:text-ink"
                >
                  Send to another email
                </button>
              </div>
            ) : open ? (
              <form onSubmit={submit} noValidate>
                <label htmlFor={`dl-${item.id}`} className="sr-only">
                  Email id
                </label>
                <div
                  className={`flex items-center gap-2 border-b ${
                    error ? 'border-red-500' : 'border-ink/25 focus-within:border-ink'
                  }`}
                >
                  <input
                    id={`dl-${item.id}`}
                    type="email"
                    autoFocus
                    disabled={submitting}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email id"
                    className="w-full bg-transparent py-3 text-[15px] outline-none placeholder:text-ink/30 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 rounded-full bg-ink px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Sending…' : 'Download'}
                  </button>
                </div>
                <p className="min-h-5 pt-1.5 text-xs font-medium text-red-600">{error}</p>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/b flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-deep"
              >
                Download
                <Arrow className="transition-transform group-hover/b:translate-x-1.5" />
              </button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function DownloadsSection() {
  return (
    <section id="downloads" className="scroll-mt-32 bg-paper py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-20">
          <p className="eyebrow mb-6 text-brand">Downloads</p>
          <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
            Take it <b>with you.</b>
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/60">
            Enter your email id and we will send the PDF publication straight to your inbox.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {LEARN_RESOURCES.map((resource, i) => (
            <DownloadCard key={resource.id} item={resource} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

