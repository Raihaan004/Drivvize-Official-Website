'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Clock, Eye, Mail, RefreshCw, Search, Trash2, X } from 'lucide-react';

interface Inquiry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string | null;
  message: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.inquiries) {
          setInquiries(data.inquiries);
        }
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load inquiries:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      } else {
        alert(data.error || 'Failed to delete inquiry');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting inquiry';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = useMemo(() => {
    if (!searchQuery.trim()) return inquiries;
    const q = searchQuery.toLowerCase();
    return inquiries.filter(
      (inq) =>
        inq.firstName?.toLowerCase().includes(q) ||
        inq.lastName?.toLowerCase().includes(q) ||
        inq.email?.toLowerCase().includes(q) ||
        inq.companyName?.toLowerCase().includes(q) ||
        inq.message?.toLowerCase().includes(q) ||
        inq.phone?.toLowerCase().includes(q),
    );
  }, [inquiries, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Inbound Leads
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Client Inquiries &amp; Consultation Requests
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Messages and engineering consult inquiries received via the official contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Total Inquiries
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {inquiries.length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Mail className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Companies Reached
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {new Set(inquiries.map((i) => i.companyName).filter(Boolean)).size}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-deep">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Latest Received
            </p>
            <p className="mt-1.5 truncate text-sm font-bold text-ink">
              {inquiries[0]
                ? new Date(inquiries[0].createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'None yet'}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company, or message keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-brand focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
            Loading Inquiries...
          </p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-ink/40">
            <Mail className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-ink">
            {searchQuery ? 'No matching inquiries found' : 'No inquiries received yet'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-ink/60">
            {searchQuery
              ? 'Try modifying your search term or clear the filter.'
              : 'Customer submissions through the /contact page will automatically appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                <tr>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-4 py-4">Company</th>
                  <th className="px-4 py-4">Message Snippet</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-bold text-ink">
                        {inq.firstName} {inq.lastName}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-xs text-ink/60">
                        <a
                          href={`mailto:${inq.email}`}
                          className="transition-colors hover:text-deep"
                        >
                          {inq.email}
                        </a>
                        {inq.phone && (
                          <>
                            <span>&bull;</span>
                            <a
                              href={`tel:${inq.phone}`}
                              className="transition-colors hover:text-deep"
                            >
                              {inq.phone}
                            </a>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-medium text-ink">
                      {inq.companyName ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-deep">
                          {inq.companyName}
                        </span>
                      ) : (
                        <span className="text-xs italic text-ink/40">Individual</span>
                      )}
                    </td>

                    <td className="max-w-md px-4 py-4">
                      <p className="line-clamp-2 text-xs text-ink/70">{inq.message}</p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/55">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inq)}
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-ink/70 transition-colors hover:bg-slate-50 hover:text-ink"
                          title="View Full Message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <a
                          href={`mailto:${inq.email}?subject=Re:%20Drivvize%20Consulting%20Inquiry`}
                          className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-deep transition-colors hover:bg-blue-100"
                          title="Reply via Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(inq.id)}
                          disabled={deletingId === inq.id}
                          className="cursor-pointer rounded-xl bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-ink px-6 py-5 text-white">
              <div>
                <span className="rounded-full bg-signal px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Inquiry #{selectedInquiry.id}
                </span>
                <h3 className="mt-2 text-xl font-extrabold">
                  {selectedInquiry.firstName} {selectedInquiry.lastName}
                </h3>
                {selectedInquiry.companyName && (
                  <p className="text-xs font-semibold text-white/65">
                    {selectedInquiry.companyName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="cursor-pointer rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6 sm:p-7">
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs sm:grid-cols-2">
                <div>
                  <span className="block font-bold uppercase tracking-wider text-ink/45">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-mono font-semibold text-deep hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-ink/45">
                    Phone
                  </span>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="font-mono font-semibold text-ink hover:underline"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <span className="block font-bold uppercase tracking-wider text-ink/45">
                    Received At
                  </span>
                  <span className="font-medium text-ink">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/60">
                  Inquiry Message
                </label>
                <div className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-relaxed text-ink">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="cursor-pointer rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-ink/70 hover:bg-slate-50 hover:text-ink"
                >
                  Close
                </button>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re:%20Drivvize%20Consulting%20Inquiry`}
                  className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-yellow-400"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
