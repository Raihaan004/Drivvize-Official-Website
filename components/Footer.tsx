'use client';

import React from 'react';
import Link from 'next/link';
import { DrivvizeLogo } from './DrivvizeLogo';
import { NavRouteItem } from '@/constants/tokens';

interface FooterProps {
  activePath: string;
  onNavigate: (item: NavRouteItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Footer: React.FC<FooterProps> = ({ activePath, onNavigate }) => {
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
                onNavigate({ label: 'Home', href: '/', sectionAnchor: 'top' }, e)
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

          {/* Column 1: Products (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
              Products
            </h3>
            <ul className="space-y-2.5 text-[14.5px]">
              <li>
                <a
                  href="/products"
                  onClick={(e) =>
                    onNavigate(
                      { label: 'Products', href: '/products', sectionAnchor: 'systems' },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/products'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Products
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              Services
            </h3>
            <ul className="space-y-2.5 text-[14.5px]">
              <li>
                <a
                  href="/functional-safety-services"
                  onClick={(e) =>
                    onNavigate(
                      {
                        label: 'Functional Safety Services',
                        href: '/functional-safety-services',
                        sectionAnchor: 'capabilities',
                      },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/functional-safety-services'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Functional Safety Services
                </a>
              </li>
              <li>
                <a
                  href="/cybersecurity-services"
                  onClick={(e) =>
                    onNavigate(
                      {
                        label: 'Cybersecurity Services',
                        href: '/cybersecurity-services',
                        sectionAnchor: 'capabilities',
                      },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/cybersecurity-services'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Cybersecurity Services
                </a>
              </li>
              <li>
                <a
                  href="/trainings"
                  onClick={(e) =>
                    onNavigate(
                      {
                        label: 'Trainings',
                        href: '/trainings',
                        sectionAnchor: 'founders',
                      },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/trainings'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Trainings
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
              Company
            </h3>
            <ul className="space-y-2.5 text-[14.5px]">
              <li>
                <a
                  href="/clients"
                  onClick={(e) =>
                    onNavigate(
                      { label: 'Clients', href: '/clients', sectionAnchor: 'experience' },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/clients'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Clients
                </a>
              </li>
              <li>
                <a
                  href="/casestudies"
                  onClick={(e) =>
                    onNavigate(
                      {
                        label: 'Case Studies',
                        href: '/casestudies',
                        sectionAnchor: 'systems',
                      },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/casestudies'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="/learn"
                  onClick={(e) =>
                    onNavigate(
                      { label: 'Learn', href: '/learn', sectionAnchor: 'recognition' },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/learn'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Learn
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (1 col) */}
          <div className="lg:col-span-1 space-y-3.5">
            <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              Contact
            </h3>
            <ul className="space-y-2.5 text-[14.5px]">
              <li>
                <a
                  href="/contact"
                  onClick={(e) =>
                    onNavigate(
                      {
                        label: 'Contact Us',
                        href: '/contact',
                        sectionAnchor: 'cta-contact',
                      },
                      e
                    )
                  }
                  className={`transition-colors duration-200 ${
                    activePath === '/contact'
                      ? 'text-[#FACC15] font-medium'
                      : 'text-[#DCE3EA]/80 hover:text-[#06B6D4]'
                  }`}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
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
