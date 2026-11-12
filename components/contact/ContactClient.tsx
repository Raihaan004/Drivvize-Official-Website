'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  User,
  Building2,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { AnimatedGradientBackground } from '@/components/ui/AnimatedGradientBackground';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  message: '',
};

export const ContactClient: React.FC = () => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setErrorMsg('Please enter both your first name and last name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setErrorMsg('Please enter a valid Gmail ID / email address.');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (form.message.trim().length < 5) {
      setErrorMsg('Please enter your message (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setErrorMsg(
          data.error || 'Something went wrong while sending your message.'
        );
        return;
      }

      setSuccessMsg(
        data.message || 'Thank you! Your inquiry has been emailed to our team.'
      );
      setForm(INITIAL_FORM);
    } catch {
      setErrorMsg(
        'Network error while sending your message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* HERO HEADER */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative overflow-hidden bg-gradient-corporate-blue text-white border-b border-[#315B7D]/45"
      >
        <AmbientGlow
          tone="blue"
          position="top-right"
          sizeClass="w-[360px] h-[360px] sm:w-[540px] sm:h-[540px]"
        />
        <AmbientGlow
          tone="cyan"
          position="bottom-left"
          hideOnMobile
          sizeClass="w-[460px] h-[460px]"
        />
        <TechnicalGrid theme="dark" showNodes showParticles opacityClass="opacity-60" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="max-w-[780px]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.09em] uppercase text-white">
                CONTACT DRIVVIZE <span className="text-[#06B6D4] mx-1">|</span>{' '}
                ENGINEERING CONSULTING
              </span>
            </div>

            <h1
              id="contact-hero-heading"
              className="text-[36px] sm:text-[48px] lg:text-[54px] font-extrabold text-white leading-[1.08] tracking-[-0.025em]"
            >
              Contact <span className="text-gradient-innovation">Our Team</span>
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] text-[#DCE3EA] leading-[1.68] max-w-[660px]">
              Share your project requirements, ISO 26262 Kit inquiry, or training
              needs. Your message goes directly to our engineering team.
            </p>
          </div>
        </div>
      </section>

      {/* FORM & DIRECT CONTACT DETAILS */}
      <AnimatedGradientBackground
        variant="light-corporate"
        showGrid
        showOrbs
        className="py-14 sm:py-18 lg:py-20"
      >
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT: Direct Contact Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[16px] bg-white border border-[#DCE3EA] p-6 sm:p-8 shadow-[0_10px_30px_-12px_rgba(11,37,69,0.08)]">
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B2545]">
                  Contact us
                </h2>

                <div className="mt-7 space-y-5">
                  <a
                    href="tel:+919150019689"
                    className="group flex items-center gap-4 p-4 rounded-[12px] bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DCE3EA] hover:border-[#2563EB]/50 transition-all"
                  >
                    <div className="w-11 h-11 rounded-[10px] bg-white border border-[#DCE3EA] group-hover:border-[#2563EB]/40 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#315B7D] group-hover:text-[#2563EB] transition-colors" />
                    </div>
                    <div>
                      <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#315B7D]">
                        Phone
                      </div>
                      <div className="text-[16px] sm:text-[17px] font-semibold text-[#0B2545] group-hover:text-[#2563EB] transition-colors mt-0.5">
                        +91 91500 19689
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:consult@drivvize.com"
                    className="group flex items-center gap-4 p-4 rounded-[12px] bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#DCE3EA] hover:border-[#2563EB]/50 transition-all"
                  >
                    <div className="w-11 h-11 rounded-[10px] bg-white border border-[#DCE3EA] group-hover:border-[#2563EB]/40 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#315B7D] group-hover:text-[#2563EB] transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#315B7D]">
                        Email
                      </div>
                      <div className="text-[16px] sm:text-[17px] font-semibold text-[#0B2545] group-hover:text-[#2563EB] transition-colors mt-0.5 break-all">
                        consult@drivvize.com
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Us Form */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[18px] bg-white border border-[#DCE3EA] p-6 sm:p-8 lg:p-10 shadow-[0_16px_42px_-14px_rgba(11,37,69,0.11)]">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3.5px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#0D9488]"
                />

                <div className="mb-6">
                  <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0B2545]">
                    Send Us a Message
                  </h2>
                  <p className="text-[14px] text-[#315B7D] mt-1">
                    Fill in your details below and click Submit to notify our team.
                  </p>
                </div>

                {successMsg && (
                  <div
                    role="status"
                    className="mb-6 rounded-[12px] bg-[#ECFDF5] border border-[#A7F3D0] p-4 flex items-start gap-3 text-[#065F46]"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[14.5px]">
                        Message Sent Successfully
                      </div>
                      <p className="text-[13.5px] mt-0.5">{successMsg}</p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div
                    role="alert"
                    className="mb-6 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] p-4 flex items-start gap-3 text-[#991B1B]"
                  >
                    <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[14.5px]">
                        Unable to Submit
                      </div>
                      <p className="text-[13.5px] mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-[13.5px] font-semibold text-[#0B2545] mb-1.5"
                      >
                        First Name <span className="text-[#DC2626]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          autoComplete="given-name"
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          className="w-full pl-10 pr-4 py-3 text-[15px] rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-[13.5px] font-semibold text-[#0B2545] mb-1.5"
                      >
                        Last Name <span className="text-[#DC2626]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          autoComplete="family-name"
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          className="w-full pl-10 pr-4 py-3 text-[15px] rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Gmail ID */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[13.5px] font-semibold text-[#0B2545] mb-1.5"
                      >
                        Gmail ID <span className="text-[#DC2626]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="yourname@gmail.com"
                          className="w-full pl-10 pr-4 py-3 text-[15px] rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone No. */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[13.5px] font-semibold text-[#0B2545] mb-1.5"
                      >
                        Phone No. <span className="text-[#DC2626]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 text-[15px] rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Name (Optional) */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-[13.5px] font-semibold text-[#0B2545] mb-1.5"
                    >
                      Company Name{' '}
                      <span className="text-[12px] font-normal text-[#64748B]">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        autoComplete="organization"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Enter your company name (optional)"
                        className="w-full pl-10 pr-4 py-3 text-[15px] rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[13.5px] font-semibold text-[#0B2545] mb-1.5"
                    >
                      Message <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5 pointer-events-none" />
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project, product inquiry, or training requirements..."
                        className="w-full pl-10 pr-4 py-3 text-[15px] rounded-[10px] border-[1.5px] border-[#DCE3EA] bg-[#F8FAFC] focus:bg-white text-[#0B2545] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 transition-all resize-y"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-[12px] bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#06B6D4] bg-[length:180%_100%] bg-left hover:bg-right text-white text-[15px] font-semibold shadow-[0_10px_28px_-6px_rgba(37,99,235,0.52)] hover:shadow-[0_14px_34px_-6px_rgba(6,182,212,0.58)] disabled:opacity-65 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AnimatedGradientBackground>
    </div>
  );
};
