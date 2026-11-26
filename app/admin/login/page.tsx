'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@drivvize.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (res.ok) {
          router.replace('/admin');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070B12] px-4 py-12 text-white">
      {/* Subtle architectural grid & ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 -z-10 h-[360px] w-[360px] rounded-full bg-signal/10 blur-[120px]" />

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white px-4 py-2 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <img
              src="/drivvize-logo.png"
              alt="Drivvize — Drive. Vision. Realize."
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-signal">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Control Center</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            Admin Authentication
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Sign in to manage blogs, events, monitor leads, and manage page content.
          </p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/15 p-4 text-xs font-medium text-rose-200">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/70"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@drivvize.com"
                  className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 transition-all focus:border-signal focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-signal"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/70"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-10 text-sm text-white placeholder-white/40 transition-all focus:border-signal focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-signal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/45 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-bold text-ink shadow-md transition-all hover:bg-yellow-400 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <p className="mb-1.5 text-xs text-white/50">
              Pre-filled with default administrative credentials:
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-signal">
              <span>admin@drivvize.com</span>
              <span className="text-white/30">&bull;</span>
              <span>admin123</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Drivvize Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
