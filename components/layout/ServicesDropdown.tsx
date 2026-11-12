'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ShieldCheck, Lock, GraduationCap, ArrowUpRight } from 'lucide-react';
import { SERVICE_ROUTES } from '@/constants/tokens';
import { useNavigation } from './NavigationContext';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  '/functional-safety-services': <ShieldCheck className="w-4 h-4 text-[#2563EB]" />,
  '/cybersecurity-services': <Lock className="w-4 h-4 text-[#2563EB]" />,
  '/trainings': <GraduationCap className="w-4 h-4 text-[#2563EB]" />,
};

export const ServicesDropdown: React.FC = () => {
  const { activePath, navigate } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const isServiceActive = SERVICE_ROUTES.some((route) => route.href === activePath);

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearCloseTimer();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      window.setTimeout(() => firstLinkRef.current?.focus(), 20);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`relative inline-flex items-center gap-1.5 px-3 py-2 text-[14.5px] font-medium transition-colors duration-200 rounded-lg cursor-pointer group ${
          isServiceActive || isOpen
            ? 'text-[#2563EB]'
            : 'text-[#0B2545] hover:text-[#2563EB]'
        }`}
      >
        <span>Services</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-250 ${
            isOpen ? 'rotate-180 text-[#2563EB]' : 'text-[#315B7D] group-hover:text-[#2563EB]'
          }`}
        />
        <span
          className={`absolute left-3 right-3 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-transform duration-250 origin-left ${
            isServiceActive || isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      <div
        role="menu"
        aria-label="Drivvize Services"
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[380px] z-50 transition-all duration-250 ease-out origin-top ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 -translate-y-2 pointer-events-none invisible'
        }`}
      >
        <div className="relative bg-white/95 backdrop-blur-xl border border-[#DCE3EA] rounded-[14px] p-2.5 shadow-[0_22px_50px_-12px_rgba(11,37,69,0.18)] overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#0D9488]"
          />
          <div className="px-3 py-2 border-b border-[#F1F5F9] flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#315B7D]">
              Engineering Consulting &amp; Academy
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0B2545] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              ISO Certified Practice
            </span>
          </div>

          <div className="mt-1.5 space-y-1">
            {SERVICE_ROUTES.map((service, idx) => {
              const isActive = activePath === service.href;
              return (
                <a
                  key={service.href}
                  ref={idx === 0 ? firstLinkRef : undefined}
                  href={service.href}
                  role="menuitem"
                  onClick={(e) => {
                    setIsOpen(false);
                    navigate(service, e);
                  }}
                  className={`group/item flex items-start gap-3.5 p-3 rounded-[10px] transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F1F5F9] border border-[#2563EB]/30'
                      : 'hover:bg-[#F1F5F9]/85 border border-transparent hover:border-[#DCE3EA]'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F1F5F9] group-hover/item:bg-white border border-[#DCE3EA]'
                    }`}
                  >
                    {isActive ? (
                      <ShieldCheck className="w-4 h-4 text-white" />
                    ) : (
                      SERVICE_ICONS[service.href]
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[14px] font-semibold transition-colors ${
                          isActive
                            ? 'text-[#2563EB]'
                            : 'text-[#0B2545] group-hover/item:text-[#2563EB]'
                        }`}
                      >
                        {service.label}
                      </span>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#315B7D] group-hover/item:bg-[#0B2545] group-hover/item:text-white transition-colors">
                        {service.code}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#315B7D] leading-[1.45] mt-1">
                      {service.description}
                    </p>
                  </div>

                  <ArrowUpRight className="w-3.5 h-3.5 text-[#315B7D] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:text-[#2563EB] transition-all duration-200 mt-1 shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

