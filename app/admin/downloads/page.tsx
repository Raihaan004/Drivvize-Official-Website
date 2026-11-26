'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileDown, Mail, RefreshCw, Search, Trash2, TrendingUp, Users } from 'lucide-react';

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
  'Connected Mobility',
  'Cybersecurity & Compliance',
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
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Resource Analytics
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Document Downloads &amp; Lead Capture
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Prospective clients and engineers who requested technical whitepapers via the /learn
            page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            disabled={filteredDownloads.length === 0}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-yellow-400 disabled:opacity-50"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchDownloads}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Total Whitepapers Delivered
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {downloads.length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Download className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Unique Verified Leads
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {uniqueEmails}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-deep">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Lead Conversion Rate
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-700">100%</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:flex-row">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {FIELD_OPTIONS.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setSelectedField(field)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                selectedField === field
                  ? 'bg-ink text-white'
                  : 'bg-slate-100 text-ink/65 hover:bg-slate-200 hover:text-ink'
              }`}
            >
              {field}
            </button>
          ))}
        </div>

        <div className="relative w-full flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by email or guide title..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-brand focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
            Loading Download Leads...
          </p>
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-ink/40">
            <Download className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-ink">
            {searchQuery || selectedField !== 'All Fields'
              ? 'No matching download leads found'
              : 'No documents downloaded yet'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-ink/60">
            When users request safety PDF whitepapers on /learn, their verified emails and document
            timestamps are recorded here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                <tr>
                  <th className="px-5 py-4">Lead Email</th>
                  <th className="px-4 py-4">Document Requested</th>
                  <th className="px-4 py-4">Field</th>
                  <th className="px-4 py-4">Delivery Timestamp</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDownloads.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-bold text-ink">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-signal">
                          {item.email.charAt(0).toUpperCase()}
                        </span>
                        <a
                          href={`mailto:${item.email}?subject=Follow-up:%20${encodeURIComponent(
                            item.fileTitle,
                          )}&body=Hello,%0D%0A%0D%0AThank you for downloading our whitepaper: ${encodeURIComponent(
                            item.fileTitle,
                          )}.%0D%0A%0D%0AWould you be open to a brief discussion on how Drivvize can assist your engineering team?%0D%0A%0D%0ABest regards,%0D%0ADrivvize Team`}
                          className="font-mono text-xs transition-colors hover:text-deep sm:text-sm"
                        >
                          {item.email}
                        </a>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-xs font-bold text-ink sm:text-sm">{item.fileTitle}</div>
                      <div className="font-mono text-[11px] text-ink/50">{item.fileName}</div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-semibold text-ink/80">
                        {item.field}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/60">
                      {new Date(item.downloadedAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${item.email}?subject=Follow-up:%20${encodeURIComponent(
                            item.fileTitle,
                          )}`}
                          className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-deep transition-colors hover:bg-blue-100"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="cursor-pointer rounded-xl bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                          title="Delete Lead"
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
    </div>
  );
}
