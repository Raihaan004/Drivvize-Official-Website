'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(!isLoginPage);

  // Verify authentication unless on the login page
  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.replace('/admin/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data?.authenticated) {
          setAdminUser(data.user);
        }
        setIsVerifying(false);
      })
      .catch(() => {
        if (!isMounted) return;
        router.replace('/admin/login');
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // If on /admin/login, render without the admin sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show a clean loader while checking session
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#0a1018] text-white flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        <p className="text-xs uppercase tracking-widest text-white/50 font-bold">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  const NAV_ITEMS = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: 'Blog Posts',
      href: '/admin/blogs',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: 'Write New Blog',
      href: '/admin/blogs/new',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: 'Events',
      href: '/admin/events',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Post New Event',
      href: '/admin/events/new',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Contact Inquiries',
      href: '/admin/inquiries',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'PDF Downloads',
      href: '/admin/downloads',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
    {
      label: 'Pages Overview',
      href: '/admin/pages',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#0A1018] flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E3E6EB] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-ink/70 hover:bg-paper cursor-pointer"
            aria-label="Toggle navigation sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-lg border border-line shadow-xs">
              <img src="/drivvize-logo.png" alt="Drivvize" className="h-6 w-auto object-contain" />
            </div>
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-widest text-brand bg-brand/10 px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-ink/70 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-paper transition-colors"
          >
            <span>Live Site</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-paper px-3 py-1.5 rounded-full border border-line text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-ink truncate max-w-[140px]">
              {adminUser?.email || 'admin@drivvize.com'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#E3E6EB] p-4 shrink-0">
          <div className="space-y-1">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-ink/40">
              Management
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-ink text-white shadow-xs'
                      : 'text-ink/70 hover:text-ink hover:bg-paper'
                  }`}
                >
                  <span className={isActive ? 'text-signal' : 'text-ink/50'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats Summary Box in Sidebar */}
          <div className="mt-auto pt-6 border-t border-line">
            <div className="rounded-xl bg-paper p-3.5 border border-line text-xs">
              <div className="flex items-center justify-between text-ink/50 font-bold mb-1">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-600 font-extrabold">ONLINE</span>
              </div>
              <p className="text-[11px] text-ink/65 leading-tight">
                Neon Lakebase Postgres active. Authentication secure.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/drivvize-logo.png" alt="Drivvize" className="h-6 w-auto" />
                    <span className="text-xs font-bold text-brand uppercase tracking-wider">
                      Admin
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded text-ink/50 hover:text-ink"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-ink text-white'
                            : 'text-ink/70 hover:text-ink hover:bg-paper'
                        }`}
                      >
                        <span className={isActive ? 'text-signal' : 'text-ink/50'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-line space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="block text-center text-xs font-bold py-2 bg-paper rounded-lg text-ink"
                >
                  View Public Website &rarr;
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center text-xs font-bold py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-[1440px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a1018] text-white flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-white/50 font-bold">
            Loading Admin Console...
          </p>
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
