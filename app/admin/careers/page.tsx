'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

interface CareerApplicationItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  area: string;
  yearsExperience: string | null;
  resumeFileName: string;
  resumeMimeType: string;
  resumeSizeBytes: number;
  consent: boolean;
  status: string;
  notes: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'reviewed', label: 'Reviewed', badge: 'bg-blue-50 text-deep border-blue-200' },
  {
    value: 'shortlisted',
    label: 'Shortlisted',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    value: 'archived',
    label: 'Archived',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
  },
] as const;

function getStatusBadge(status: string): string {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.badge ||
    'bg-slate-100 text-slate-600 border-slate-200'
  );
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<CareerApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<CareerApplicationItem | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState('new');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saveFeedback, setSaveFeedback] = useState('');

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/careers');
      const data = await res.json();
      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Failed to load career resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/careers')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load career resumes:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (app: CareerApplicationItem) => {
    setSelectedApp(app);
    setStatusDraft(app.status || 'new');
    setNotesDraft(app.notes || '');
    setSaveFeedback('');
  };

  const handleQuickStatusChange = async (id: number, newStatus: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
        );
        if (selectedApp?.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : prev));
          setStatusDraft(newStatus);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedApp) return;
    setSavingId(selectedApp.id);
    setSaveFeedback('');
    try {
      const res = await fetch(`/api/admin/careers/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusDraft, notes: notesDraft }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        const updatedStatus = data.application.status;
        const updatedNotes = data.application.notes;
        setApplications((prev) =>
          prev.map((item) =>
            item.id === selectedApp.id
              ? { ...item, status: updatedStatus, notes: updatedNotes }
              : item,
          ),
        );
        setSelectedApp((prev) =>
          prev ? { ...prev, status: updatedStatus, notes: updatedNotes } : prev,
        );
        setSaveFeedback('Saved');
      }
    } catch (err) {
      console.error('Failed to save candidate notes:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this candidate resume submission permanently?')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/careers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((item) => item.id !== id));
        if (selectedApp?.id === id) {
          setSelectedApp(null);
        }
      } else {
        alert(data.error || 'Failed to delete resume record');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting record');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.toLowerCase().includes(q) ||
        app.area.toLowerCase().includes(q) ||
        app.resumeFileName.toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery, statusFilter]);

  const newCount = applications.filter((a) => a.status === 'new').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Talent Pipeline
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Career Resumes &amp; Candidate Intake
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Review, preview, download, and shortlist resumes submitted from the Careers page.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink/75 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Total Resumes</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {applications.length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-deep">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">New Submissions</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{newCount}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Shortlisted</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink">
              {shortlistedCount}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Latest Submission
            </p>
            <p className="mt-1.5 truncate text-sm font-bold text-ink">
              {applications[0]
                ? new Date(applications[0].createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'None yet'}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, email, phone, area of interest, or filename..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-brand focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[{ value: 'all', label: 'All' }, ...STATUS_OPTIONS].map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? 'bg-ink text-white'
                    : 'bg-slate-100 text-ink/65 hover:bg-slate-200 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
            Loading Career Resumes...
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-ink/40">
            <Briefcase className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-ink">
            {searchQuery || statusFilter !== 'all'
              ? 'No matching resumes found'
              : 'No resumes submitted yet'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-ink/60">
            {searchQuery || statusFilter !== 'all'
              ? 'Try clearing your search query or switching status filter.'
              : 'Resumes uploaded via the /careers form will appear here immediately.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                <tr>
                  <th className="px-5 py-4">Candidate</th>
                  <th className="px-4 py-4">Area &amp; Experience</th>
                  <th className="px-4 py-4">Resume File</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-bold text-ink">{app.name}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-xs text-ink/60">
                        <a href={`mailto:${app.email}`} className="hover:text-deep">
                          {app.email}
                        </a>
                        <span>&bull;</span>
                        <a href={`tel:${app.phone}`} className="hover:text-deep">
                          {app.phone}
                        </a>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-deep">
                        {app.area}
                      </span>
                      <div className="mt-1 text-xs font-medium text-ink/55">
                        {app.yearsExperience
                          ? `${app.yearsExperience} yrs experience`
                          : 'Experience not listed'}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-deep" />
                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate text-xs font-bold text-ink">
                            {app.resumeFileName}
                          </p>
                          <p className="text-[11px] text-ink/50">
                            {formatBytes(app.resumeSizeBytes)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={app.status}
                        disabled={savingId === app.id}
                        onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                        aria-label={`Status for ${app.name}`}
                        className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-bold focus:outline-none ${getStatusBadge(
                          app.status,
                        )}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-ink/55">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModal(app)}
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-ink/70 transition-colors hover:bg-slate-50 hover:text-ink"
                          title="Inspect Candidate Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {app.resumeMimeType === 'application/pdf' && (
                          <a
                            href={`/api/admin/careers/${app.id}/resume`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-200 bg-white p-2 text-ink/70 transition-colors hover:bg-slate-50 hover:text-deep"
                            title="Preview PDF in New Tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}

                        <a
                          href={`/api/admin/careers/${app.id}/resume?download=1`}
                          className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-deep transition-colors hover:bg-blue-100"
                          title="Download Resume File"
                        >
                          <Download className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(app.id)}
                          disabled={deletingId === app.id}
                          className="cursor-pointer rounded-xl bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                          title="Delete Resume"
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

      {/* Candidate Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-ink px-6 py-5 text-white">
              <div>
                <span className="rounded-full bg-signal px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Candidate #{selectedApp.id}
                </span>
                <h3 className="mt-2 text-xl font-extrabold">{selectedApp.name}</h3>
                <p className="text-xs font-semibold text-white/65">
                  {selectedApp.area}
                  {selectedApp.yearsExperience
                    ? ` · ${selectedApp.yearsExperience} years experience`
                    : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
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
                    href={`mailto:${selectedApp.email}`}
                    className="font-mono font-semibold text-deep hover:underline"
                  >
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-ink/45">
                    Phone
                  </span>
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="font-mono font-semibold text-ink hover:underline"
                  >
                    {selectedApp.phone}
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <span className="block font-bold uppercase tracking-wider text-ink/45">
                    Resume Attachment
                  </span>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <FileText className="h-4 w-4 shrink-0 text-deep" />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink">{selectedApp.resumeFileName}</p>
                        <p className="text-[11px] text-ink/50">
                          {formatBytes(selectedApp.resumeSizeBytes)} &bull; Submitted{' '}
                          {new Date(selectedApp.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedApp.resumeMimeType === 'application/pdf' && (
                        <a
                          href={`/api/admin/careers/${selectedApp.id}/resume`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-ink hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Preview</span>
                        </a>
                      )}
                      <a
                        href={`/api/admin/careers/${selectedApp.id}/resume?download=1`}
                        className="inline-flex items-center gap-1 rounded-lg bg-deep px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-brand"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/60">
                    HR Status
                  </label>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-ink focus:border-brand focus:bg-white focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/60">
                    Internal HR Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Add call notes, interview feedback, or role fit..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-ink placeholder:text-ink/40 focus:border-brand focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-ink hover:bg-slate-50"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${selectedApp.email}?subject=${encodeURIComponent(
                      `Your Career Application at Drivvize (${selectedApp.area})`,
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-ink hover:bg-slate-50"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  {saveFeedback && (
                    <span className="text-xs font-bold text-emerald-600">{saveFeedback}</span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveDetails}
                    disabled={savingId === selectedApp.id}
                    className="cursor-pointer rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-yellow-400 disabled:opacity-60"
                  >
                    {savingId === selectedApp.id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

