'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@drivvize.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated
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
    <div className="min-h-screen bg-ink text-white flex flex-col justify-center items-center px-4 py-12 relative isolate overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-signal/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white px-4 py-2 rounded-2xl border border-white/20 shadow-md mb-6 hover:shadow-lg transition-all"
          >
            <img
              src="/drivvize-logo.png"
              alt="Drivvize — Drive. Vision. Realize."
              className="h-9 w-auto object-contain"
            />
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-signal mb-2">
            Control Center
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Admin Authentication
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Sign in to manage blogs, monitor leads, and manage page content.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-300 flex items-start gap-2.5">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@drivvize.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-bold text-ink transition-all hover:bg-yellow-400 focus:outline-none active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-ink" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-white/50 mb-1">
              Pre-filled with default administrative credentials:
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-mono text-signal">
              <span>admin@drivvize.com</span>
              <span className="text-white/30">&bull;</span>
              <span>admin123</span>
            </div>
          </div>
        </div>

        {/* Back to main site link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Drivvize Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
