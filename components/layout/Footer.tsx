'use client';

import React from 'react';
import Link from 'next/link';
import { DrivvizeLogo } from '@/components/ui/DrivvizeLogo';
import { NavRouteItem } from '@/constants/tokens';
import { useNavigation } from './NavigationContext';

interface FooterColumnConfig {
  heading: string;
  dotColorClass: string;
  colSpanClass: string;
  links: NavRouteItem[];
}

const FOOTER_COLUMNS: FooterColumnConfig[] = [
  {
    heading: 'Products',
    dotColorClass: 'bg-[#06B6D4]',
    colSpanClass: 'lg:col-span-2',
    links: [{ label: 'Products', href: '/products', sectionAnchor: 'systems' }],
  },
  {
    heading: 'Services',
    dotColorClass: 'bg-[#2563EB]',
    colSpanClass: 'lg:col-span-3',
    links: [
      {
        label: 'Functional Safety Services',
        href: '/functional-safety-services',
        sectionAnchor: 'capabilities',
      },
      {
        label: 'Cybersecurity Services',
        href: '/cybersecurity-services',
        sectionAnchor: 'capabilities',
      },
      { label: 'Trainings', href: '/trainings', sectionAnchor: 'founders' },
    ],
  },
  {
    heading: 'Company',
    dotColorClass: 'bg-[#0D9488]',
    colSpanClass: 'lg:col-span-2',
    links: [
      { label: 'Clients', href: '/clients', sectionAnchor: 'experience' },
      { label: 'Case Studies', href: '/casestudies', sectionAnchor: 'systems' },
      { label: 'Learn', href: '/learn', sectionAnchor: 'recognition' },
      { label: 'Scope Checker', href: '/scope-checker', isPage: true },
    ],
  },
  {
    heading: 'Contact',
    dotColorClass: 'bg-[#FACC15]',
    colSpanClass: 'lg:col-span-1',
    links: [
      { label: 'Contact Us', href: '/contact', sectionAnchor: 'cta-contact' },
    ],
  },
];

export const Footer: React.FC = () => {
  const { activePath, navigate } = useNavigation();

  return (
    <footer
      aria-label="Site Footer"
      className="relative bg-gradient-to-b from-[#0B2545] to-[#202B36] text-white pt-16 pb-12 overflow-hidden"
    >
      {/* Subtle top Cyan/Blue hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/12">
          {/* Brand Column (4 cols on desktop) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 pr-0 lg:pr-6">
            <Link
              href="/"
              onClick={(e) =>
                navigate({ label: 'Home', href: '/', sectionAnchor: 'top' }, e)
              }
              className="inline-block focus:outline-none rounded-lg"
            >
              <DrivvizeLogo variant="dark" />
            </Link>
            <p className="text-[14.5px] text-[#DCE3EA]/80 leading-[1.68] max-w-[360px]">
              Automotive engineering, functional safety, and cybersecurity consulting
              partner helping OEMs and Suppliers build safe, secure, scalable, and
              certifiable products.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[12.5px] font-mono text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
              <span>www.drivvize.com</span>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className={`${col.colSpanClass} space-y-3.5`}>
              <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-white flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${col.dotColorClass}`} />
                {col.heading}
              </h3>
              <ul className="space-y-2.5 text-[14.5px]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => navigate(link, e)}
                      className={`transition-colors duration-200 ${
                        activePath === link.href
                          ? 'text-[#FACC15] font-medium'
                          : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#94A3B8]">
          <p>Copyright © 2026 Drivvize.</p>

          <div className="flex items-center gap-6">
            <a
              href="#privacy-policy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#06B6D4] transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-white/20">|</span>
            <a
              href="#terms-and-conditions"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#06B6D4] transition-colors"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

