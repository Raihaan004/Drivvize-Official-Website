'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Radio,
  Lock,
  FileText,
  Mail,
  CheckCircle2,
  X,
  ArrowRight,
  BookOpen,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  Send,
  Inbox,
} from 'lucide-react';
import { LEARN_RESOURCES, LearnResource } from '@/constants/learnResources';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';

export const LearnClient: React.FC = () => {
  const [activeModalResource, setActiveModalResource] = useState<LearnResource | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState<{
    message: string;
    email: string;
    resourceTitle: string;
  } | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setActiveModalResource(null);
    setEmail('');
    setErrorMessage(null);
    setSubmittedSuccess(null);
  };

  const openModal = (resource: LearnResource) => {
    setActiveModalResource(resource);
    setErrorMessage(null);
    setSubmittedSuccess(null);
  };

  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalResource) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalResource]);

  // Focus email input when modal opens
  useEffect(() => {
    if (activeModalResource && !submittedSuccess) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [activeModalResource, submittedSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalResource) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/learn/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          fileId: activeModalResource.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch publication.');
      }

      setSubmittedSuccess({
        message: data.message,
        email: trimmedEmail,
        resourceTitle: activeModalResource.title,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong while sending the PDF. Please try again shortly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIcon = (iconName: LearnResource['iconName']) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Radio':
        return <Radio className="w-6 h-6 text-blue-600" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-amber-600" />;
      default:
        return <FileText className="w-6 h-6 text-[#2563EB]" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0B2545] pt-28 pb-20">
      {/* Background Ambience */}
      <AmbientGlow tone="blue" position="top-right" />
      <AmbientGlow tone="cyan" position="bottom-left" hideOnMobile />
      <TechnicalGrid theme="light" opacityClass="opacity-40" showNodes />

      {/* Hero Header */}
      <section className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-20">
        <div className="max-w-[840px]">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DCE3EA] shadow-2xs mb-5">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
            <span className="text-[12px] font-bold tracking-[0.09em] uppercase text-[#315B7D]">
              Knowledge Center & Publications
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11.5px] font-semibold text-[#2563EB] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 3 Specialized Fields
            </span>
          </div>

          <h1 className="text-[36px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.12] tracking-[-0.025em] text-[#0B2545] mb-6">
            Engineering Whitepapers &{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#0D9488] bg-clip-text text-transparent">
              Technical Guides
            </span>
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#315B7D] leading-[1.65] font-normal mb-8">
            Access practitioner-authored publications covering{' '}
            <strong className="text-[#0B2545] font-semibold">ISO 26262 SEooC Functional Safety</strong>,{' '}
            <strong className="text-[#0B2545] font-semibold">Vehicle-to-Everything (V2X)</strong>, and the{' '}
            <strong className="text-[#0B2545] font-semibold">EU Cyber Resilience Act (CRA)</strong>. Enter your
            work email to have the complete PDF delivered directly to your inbox.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#475569]">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#DCE3EA]">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Full Technical PDF Delivered via Email</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#DCE3EA]">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Instant Dispatch to Your Inbox</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#DCE3EA]">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Tier-1 & OEM Verified Architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Specialized Field Resources Section */}
      <section className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {LEARN_RESOURCES.map((resource, index) => (
            <div
              key={resource.id}
              className="flex flex-col bg-white rounded-2xl border border-[#DCE3EA] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group"
            >
              {/* Card Header Top Banner */}
              <div className="p-6 sm:p-7 border-b border-[#F1F5F9] bg-gradient-to-b from-slate-50/60 to-white">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${resource.fieldBadgeColor}`}
                  >
                    {resource.field}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1 bg-[#F1F5F9] px-2.5 py-1 rounded">
                    <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                    {resource.fileSize}
                  </span>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#DCE3EA] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {renderIcon(resource.iconName)}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Field Publication #{index + 1}
                    </span>
                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#0B2545] leading-snug line-clamp-2">
                      {resource.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-xs font-semibold text-[#2563EB] mb-2">{resource.subtitle}</p>
                  <p className="text-[14px] text-[#475569] leading-relaxed mb-6">
                    {resource.description}
                  </p>

                  <div className="border-t border-[#F1F5F9] pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#315B7D] mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#06B6D4]" />
                      Core Coverage & Modules
                    </h4>
                    <ul className="space-y-2">
                      {resource.topics.map((topic, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] text-[#334155] leading-snug"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => openModal(resource)}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#0B2545] shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send PDF to My Email</span>
                  </button>
                  <p className="text-center text-[11px] text-[#94A3B8] mt-2">
                    Enter email • Delivered directly to your inbox
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Bottom Banner */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#163E6D] p-8 sm:p-10 text-white overflow-hidden shadow-xl">
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#06B6D4]/15 to-transparent pointer-events-none"
          />
          <div className="relative z-10 max-w-[800px]">
            <span className="inline-block px-3 py-1 rounded-md bg-white/10 text-[#06B6D4] text-xs font-bold tracking-wider uppercase mb-3">
              Automotive Engineering Practice
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
              Need Tailored ISO 26262, V2X, or EU-CRA Advisory for Your Team?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Our safety consultants and automotive cybersecurity leads provide practitioner-led training
              programs, gap assessments, and engineering support for Tier-1s, OEMs, and semiconductor teams.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white text-[#0B2545] hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>Speak With an Engineer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
              >
                <span>Explore Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EMAIL DISPATCH MODAL */}
      {activeModalResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full max-w-[540px] bg-white rounded-2xl shadow-2xl border border-[#DCE3EA] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#315B7D]">
                  {activeModalResource.field}
                </span>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B2545] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {!submittedSuccess ? (
                <>
                  <div className="mb-6">
                    <h3
                      id="modal-headline"
                      className="text-xl sm:text-2xl font-bold text-[#0B2545] mb-2 leading-snug"
                    >
                      Receive PDF via Email
                    </h3>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      Enter your email address below. We will immediately dispatch the complete publication
                      as an attached PDF directly to your inbox.
                    </p>
                  </div>

                  {/* Resource summary snippet */}
                  <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#DCE3EA] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                        Selected Publication ({activeModalResource.fileSize})
                      </p>
                      <h4 className="text-sm font-bold text-[#0B2545] truncate">
                        {activeModalResource.title}
                      </h4>
                      <p className="text-xs text-[#64748B] truncate font-mono">
                        {activeModalResource.fileName}
                      </p>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="user-email"
                        className="block text-xs font-bold uppercase tracking-wider text-[#315B7D] mb-2"
                      >
                        Your Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          ref={emailInputRef}
                          id="user-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="engineer@company.com"
                          disabled={isSubmitting}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE3EA] text-sm text-[#0B2545] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all bg-white"
                        />
                      </div>
                      <p className="text-[11.5px] text-[#64748B] mt-1.5 flex items-center gap-1.5">
                        <Inbox className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>The PDF will be sent as an attachment to this address.</span>
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#0B2545] shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send PDF to My Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success View — Email Only, No Direct Download */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#0B2545] mb-2">
                      PDF Dispatched to Your Inbox!
                    </h3>
                    <p className="text-sm text-[#475569] max-w-[420px] mx-auto leading-relaxed">
                      We have dispatched <strong className="text-[#0B2545] font-semibold">{submittedSuccess.resourceTitle}</strong> as an email attachment directly to{' '}
                      <strong className="text-[#0B2545] font-semibold">{submittedSuccess.email}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-left text-xs text-blue-950 space-y-1.5">
                    <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Check Your Email Inbox
                    </p>
                    <p className="text-blue-900 leading-relaxed">
                      Please check your inbox (and spam/promotions folder just in case). You can open and save the PDF directly from the email attachment.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#163E6D] transition-colors cursor-pointer shadow-xs"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
