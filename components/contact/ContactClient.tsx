'use client';

import React, { useState, type ReactNode } from 'react';
import Link from 'next/link';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { Photo, Reveal } from '@/components/premium-home/hooks';

const EMAIL = 'consult@drivvize.com';
const PHONE_DISPLAY = '+91 91500 19689';
const PHONE_HREF = 'tel:+919150019689';

type Values = {
  first: string;
  last: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const EMPTY: Values = {
  first: '',
  last: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {};
  if (!v.first.trim()) e.first = 'Please enter your first name';
  if (!v.last.trim()) e.last = 'Please enter your last name';
  if (!v.email.trim()) e.email = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = 'Please enter a valid email address';
  if (!v.phone.trim()) e.phone = 'Please enter your phone number';
  else if (v.phone.replace(/\D/g, '').length < 7 || !/^[+\d\s()-]+$/.test(v.phone.trim()))
    e.phone = 'Please enter a valid phone number';
  if (!v.message.trim()) e.message = 'Please tell us a little about your requirement';
  return e;
}

const Icon = {
  phone: (
    <path d="M5 4h3l1.5 4-2 1.2a11 11 0 005.3 5.3L14 12.5l4 1.5v3a2 2 0 01-2 2A13 13 0 013 6a2 2 0 012-2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
};

const Svg = ({ d }: { d: ReactNode }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

function Field({
  id,
  label,
  optional,
  icon,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  icon: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 flex items-baseline gap-2 text-[13px] font-bold text-ink">
        {label}
        {optional ? (
          <span className="text-xs font-medium text-ink/45">(Optional)</span>
        ) : (
          <span className="text-red-600">*</span>
        )}
      </label>
      <div
        className={`group relative flex items-start gap-3 border-b transition-colors ${
          error ? 'border-red-500' : 'border-ink/20 focus-within:border-ink'
        }`}
      >
        <span
          className={`mt-[14px] shrink-0 transition-colors ${
            error ? 'text-red-500' : 'text-ink/35 group-focus-within:text-deep'
          }`}
        >
          {icon}
        </span>
        {children}
        <span className="absolute -bottom-px left-0 h-[2px] w-0 bg-signal transition-all duration-500 group-focus-within:w-full" />
      </div>
      <p
        className={`min-h-5 pt-1.5 text-xs font-medium text-red-600 transition-opacity ${
          error ? 'opacity-100' : 'opacity-0'
        }`}
        role={error ? 'alert' : undefined}
      >
        {error || '.'}
      </p>
    </div>
  );
}

const inputClass = 'w-full bg-transparent py-3 text-[16px] text-ink outline-none placeholder:text-ink/30';

export function ContactClient() {
  const [v, setV] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const errors = validate(v);
  const show = (k: keyof Values) => ((touched[k] || submitted) && errors[k] ? errors[k] : undefined);

  const bind = (k: keyof Values) => ({
    id: k,
    name: k,
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setV({ ...v, [k]: e.target.value }),
    onBlur: () => setTouched({ ...touched, [k]: true }),
    'aria-invalid': Boolean(show(k)),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      document.getElementById(Object.keys(errors)[0])?.focus();
      return;
    }

    // Persist to Neon Postgres backend in background
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: v.first.trim(),
          lastName: v.last.trim(),
          email: v.email.trim(),
          phone: v.phone.trim(),
          companyName: v.company.trim(),
          message: v.message.trim(),
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }

    const body = [
      `Name: ${v.first.trim()} ${v.last.trim()}`,
      `Email: ${v.email.trim()}`,
      `Phone: ${v.phone.trim()}`,
      ...(v.company.trim() ? [`Company: ${v.company.trim()}`] : []),
      '',
      v.message.trim(),
    ].join('\n');
    const subject = `Website enquiry from ${v.first.trim()} ${v.last.trim()}${
      v.company.trim() ? ` (${v.company.trim()})` : ''
    }`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  const reset = () => {
    setV(EMPTY);
    setTouched({});
    setSubmitted(false);
    setDone(false);
  };

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* hero */}
        <section className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-ink text-white">
          <img
            src={IMG.road}
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.85),rgba(10,16,24,0.3)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-40 pt-40 lg:px-10 lg:pb-48">
            <p className="eyebrow fade-up mb-6 text-signal">Contact us</p>
            <h1 className="title text-white max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)]">
              {['Let’s', 'talk', 'safety.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={i === 2 ? 'font-semibold text-white' : 'text-white/80'}
                    style={{ animationDelay: `${150 + i * 110}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </section>

        {/* content card overlapping hero */}
        <section className="relative z-10 -mt-28 pb-28 lg:-mt-36 lg:pb-40">
          <div className="mx-auto grid max-w-[1320px] gap-6 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
            {/* details card */}
            <Reveal className="lg:col-span-5">
              <div className="flex h-full flex-col bg-ink p-8 text-white lg:p-12">
                <h2 className="title text-white text-4xl">
                  Contact <b>us</b>
                </h2>

                <ul className="mt-10 space-y-4">
                  {[
                    { k: 'Phone', val: PHONE_DISPLAY, href: PHONE_HREF, icon: Icon.phone },
                    { k: 'Email', val: EMAIL, href: `mailto:${EMAIL}`, icon: Icon.mail },
                  ].map((r) => (
                    <li key={r.k}>
                      <a
                        href={r.href}
                        className="group flex items-center gap-5 border border-white/15 p-5 transition-colors hover:border-signal hover:bg-white/[0.04]"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-signal transition-transform duration-500 group-hover:scale-110">
                          <Svg d={r.icon} />
                        </span>
                        <span className="min-w-0">
                          <span className="eyebrow block !text-[11px] text-white/50">{r.k}</span>
                          <span className="block truncate text-xl font-medium tracking-tight">
                            {r.val}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="mt-10 max-w-sm text-[15px] leading-relaxed text-white/60">
                  Tell us about your project, product inquiry, or training requirements.
                </p>
                <Link
                  href="/careers"
                  className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal"
                >
                  Looking for a career? Submit your resume
                </Link>

                <Photo
                  src={IMG.engineer}
                  alt="Engineer working at a laptop"
                  className="mt-10 aspect-[4/3] w-full lg:mt-auto"
                  speed={0.05}
                />
              </div>
            </Reveal>

            {/* form card */}
            <Reveal className="lg:col-span-7" delay={120}>
              <div className="relative bg-white p-8 shadow-2xl shadow-ink/10 ring-1 ring-ink/5 lg:p-14">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-sky to-signal" />

                {done ? (
                  <div className="flex min-h-[520px] flex-col items-start justify-center">
                    <span className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-signal text-ink">
                      <svg width="26" height="26" viewBox="0 0 12 12">
                        <path
                          d="M2 6.4l2.6 2.6L10 3.4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </span>
                    <h2 className="title text-4xl">
                      Thank you, <b>{v.first.trim()}.</b>
                    </h2>
                    <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/65">
                      Your email app has opened with your message ready to send to {EMAIL}. Just press
                      send there. If nothing opened, write to us directly at{' '}
                      <a
                        href={`mailto:${EMAIL}`}
                        className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                      >
                        {EMAIL}
                      </a>
                      .
                    </p>
                    <button
                      onClick={reset}
                      className="mt-10 rounded-full border border-ink px-6 py-3 text-[14px] font-bold transition-colors hover:bg-ink hover:text-white"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <h2 className="title text-4xl">
                      Send Us a <b>Message</b>
                    </h2>
                    <p className="mb-10 mt-3 text-[15px] text-ink/60">
                      Fill in your details below and click Submit to notify our team.
                    </p>

                    <div className="grid gap-x-10 sm:grid-cols-2">
                      <Field
                        id="first"
                        label="First Name"
                        icon={<Svg d={Icon.user} />}
                        error={show('first')}
                      >
                        <input
                          {...bind('first')}
                          className={inputClass}
                          placeholder="Enter your first name"
                          autoComplete="given-name"
                        />
                      </Field>
                      <Field
                        id="last"
                        label="Last Name"
                        icon={<Svg d={Icon.user} />}
                        error={show('last')}
                      >
                        <input
                          {...bind('last')}
                          className={inputClass}
                          placeholder="Enter your last name"
                          autoComplete="family-name"
                        />
                      </Field>
                      <Field
                        id="email"
                        label="Gmail ID"
                        icon={<Svg d={Icon.mail} />}
                        error={show('email')}
                      >
                        <input
                          {...bind('email')}
                          type="email"
                          className={inputClass}
                          placeholder="yourname@gmail.com"
                          autoComplete="email"
                        />
                      </Field>
                      <Field
                        id="phone"
                        label="Phone No."
                        icon={<Svg d={Icon.phone} />}
                        error={show('phone')}
                      >
                        <input
                          {...bind('phone')}
                          type="tel"
                          className={inputClass}
                          placeholder="+91 98765 43210"
                          autoComplete="tel"
                        />
                      </Field>
                      <Field
                        id="company"
                        label="Company Name"
                        optional
                        icon={<Svg d={Icon.building} />}
                        className="sm:col-span-2"
                      >
                        <input
                          {...bind('company')}
                          className={inputClass}
                          placeholder="Enter your company name (optional)"
                          autoComplete="organization"
                        />
                      </Field>
                      <Field
                        id="message"
                        label="Message"
                        icon={<Svg d={Icon.chat} />}
                        error={show('message')}
                        className="sm:col-span-2"
                      >
                        <textarea
                          {...bind('message')}
                          rows={5}
                          className={`${inputClass} resize-none`}
                          placeholder="Tell us about your project, product inquiry, or training requirements..."
                        />
                      </Field>
                    </div>

                    <button
                      type="submit"
                      className="group mt-4 inline-flex items-center gap-3 rounded-full bg-signal px-9 py-4 text-[15px] font-bold text-ink transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      Submit
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        <path d="M21 3L3 10.5l7 3 3 7z" />
                        <path d="M10 13.5L21 3" />
                      </svg>
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ContactClient;
