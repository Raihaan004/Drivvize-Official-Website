'use client';

import React, { useState, useEffect, useMemo } from 'react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Client Inquiries & Consultation Requests
          </h1>
          <p className="text-sm text-ink/60 mt-0.5">
            Messages and engineering consult inquiries received via the official contact form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchInquiries}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-ink/70 bg-white border border-line rounded-lg shadow-xs hover:bg-paper cursor-pointer transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-line shadow-xs">
          <p className="text-xs uppercase tracking-wider font-bold text-ink/50">
            Total Inquiries
          </p>
          <p className="text-2xl font-extrabold text-ink mt-1">
            {inquiries.length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-line shadow-xs">
          <p className="text-xs uppercase tracking-wider font-bold text-ink/50">
            Companies Reached
          </p>
          <p className="text-2xl font-extrabold text-ink mt-1">
            {new Set(inquiries.map((i) => i.companyName).filter(Boolean)).size}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-line shadow-xs">
          <p className="text-xs uppercase tracking-wider font-bold text-ink/50">
            Latest Received
          </p>
          <p className="text-sm font-bold text-ink mt-2 truncate">
            {inquiries[0]
              ? new Date(inquiries[0].createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'None yet'}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-line p-3 shadow-xs">
        <div className="relative">
          <svg
            className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company, or message keyword..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-paper/40 text-ink placeholder:text-ink/40 focus:outline-none focus:bg-white focus:ring-1 focus:ring-signal transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-ink/50 font-bold">
            Loading Inquiries...
          </p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center mx-auto mb-3 text-ink/40">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-ink">
            {searchQuery ? 'No matching inquiries found' : 'No inquiries received yet'}
          </p>
          <p className="text-xs text-ink/60 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search term or clear the filter.'
              : 'Customer submissions through the /contact page will automatically appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBFD] border-b border-line text-xs font-bold uppercase tracking-wider text-ink/60">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-ink">
                        {inq.firstName} {inq.lastName}
                      </div>
                      <div className="text-xs text-ink/60 font-mono flex items-center gap-2 mt-0.5">
                        <a
                          href={`mailto:${inq.email}`}
                          className="hover:text-signal transition-colors"
                        >
                          {inq.email}
                        </a>
                        {inq.phone && (
                          <>
                            <span>&bull;</span>
                            <a
                              href={`tel:${inq.phone}`}
                              className="hover:text-signal transition-colors"
                            >
                              {inq.phone}
                            </a>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-ink">
                      {inq.companyName ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-paper text-ink/80 text-xs font-semibold">
                          {inq.companyName}
                        </span>
                      ) : (
                        <span className="text-xs text-ink/40 italic">Individual</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <p className="text-xs text-ink/70 line-clamp-2">
                        {inq.message}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-ink/50 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 text-xs font-semibold text-ink/70 hover:text-ink hover:bg-paper rounded-lg transition-colors cursor-pointer"
                          title="View Full Message"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        <a
                          href={`mailto:${inq.email}?subject=Re:%20Drivvize%20Consulting%20Inquiry`}
                          className="p-1.5 text-xs font-semibold text-signal hover:bg-signal/10 rounded-lg transition-colors"
                          title="Reply via Email"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(inq.id)}
                          disabled={deletingId === inq.id}
                          className="p-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Record"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-line shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-signal bg-signal/10 px-2 py-0.5 rounded">
                  Inquiry #{selectedInquiry.id}
                </span>
                <h3 className="text-xl font-extrabold text-ink mt-1">
                  {selectedInquiry.firstName} {selectedInquiry.lastName}
                </h3>
                {selectedInquiry.companyName && (
                  <p className="text-xs font-semibold text-ink/60">
                    {selectedInquiry.companyName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-ink/40 hover:text-ink text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-paper/50 border border-line text-xs">
              <div>
                <span className="text-ink/40 font-bold block uppercase tracking-wider">Email</span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-mono text-ink font-semibold hover:text-signal"
                >
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-ink/40 font-bold block uppercase tracking-wider">Phone</span>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="font-mono text-ink font-semibold hover:text-signal"
                >
                  {selectedInquiry.phone}
                </a>
              </div>
              <div className="col-span-2">
                <span className="text-ink/40 font-bold block uppercase tracking-wider">Received At</span>
                <span className="text-ink font-medium">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                Inquiry Message
              </label>
              <div className="p-4 rounded-xl bg-paper/30 border border-line text-sm text-ink leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-sans">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 text-xs font-bold text-ink/60 hover:text-ink cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re:%20Drivvize%20Consulting%20Inquiry`}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-signal hover:bg-signal/90 rounded-lg shadow-sm transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
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
