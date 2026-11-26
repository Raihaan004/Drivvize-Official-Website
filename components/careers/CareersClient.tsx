'use client';

import React, { useRef, useState, type ReactNode } from 'react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { IMG } from '@/components/premium-home/data';
import { CountUp, Reveal } from '@/components/premium-home/hooks';

const ENDPOINT = process.env.NEXT_PUBLIC_CAREERS_ENDPOINT || '/api/careers';
const MAX_MB = 5;
const ACCEPT = '.pdf,.doc,.docx';
const AREAS = [
  'Functional Safety',
  'Cybersecurity',
  'Systems engineering',
  'Software',
  'Hardware',
  'Training',
  'Open to any area',
];

const SYSTEMS = [
  'Steer-by-wire',
  'Brake-by-wire',
  'ADAS Controllers',
  'Radars',
  'Front Camera',
  'Battery Management Systems',
  'Inverters',
  'Motor Control Units',
  'Instrument Clusters',
  'Cockpit domain controllers',
  'Fuel-cell compressors',
  'Electronic Parking Brakes',
];

type Values = {
  name: string;
  phone: string;
  email: string;
  area: string;
  years: string;
  consent: boolean;
};

const EMPTY: Values = {
  name: '',
  phone: '',
  email: '',
  area: '',
  years: '',
  consent: false,
};

