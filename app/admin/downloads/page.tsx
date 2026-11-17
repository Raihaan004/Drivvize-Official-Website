'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface PdfDownloadRecord {
  id: number;
  email: string;
  fileId: string;
  fileName: string;
  fileTitle: string;
  field: string;
  downloadedAt: string;
}

const FIELD_OPTIONS = [
  'All Fields',
  'Functional Safety',
  'Automotive Cybersecurity',
  'SOTIF',
];

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<PdfDownloadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedField, setSelectedField] = useState('All Fields');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDownloads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/downloads');
      const data = await res.json();
      if (data.success && data.downloads) {
        setDownloads(data.downloads);
      }
    } catch (err) {
      console.error('Failed to load downloads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/downloads')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.downloads) {
          setDownloads(data.downloads);
        }
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load downloads:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this download lead record?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/downloads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDownloads((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert(data.error || 'Failed to delete record');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting record';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      const matchesField =
        selectedField === 'All Fields' || item.field === selectedField;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.email.toLowerCase().includes(q) ||
        item.fileTitle.toLowerCase().includes(q) ||
        item.fileName.toLowerCase().includes(q);
      return matchesField && matchesSearch;
    });
  }, [downloads, selectedField, searchQuery]);

  // CSV Export utility
  const exportToCSV = () => {
    if (!filteredDownloads.length) return;

    const headers = ['ID', 'Email', 'Document Title', 'Field', 'File Name', 'Downloaded At'];
    const rows = filteredDownloads.map((d) => [
      d.id,
      `"${d.email}"`,
      `"${d.fileTitle.replace(/"/g, '""')}"`,
      `"${d.field}"`,
      `"${d.fileName}"`,
      `"${new Date(d.downloadedAt).toISOString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `drivvize_leads_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueEmails = useMemo(() => {
    return new Set(downloads.map((d) => d.email.toLowerCase())).size;
  }, [downloads]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Document Downloads & Lead Capture
          </h1>
          <p className="text-sm text-ink/60 mt-0.5">
            Prospective clients and engineers who requested technical whitepapers via the /learn page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            disabled={filteredDownloads.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-signal hover:bg-signal/90 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchDownloads}
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
            Total Whitepapers Delivered
          </p>
          <p className="text-2xl font-extrabold text-ink mt-1">
            {downloads.length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-line shadow-xs">
          <p className="text-xs uppercase tracking-wider font-bold text-ink/50">
            Unique Verified Leads
          </p>
          <p className="text-2xl font-extrabold text-ink mt-1">
            {uniqueEmails}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-line shadow-xs">
          <p className="text-xs uppercase tracking-wider font-bold text-ink/50">
            Lead Conversion Rate
          </p>
          <p className="text-2xl font-extrabold text-signal mt-1">
            100%
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-line p-3 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Field Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {FIELD_OPTIONS.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setSelectedField(field)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedField === field
                  ? 'bg-ink text-white shadow-xs'
                  : 'text-ink/60 hover:text-ink hover:bg-paper'
              }`}
            >
              {field}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full">
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
            placeholder="Search leads by email or guide title..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-paper/40 text-ink placeholder:text-ink/40 focus:outline-none focus:bg-white focus:ring-1 focus:ring-signal transition-colors"
          />
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-ink/50 font-bold">
            Loading Download Leads...
          </p>
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center mx-auto mb-3 text-ink/40">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <p className="text-sm font-bold text-ink">
            {searchQuery || selectedField !== 'All Fields'
              ? 'No matching download leads found'
              : 'No documents downloaded yet'}
          </p>
          <p className="text-xs text-ink/60 mt-1 max-w-sm mx-auto">
            When users request safety PDF whitepapers on /learn, their verified emails and document timestamps are recorded here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBFD] border-b border-line text-xs font-bold uppercase tracking-wider text-ink/60">
                <tr>
                  <th className="py-3 px-4">Lead Email</th>
                  <th className="py-3 px-4">Document Requested</th>
                  <th className="py-3 px-4">Field</th>
                  <th className="py-3 px-4">Delivery Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredDownloads.map((item) => (
                  <tr key={item.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-ink">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-signal/10 text-signal flex items-center justify-center text-xs font-extrabold">
                          {item.email.charAt(0).toUpperCase()}
                        </span>
                        <a
                          href={`mailto:${item.email}?subject=Follow-up:%20${encodeURIComponent(
                            item.fileTitle,
                          )}&body=Hello,%0D%0A%0D%0AThank you for downloading our whitepaper: ${encodeURIComponent(
                            item.fileTitle,
                          )}.%0D%0A%0D%0AWould you be open to a brief discussion on how Drivvize can assist your engineering team?%0D%0A%0D%0ABest regards,%0D%0ADrivvize Team`}
                          className="hover:text-signal transition-colors font-mono text-xs sm:text-sm"
                        >
                          {item.email}
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink text-xs sm:text-sm">
                        {item.fileTitle}
                      </div>
                      <div className="text-[11px] text-ink/50 font-mono">
                        {item.fileName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-paper text-ink/80 border border-line">
                        {item.field}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-ink/60 whitespace-nowrap">
                      {new Date(item.downloadedAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${item.email}?subject=Follow-up:%20${encodeURIComponent(
                            item.fileTitle,
                          )}`}
                          className="p-1.5 text-xs font-semibold text-signal hover:bg-signal/10 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Lead"
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
    </div>
  );
}
