'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Calendar,
  CalendarPlus,
  Download,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  PenSquare,
  Users,
  X,
} from 'lucide-react';

interface NavGroup {
  group: string;
  items: {
    label: string;
    href: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', Icon: LayoutDashboard }],
  },
  {
    group: 'Publishing',
    items: [
      { label: 'Blog Overview', href: '/admin/blogs/overview', Icon: BarChart3 },
      { label: 'Blog Posts', href: '/admin/blogs', Icon: Newspaper },
      { label: 'Write New Blog', href: '/admin/blogs/new', Icon: PenSquare },
      { label: 'Comments', href: '/admin/blogs/comments', Icon: MessageSquare },
      { label: 'Writers', href: '/admin/blogs/writers', Icon: Users },
      { label: 'Events', href: '/admin/events', Icon: Calendar },
      { label: 'Post New Event', href: '/admin/events/new', Icon: CalendarPlus },
    ],
  },
  {
    group: 'Leads & Site',
    items: [
      { label: 'Contact Overview', href: '/admin/inquiries', Icon: Mail },
      { label: 'Contact Inbox', href: '/admin/inquiries/inbox', Icon: Inbox },
      { label: 'Career Resumes', href: '/admin/careers', Icon: Briefcase },
      { label: 'PDF Downloads', href: '/admin/downloads', Icon: Download },
      { label: 'Pages Overview', href: '/admin/pages', Icon: FileText },
    ],
  },
];

function resolvePageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/blogs/overview') return 'Blog Overview';
  if (pathname === '/admin/blogs/comments') return 'Blog Comments';
  if (pathname === '/admin/blogs/writers') return 'Writers';
  if (pathname === '/admin/blogs/new') return 'Write New Blog';
  if (pathname.startsWith('/admin/blogs/')) return 'Edit Blog Article';
  if (pathname === '/admin/blogs') return 'Blog Articles';
  if (pathname === '/admin/events/new') return 'Post New Event';
  if (pathname.startsWith('/admin/events/')) return 'Edit Event';
  if (pathname === '/admin/events') return 'Events Manager';
  if (pathname === '/admin/careers') return 'Career Resumes';
  if (pathname === '/admin/inquiries/inbox') return 'Contact Inbox';
  if (pathname === '/admin/inquiries') return 'Contact Overview';
  if (pathname === '/admin/downloads') return 'PDF Downloads';
  if (pathname === '/admin/pages') return 'Pages Overview';
  return 'Admin Console';
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(!isLoginPage);

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

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#070B12] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  const pageTitle = resolvePageTitle(pathname);

  const renderNavLinks = (onNavigate?: () => void) => (
    <div className="space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.group}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            {group.group}
          </p>
          <div className="space-y-1">
            {group.items.map(({ label, href, Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all ${
                    isActive
                      ? 'bg-white/10 text-white shadow-xs ring-1 ring-white/10'
                      : 'text-white/65 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-signal" />
                  )}
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-signal' : 'text-white/45 group-hover:text-white/80'
                    }`}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-ink antialiased">
      {/* Desktop Obsidian Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-68 shrink-0 flex-col border-r border-white/10 bg-[#0A1018] p-5 text-white lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-1">
          <div className="rounded-xl bg-white px-2.5 py-1.5 shadow-sm">
            <img src="/drivvize-logo.png" alt="Drivvize" className="h-6 w-auto object-contain" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-signal">
              Control Center
            </span>
            <span className="text-xs font-semibold text-white/75">Admin Portal</span>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto pr-1" aria-label="Admin Navigation">
          {renderNavLinks()}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 text-xs">
            <div className="mb-1.5 flex items-center justify-between font-bold">
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                System Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/55">
              Neon Lakebase Postgres active. Authentication secure.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Glass Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-ink/75 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="hidden font-semibold text-ink/45 sm:inline">Drivvize Admin</span>
              <span className="hidden text-ink/30 sm:inline">/</span>
              <span className="font-bold text-ink">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-ink/75 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-ink sm:inline-flex"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="max-w-[140px] truncate font-semibold text-ink">
                {adminUser?.email || 'admin@drivvize.com'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-ink/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 flex w-72 flex-col justify-between bg-[#0A1018] p-5 text-white shadow-2xl">
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-white px-2 py-1">
                      <img src="/drivvize-logo.png" alt="Drivvize" className="h-5 w-auto" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-signal">
                      Admin
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderNavLinks(() => setMobileSidebarOpen(false))}
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <Link
                  href="/"
                  target="_blank"
                  className="block rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-xs font-bold text-white"
                >
                  View Public Website &rarr;
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-rose-500/15 py-2.5 text-center text-xs font-bold text-rose-300 hover:bg-rose-500/25"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Canvas */}
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6 lg:p-10">
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#070B12] text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            Loading Admin Console...
          </p>
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
