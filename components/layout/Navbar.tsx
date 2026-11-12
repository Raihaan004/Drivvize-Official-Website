'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, ShieldCheck, Lock, GraduationCap } from 'lucide-react';
import { DrivvizeLogo } from '@/components/ui/DrivvizeLogo';
import { GlassNavbar } from '@/components/ui/GlassNavbar';
import { GradientButton } from '@/components/ui/GradientButton';
import { PRIMARY_NAV_ROUTES, SERVICE_ROUTES, NavRouteItem } from '@/constants/tokens';
import { ServicesDropdown } from './ServicesDropdown';
import { useNavigation } from './NavigationContext';

export const Navbar: React.FC = () => {
  const { activePath, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const productsRoute = PRIMARY_NAV_ROUTES[0];
  const postServicesRoutes = PRIMARY_NAV_ROUTES.slice(1);

  const handleMobileNav = (item: NavRouteItem, e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    navigate(item, e);
  };

  return (
    <>
      <GlassNavbar>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* LEFT: Drivvize Brand Wordmark & Logo Placeholder */}
          <Link
            href="/"
            onClick={(e) =>
              navigate({ label: 'Home', href: '/', sectionAnchor: 'top' }, e)
            }
            className="focus:outline-none rounded-lg"
          >
            <DrivvizeLogo compact={false} />
          </Link>

          {/* CENTER: Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {/* Products */}
            {productsRoute.isPage ? (
              <Link
                href={productsRoute.href}
                onClick={(e) => navigate(productsRoute, e)}
                className={`relative px-3 py-2 text-[14.5px] font-medium transition-colors duration-200 rounded-lg group whitespace-nowrap ${
                  activePath === productsRoute.href
                    ? 'text-[#2563EB]'
                    : 'text-[#0B2545] hover:text-[#2563EB]'
                }`}
              >
                <span>{productsRoute.label}</span>
                <span
                  className={`absolute left-3 right-3 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-transform duration-250 origin-left ${
                    activePath === productsRoute.href
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ) : (
              <a
                href={productsRoute.href}
                onClick={(e) => navigate(productsRoute, e)}
                className={`relative px-3 py-2 text-[14.5px] font-medium transition-colors duration-200 rounded-lg group whitespace-nowrap ${
                  activePath === productsRoute.href
                    ? 'text-[#2563EB]'
                    : 'text-[#0B2545] hover:text-[#2563EB]'
                }`}
              >
                <span>{productsRoute.label}</span>
                <span
                  className={`absolute left-3 right-3 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-transform duration-250 origin-left ${
                    activePath === productsRoute.href
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            )}

            {/* Services Dropdown */}
            <ServicesDropdown />

            {/* Clients, Case Studies, Learn, Scope Checker */}
            {postServicesRoutes.map((route) => {
              const isActive = activePath === route.href;
              const linkClassName = `relative px-3 py-2 text-[14.5px] font-medium transition-colors duration-200 rounded-lg group whitespace-nowrap ${
                isActive
                  ? 'text-[#2563EB]'
                  : 'text-[#0B2545] hover:text-[#2563EB]'
              }`;
              const underline = (
                <span
                  className={`absolute left-3 right-3 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-transform duration-250 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              );

              if (route.isPage) {
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={(e) => navigate(route, e)}
                    className={linkClassName}
                  >
                    <span>{route.label}</span>
                    {underline}
                  </Link>
                );
              }

              return (
                <a
                  key={route.href}
                  href={route.href}
                  onClick={(e) => navigate(route, e)}
                  className={linkClassName}
                >
                  <span>{route.label}</span>
                  {underline}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Contact Us CTA + Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <GradientButton
              href="/contact"
              variant="primary-gradient"
              size="md"
              onClick={(e) =>
                navigate(
                  { label: 'Contact Us', href: '/contact', sectionAnchor: 'cta-contact' },
                  e
                )
              }
              className="hidden sm:inline-flex"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-0.5" />
            </GradientButton>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-[10px] border border-[#DCE3EA] bg-white text-[#0B2545] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </GlassNavbar>

      {/* Mobile Slide-In Navigation Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#0B2545]/45 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <aside
          aria-label="Mobile Navigation Drawer"
          className={`fixed top-0 right-0 bottom-0 w-full max-w-[360px] bg-white border-l border-[#DCE3EA] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Top Header */}
          <div className="px-5 py-4 border-b border-[#DCE3EA] flex items-center justify-between">
            <Link
              href="/"
              onClick={(e) =>
                handleMobileNav({ label: 'Home', href: '/', sectionAnchor: 'top' }, e)
              }
            >
              <DrivvizeLogo compact />
            </Link>
            <button
              type="button"
              aria-label="Close mobile menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-[10px] border border-[#DCE3EA] flex items-center justify-center text-[#0B2545] hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1.5">
            {/* Products */}
            {productsRoute.isPage ? (
              <Link
                href={productsRoute.href}
                onClick={(e) => handleMobileNav(productsRoute, e)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-[10px] text-[15px] font-semibold transition-colors ${
                  activePath === productsRoute.href
                    ? 'bg-[#F1F5F9] text-[#2563EB]'
                    : 'text-[#0B2545] hover:bg-[#F1F5F9]'
                }`}
              >
                <span>{productsRoute.label}</span>
                <span className="text-[11px] font-mono text-[#315B7D]">{productsRoute.href}</span>
              </Link>
            ) : (
              <a
                href={productsRoute.href}
                onClick={(e) => handleMobileNav(productsRoute, e)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-[10px] text-[15px] font-semibold transition-colors ${
                  activePath === productsRoute.href
                    ? 'bg-[#F1F5F9] text-[#2563EB]'
                    : 'text-[#0B2545] hover:bg-[#F1F5F9]'
                }`}
              >
                <span>{productsRoute.label}</span>
                <span className="text-[11px] font-mono text-[#315B7D]">{productsRoute.href}</span>
              </a>
            )}

            {/* Expandable Services Submenu */}
            <div className="rounded-[12px] border border-[#DCE3EA] bg-[#F1F5F9]/55 overflow-hidden">
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-3 text-[15px] font-semibold text-[#0B2545] hover:text-[#2563EB] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Services</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#315B7D] transition-transform duration-200 ${
                    mobileServicesOpen ? 'rotate-180 text-[#2563EB]' : ''
                  }`}
                />
              </button>

              {mobileServicesOpen && (
                <div className="px-2.5 pb-2.5 space-y-1 border-t border-[#DCE3EA]/70 pt-2">
                  {SERVICE_ROUTES.map((service) => {
                    const isActive = activePath === service.href;
                    const IconComp =
                      service.href === '/functional-safety-services'
                        ? ShieldCheck
                        : service.href === '/cybersecurity-services'
                        ? Lock
                        : GraduationCap;
                    return (
                      <a
                        key={service.href}
                        href={service.href}
                        onClick={(e) => handleMobileNav(service, e)}
                        className={`flex items-start gap-3 p-2.5 rounded-[9px] transition-colors ${
                          isActive
                            ? 'bg-white text-[#2563EB] shadow-xs'
                            : 'hover:bg-white text-[#0B2545]'
                        }`}
                      >
                        <span className="w-8 h-8 rounded-lg bg-white border border-[#DCE3EA] flex items-center justify-center shrink-0 mt-0.5">
                          <IconComp className="w-4 h-4 text-[#2563EB]" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13.5px] font-semibold leading-snug">
                            {service.label}
                          </span>
                          <span className="block text-[11.5px] text-[#315B7D] mt-0.5 leading-snug">
                            {service.description}
                          </span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clients, Case Studies, Learn, Scope Checker */}
            {postServicesRoutes.map((route) => {
              const isActive = activePath === route.href;
              const mobileLinkClassName = `flex items-center justify-between px-3.5 py-3 rounded-[10px] text-[15px] font-semibold transition-colors ${
                isActive
                  ? 'bg-[#F1F5F9] text-[#2563EB]'
                  : 'text-[#0B2545] hover:bg-[#F1F5F9]'
              }`;

              if (route.isPage) {
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={(e) => handleMobileNav(route, e)}
                    className={mobileLinkClassName}
                  >
                    <span>{route.label}</span>
                    <span className="text-[11px] font-mono text-[#315B7D]">{route.href}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={route.href}
                  href={route.href}
                  onClick={(e) => handleMobileNav(route, e)}
                  className={mobileLinkClassName}
                >
                  <span>{route.label}</span>
                  <span className="text-[11px] font-mono text-[#315B7D]">{route.href}</span>
                </a>
              );
            })}
          </div>

          {/* Drawer Footer CTA */}
          <div className="p-5 border-t border-[#DCE3EA] bg-[#F1F5F9]/60">
            <a
              href="/contact"
              onClick={(e) =>
                handleMobileNav(
                  { label: 'Contact Us', href: '/contact', sectionAnchor: 'cta-contact' },
                  e
                )
              }
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[15px] font-semibold shadow-[0_8px_20px_-4px_rgba(37,99,235,0.45)] transition-all"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-center text-[#315B7D] mt-2.5 tracking-wide">
              www.drivvize.com — Automotive Engineering Consultancy
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};

