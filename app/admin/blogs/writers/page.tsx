'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MoreHorizontal, Plus, Users, X } from 'lucide-react';

interface WriterRow {
  id: number;
  name: string;
  title: string;
  role: string;
  email: string | null;
  bio: string | null;
  avatarColor: string;
  avatarUrl: string | null;
  postCount: number;
}

const AVATAR_COLORS = ['#2f6b24', '#1d3f6e', '#0f4c81', '#1e40af', '#0a1018', '#315b7d'];
const WRITER_ROLES = ['Owner', 'Managed Writer', 'Editor', 'Guest Contributor'] as const;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export default function AdminBlogWritersPage() {
  const [writers, setWriters] = useState<WriterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Add / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWriter, setEditingWriter] = useState<WriterRow | null>(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Functional Safety Consultant');
  const [role, setRole] = useState<string>('Managed Writer');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[1]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWriters = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/writers');
      const data = await res.json();
      if (data?.success) {
        setWriters(data.writers || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/writers')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.success) {
          setWriters(data.writers || []);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingWriter(null);
    setName('');
    setTitle('Functional Safety Consultant');
    setRole('Managed Writer');
    setEmail('');
    setBio('');
    setAvatarColor(AVATAR_COLORS[1]);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (writer: WriterRow) => {
    setEditingWriter(writer);
    setName(writer.name);
    setTitle(writer.title);
    setRole(writer.role);
    setEmail(writer.email || '');
    setBio(writer.bio || '');
    setAvatarColor(writer.avatarColor || AVATAR_COLORS[1]);
    setError(null);
    setOpenMenuId(null);
    setModalOpen(true);
  };

  const handleSaveWriter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Writer name is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const endpoint = editingWriter
        ? `/api/admin/writers/${editingWriter.id}`
        : '/api/admin/writers';
      const method = editingWriter ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim() || 'Functional Safety Consultant',
          role,
          email: email.trim() || null,
          bio: bio.trim() || null,
          avatarColor,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to save writer');
      }

      await loadWriters();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save writer');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWriter = async (writer: WriterRow) => {
    if (!confirm(`Remove "${writer.name}" from writers?`)) return;
    const res = await fetch(`/api/admin/writers/${writer.id}`, { method: 'DELETE' });
    if (res.ok) {
      setWriters((prev) => prev.filter((w) => w.id !== writer.id));
      setOpenMenuId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching screenshot */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            Editorial Team
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Writers
          </h1>
          <p className="mt-1 text-xs text-ink/60 sm:text-sm">
            Add and manage blog writers and edit their public profiles.{' '}
            <Link href="/admin/blogs/new" className="font-semibold text-deep hover:underline">
              Use in blog editor
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink hover:bg-slate-50"
            >
              <span>More Actions</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink/60" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <Link
                  href="/admin/blogs/overview"
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Blog Overview
                </Link>
                <Link
                  href="/admin/blogs"
                  className="block rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  All Blog Posts
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    void loadWriters();
                  }}
                  className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Refresh List
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-ink shadow-xs transition-colors hover:bg-yellow-400"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Writer</span>
          </button>
        </div>
      </div>

      {/* All Writers Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-extrabold text-ink">All writers</h2>
        </div>

        {isLoading ? (
          <div className="py-14 text-center text-xs text-ink/45">Loading writers...</div>
        ) : writers.length === 0 ? (
          <div className="mx-auto max-w-sm py-14 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-ink/40">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-ink">No writers yet</p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 cursor-pointer rounded-full bg-signal px-5 py-2 text-xs font-bold text-ink"
            >
              + Add Writer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Post Count</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {writers.map((writer, idx) => (
                  <tr key={writer.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-xs"
                          style={{ backgroundColor: writer.avatarColor || '#1d3f6e' }}
                        >
                          {getInitials(writer.name)}
                        </span>
                        <div>
                          <p className="font-bold text-ink">{writer.name}</p>
                          <p className="text-xs text-ink/55">{writer.title}</p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-ink/75">
                      {writer.role}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold tabular-nums text-ink/75">
                      {writer.postCount} {writer.postCount === 1 ? 'Post' : 'Posts'}
                    </td>

                    <td className="relative whitespace-nowrap px-6 py-4 text-right">
                      {idx === 0 ? (
                        <button
                          type="button"
                          onClick={() => openEditModal(writer)}
                          className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-1.5 text-xs font-bold text-deep transition-colors hover:bg-slate-50"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(openMenuId === writer.id ? null : writer.id)
                            }
                            aria-label="Writer options"
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-ink/70 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openMenuId === writer.id && (
                            <div className="absolute right-6 top-12 z-20 w-36 rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                              <button
                                type="button"
                                onClick={() => openEditModal(writer)}
                                className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold text-ink hover:bg-slate-50"
                              >
                                Edit Profile
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWriter(writer)}
                                className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
                              >
                                Delete Writer
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Writer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-ink px-6 py-5 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-signal">
                  Writer Profile
                </p>
                <h3 className="mt-0.5 text-lg font-extrabold">
                  {editingWriter ? `Edit ${editingWriter.name}` : 'Add New Writer'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWriter} className="space-y-4 p-6">
              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {error}
                </p>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Writer Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Nageswaran Jayaraman"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Functional Safety Consultant"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-brand focus:bg-white focus:outline-none"
                  >
                    {WRITER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="writer@drivvize.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Avatar Color
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setAvatarColor(hex)}
                      className={`h-8 w-8 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${
                        avatarColor === hex ? 'border-signal ring-2 ring-ink/20' : 'border-white'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70">
                  Short Bio (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief engineering background..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-ink focus:border-brand focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-ink/70 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-full bg-signal px-6 py-2.5 text-xs font-bold text-ink hover:bg-yellow-400 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingWriter ? 'Save Writer' : 'Add Writer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