const Arrow = ({ className = '' }: { className?: string }) => (
  <svg width="18" height="10" viewBox="0 0 18 10" className={className}>
    <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-baseline gap-2 text-[13px] font-bold text-ink">
        {label}
        {optional ? (
          <span className="text-xs font-medium text-ink/45">(Optional)</span>
        ) : (
          <span className="text-red-600">*</span>
        )}
      </label>
      <div
        className={`group relative border-b transition-colors ${
          error ? 'border-red-500' : 'border-ink/20 focus-within:border-ink'
        }`}
      >
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

const inputClass =
  'w-full bg-transparent py-3 text-[16px] text-ink outline-none placeholder:text-ink/30';

export function CareersClient() {
  const [v, setV] = useState<Values>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [drag, setDrag] = useState(false);
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<null | 'sent' | 'email'>(null);
  const [fail, setFail] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const errors: Partial<Record<keyof Values | 'file', string>> = {};
  if (!v.name.trim()) errors.name = 'Please enter your full name';
  if (!v.phone.trim()) errors.phone = 'Please enter the number HR should call';
  else if (v.phone.replace(/\D/g, '').length < 7 || !/^[+\d\s()-]+$/.test(v.phone.trim()))
    errors.phone = 'Please enter a valid phone number';
  if (!v.email.trim()) errors.email = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    errors.email = 'Please enter a valid email address';
  if (!v.area) errors.area = 'Please choose an area of interest';
  if (!file) errors.file = 'Please attach your resume';
  if (!v.consent) errors.consent = 'Please confirm so we can store your resume and call you';
  const show = (k: keyof typeof errors) => (tried ? errors[k] : undefined);

  const pick = (f?: File | null) => {
    setFileError('');
    if (!f) return;
    const ok = /\.(pdf|docx?)$/i.test(f.name);
    if (!ok) {
      setFileError('Please upload a PDF, DOC or DOCX file');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_MB} MB`);
      return;
    }
    setFile(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    setFail('');
    const first = Object.keys(errors)[0];
    if (first) {
      document.getElementById(first === 'file' ? 'resume' : first)?.focus();
      return;
    }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append('name', v.name.trim());
      fd.append('phone', v.phone.trim());
      fd.append('email', v.email.trim());
      fd.append('area', v.area);
      fd.append('years', v.years.trim());
      fd.append('consent', String(v.consent));
      fd.append('resume', file!);
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        throw new Error(
          data?.error || 'We could not save your resume just now. Please try again in a moment.',
        );
      }
      setDone('sent');
    } catch (err) {
      setFail(
        err instanceof Error
          ? err.message
          : 'We could not send your resume just now. Please try again in a moment.',
      );
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setV(EMPTY);
    setFile(null);
    setTried(false);
    setDone(null);
    setFail('');
  };

  const jump = () => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main id="main-content">
        {/* hero */}
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink text-white">
          <img
            src={IMG.office}
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.88),rgba(10,16,24,0.35)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Careers</p>
            <h1 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white">
              {['Help', 'build', 'what', 'is', 'safe', 'to', 'drive.'].map((w, i) => (
                <span key={i} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 0 || i === 4 ? 'font-semibold text-white' : 'text-white/80'
                    }
                    style={{ animationDelay: `${150 + i * 90}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-up mt-8 max-w-lg text-[17px] leading-relaxed text-white/75"
              style={{ animationDelay: '0.9s' }}
            >
              Share your resume with us. Our HR team will call you whenever there is a role that
              fits.
            </p>
            <div className="fade-up mt-10" style={{ animationDelay: '1.1s' }}>
              <button
                type="button"
                onClick={jump}
                className="group inline-flex items-center gap-3 rounded-full bg-signal px-7 py-4 text-[14px] font-bold text-ink transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Submit your resume
                <Arrow className="transition-transform group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>
        </section>

        {/* how it works */}
        <section className="py-28 lg:py-40">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-16 lg:mb-24">
              <p className="eyebrow mb-6 text-brand">How it works</p>
              <h2 className="title text-[clamp(2.4rem,5.4vw,4.8rem)]">
                One form. <b>We call you.</b>
              </h2>
            </Reveal>
            <div className="grid border-t border-ink/10 md:grid-cols-3">
              {[
                [
                  'Submit your resume',
                  'Tell us a little about yourself and upload your resume. It takes about two minutes.',
                ],
                [
                  'We keep it on file',
                  'Your resume stays with our HR team, so there is no need to watch for openings.',
                ],
                [
                  'HR calls you',
                  'When a role matches your profile, HR will call you on the number you share.',
                ],
              ].map(([t, d], i) => (
                <Reveal
                  key={t}
                  delay={i * 110}
                  className="border-b border-ink/10 py-10 md:border-b-0 md:pr-10 md:[&:not(:last-child)]:border-r md:[&:not(:first-child)]:pl-10"
                >
                  <p className="title mb-6 text-6xl !font-extralight text-deep">0{i + 1}</p>
                  <h3 className="text-2xl font-light tracking-tight">{t}</h3>
                  <p className="mt-3 max-w-xs text-[15.5px] leading-relaxed text-ink/60">{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* what you'll work on */}
        <section className="bg-ink py-28 text-white lg:py-40">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-6">
                <Reveal>
                  <p className="eyebrow mb-6 text-signal">The work</p>
                  <h2 className="title text-[clamp(2.4rem,5.4vw,4.4rem)] text-white">
                    Safety-critical systems, <b>real programs.</b>
                  </h2>
                  <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-white/60">
                    We help Automotive OEMs and Suppliers make functional safety and cybersecurity
                    part of how products are built.
                  </p>
                </Reveal>
                <Reveal delay={100} className="mt-10 grid grid-cols-3 gap-6">
                  {[
                    [40, 'Safety Projects'],
                    [15, 'Safety critical Systems'],
                    [8, 'Regions'],
                  ].map(([n, l]) => (
                    <div key={l as string}>
                      <p className="title text-[clamp(2.4rem,4.4vw,3.8rem)] !font-extralight leading-none text-signal">
                        <CountUp to={n as number} />
                      </p>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
                        {l}
                      </p>
                    </div>
                  ))}
                </Reveal>
                <Reveal delay={200} className="mt-12 flex flex-wrap gap-2">
                  {SYSTEMS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/20 px-4 py-2 text-[13px] font-medium text-white/80 transition-colors hover:border-signal hover:text-signal"
                    >
                      {s}
                    </span>
                  ))}
                </Reveal>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:col-span-6">
                <Reveal className="mt-14">
                  <div className="aspect-[3/4] overflow-hidden bg-deep">
                    <img
                      src={IMG.whiteboard}
                      alt="Team working at a whiteboard"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105"
                    />
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <div className="aspect-[3/4] overflow-hidden bg-deep">
                    <img
                      src={IMG.laptop}
                      alt="Engineer at a laptop"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-105"
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* apply */}
        <section id="apply" className="scroll-mt-24 bg-paper py-28 lg:py-40">
          <div className="mx-auto grid max-w-[1320px] gap-14 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
            <Reveal className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow mb-6 text-brand">Apply</p>
                <h2 className="title text-[clamp(2.2rem,4.4vw,3.8rem)]">
                  Send us your <b>resume.</b>
                </h2>
                <p className="mt-6 text-[16px] leading-relaxed text-ink/60">
                  HR will call you whenever there is a role that fits. You do not need to pick a
                  specific job.
                </p>
                <ul className="mt-8 space-y-3 text-[15px] text-ink/70">
                  {[
                    'PDF, DOC or DOCX, up to 5 MB',
                    'Use a phone number HR can reach you on',
                    'Your resume is used only for hiring',
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <i className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-signal" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-8" delay={120}>
              <div className="relative bg-white p-8 shadow-2xl shadow-ink/10 ring-1 ring-ink/5 sm:p-12 lg:p-14">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-sky to-signal" />

                {done ? (
                  <div className="flex min-h-[480px] flex-col items-start justify-center">
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
                      Thank you, <b>{v.name.trim().split(' ')[0]}.</b>
                    </h2>
                    {done === 'sent' ? (
                      <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/65">
                        We have received your resume. Our HR team will call you on {v.phone.trim()}{' '}
                        whenever there is a role that fits.
                      </p>
                    ) : (
                      <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/65">
                        Your email app has opened with your details. Please attach{' '}
                        <b className="font-semibold text-ink">{file?.name}</b> and press send. HR
                        will then call you on {v.phone.trim()} whenever there is a role that fits.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-10 rounded-full border border-ink px-6 py-3 text-[14px] font-bold transition-colors hover:bg-ink hover:text-white cursor-pointer"
                    >
                      Submit another resume
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <div className="grid gap-x-10 sm:grid-cols-2">
                      <Field id="name" label="Full Name" error={show('name')}>
                        <input
                          id="name"
                          value={v.name}
                          onChange={(e) => setV({ ...v, name: e.target.value })}
                          className={inputClass}
                          placeholder="Enter your full name"
                          autoComplete="name"
                        />
                      </Field>
                      <Field id="phone" label="Phone No." error={show('phone')}>
                        <input
                          id="phone"
                          type="tel"
                          value={v.phone}
                          onChange={(e) => setV({ ...v, phone: e.target.value })}
                          className={inputClass}
                          placeholder="+91 98765 43210"
                          autoComplete="tel"
                        />
                      </Field>
                      <Field id="email" label="Email ID" error={show('email')}>
                        <input
                          id="email"
                          type="email"
                          value={v.email}
                          onChange={(e) => setV({ ...v, email: e.target.value })}
                          className={inputClass}
                          placeholder="yourname@email.com"
                          autoComplete="email"
                        />
                      </Field>
                      <Field id="area" label="Area of interest" error={show('area')}>
                        <select
                          id="area"
                          value={v.area}
                          onChange={(e) => setV({ ...v, area: e.target.value })}
                          className={`${inputClass} cursor-pointer ${
                            v.area ? '' : 'text-ink/30'
                          }`}
                        >
                          <option value="">Select an area</option>
                          {AREAS.map((a) => (
                            <option key={a} value={a} className="text-ink">
                              {a}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <div className="sm:col-span-2 sm:max-w-[calc(50%-1.25rem)]">
                        <Field id="years" label="Years of experience" optional>
                          <input
                            id="years"
                            type="number"
                            min={0}
                            max={60}
                            value={v.years}
                            onChange={(e) => setV({ ...v, years: e.target.value })}
                            className={inputClass}
                            placeholder="e.g. 8"
                          />
                        </Field>
                      </div>
                    </div>

                    {/* resume */}
                    <p className="mb-2 flex items-baseline gap-2 text-[13px] font-bold">
                      Resume <span className="text-red-600">*</span>
                    </p>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDrag(true);
                      }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDrag(false);
                        pick(e.dataTransfer.files?.[0]);
                      }}
                      className={`relative border-2 border-dashed p-8 text-center transition-all duration-300 ${
                        drag
                          ? 'scale-[1.01] border-signal bg-signal/10'
                          : show('file') || fileError
                          ? 'border-red-400'
                          : file
                          ? 'border-brand bg-brand/5'
                          : 'border-ink/20 hover:border-ink/50'
                      }`}
                    >
                      <input
                        id="resume"
                        ref={fileRef}
                        type="file"
                        accept={ACCEPT}
                        onChange={(e) => pick(e.target.files?.[0])}
                        className="sr-only"
                      />
                      {file ? (
                        <div className="flex flex-wrap items-center justify-between gap-4 text-left">
                          <div className="flex items-center gap-4">
                            <span className="flex h-12 w-12 items-center justify-center bg-deep text-[11px] font-bold uppercase text-white">
                              {file.name.split('.').pop()}
                            </span>
                            <div>
                              <p className="max-w-[260px] truncate text-[15px] font-semibold">
                                {file.name}
                              </p>
                              <p className="text-xs font-medium text-ink/50">
                                {(file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              if (fileRef.current) fileRef.current.value = '';
                            }}
                            className="text-[13px] font-bold underline decoration-signal decoration-2 underline-offset-4 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="resume" className="block cursor-pointer">
                          <svg
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            className="mx-auto mb-4 text-deep"
                          >
                            <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
                          </svg>
                          <p className="text-[15px] font-semibold">
                            Drag and drop your resume here, or{' '}
                            <span className="underline decoration-signal decoration-2 underline-offset-4">
                              browse
                            </span>
                          </p>
                          <p className="mt-1 text-xs font-medium text-ink/45">
                            PDF, DOC or DOCX, up to {MAX_MB} MB
                          </p>
                        </label>
                      )}
                    </div>
                    <p className="min-h-5 pt-1.5 text-xs font-medium text-red-600" role="alert">
                      {fileError || show('file') || ' '}
                    </p>

                    <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink/70">
                      <input
                        type="checkbox"
                        checked={v.consent}
                        onChange={(e) => setV({ ...v, consent: e.target.checked })}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#0b1b33]"
                      />
                      I agree that Drivvize may keep my resume on file and that HR may call me
                      about suitable roles.
                    </label>
                    <p className="min-h-5 pt-1.5 text-xs font-medium text-red-600">
                      {show('consent') || ' '}
                    </p>

                    {fail && (
                      <p className="mb-4 border-l-[3px] border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {fail}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="group mt-2 inline-flex items-center gap-3 rounded-full bg-signal px-9 py-4 text-[15px] font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                    >
                      {sending ? 'Sending…' : 'Submit resume'}
                      {!sending && (
                        <Arrow className="transition-transform group-hover:translate-x-1.5" />
                      )}
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

export default CareersClient;

