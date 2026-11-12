'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  Lock,
  Radar,
  Cpu,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { NavRouteItem } from '@/constants/tokens';
import { AmbientGlow } from './ui/AmbientGlow';
import { TechnicalGrid } from './ui/TechnicalGrid';
import { GradientButton } from './ui/GradientButton';
import { SectionReveal } from './ui/SectionReveal';

interface HeroSectionProps {
  onNavigate: (item: NavRouteItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

type ArchitectureDomain = 'all' | 'fusa' | 'cyber' | 'adas';

// Replaceable cinematic automotive studio image (Unsplash licensed photo by Milad Fakurian)
const HERO_AUTOMOTIVE_BACKDROP_URL =
  'https://images.unsplash.com/photo-1685594496584-23198309c37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmdXR1cmlzdGljJTIwZWxlY3RyaWMlMjBjYXIlMjBkYXJrJTIwc3R1ZGlvJTIwc2lsaG91ZXR0ZSUyMGF1dG9tb3RpdmUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc5Mzg4OTQwNnww&ixlib=rb-4.1.0&q=80&w=1080';

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [activeDomain, setActiveDomain] = useState<ArchitectureDomain>('all');

  const isHighlighted = (domain: ArchitectureDomain) =>
    activeDomain === 'all' || activeDomain === domain;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-corporate-blue text-white border-b border-[#315B7D]/45"
    >
      {/* Layer 1: Replaceable Cinematic Automotive Studio Image / Video Poster Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <Image
          src={HERO_AUTOMOTIVE_BACKDROP_URL}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-22 scale-105 mix-blend-luminosity"
        />
        {/* Dark Navy-to-Transparent Readability Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(11,37,69,0.97) 0%, rgba(11,37,69,0.92) 46%, rgba(11,37,69,0.78) 78%, rgba(14,47,90,0.88) 100%)',
          }}
        />
      </div>

      {/* Layer 2: Subtle Animated Blue & Cyan Gradient Orbs */}
      <AmbientGlow
        tone="blue"
        position="top-right"
        sizeClass="w-[360px] h-[360px] sm:w-[600px] sm:h-[600px]"
      />
      <AmbientGlow
        tone="cyan"
        position="bottom-left"
        hideOnMobile
        sizeClass="w-[520px] h-[520px]"
      />

      {/* Layer 3: Low-Opacity Technical Grid + Connected Nodes + Subtle Floating Particles */}
      <TechnicalGrid
        theme="dark"
        showNodes
        showParticles
        opacityClass="opacity-65"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* LEFT COLUMN: Editorial Headline, Copy & CTAs */}
          <SectionReveal className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8">
            {/* Small Eyebrow Text */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 shadow-[0_4px_18px_-4px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.09em] uppercase text-white">
                AUTOMOTIVE ENGINEERING <span className="text-[#06B6D4] mx-1">|</span> FUNCTIONAL
                SAFETY <span className="text-[#06B6D4] mx-1">|</span> CYBERSECURITY
              </span>
            </div>

            {/* Main Headline (64-76px desktop hierarchy) */}
            <h1
              id="hero-heading"
              className="text-[36px] sm:text-[48px] md:text-[56px] xl:text-[64px] font-extrabold text-white leading-[1.07] tracking-[-0.028em]"
            >
              Transform Innovation into{' '}
              <span className="text-gradient-innovation">safe</span>,{' '}
              <span className="text-gradient-innovation">secure</span>,{' '}
              <span className="text-gradient-innovation">scalable</span> and{' '}
              <span className="text-gradient-innovation underline decoration-[#FACC15] decoration-[3px] underline-offset-[8px]">
                certifiable
              </span>{' '}
              products
            </h1>

            {/* Supporting Paragraph with exact bolded terms */}
            <p className="text-[16px] sm:text-[17.5px] text-[#DCE3EA] leading-[1.72] max-w-[620px] font-normal">
              Drivvize is your trusted partner for{' '}
              <strong className="font-semibold text-white">functional safety</strong> and{' '}
              <strong className="font-semibold text-white">cybersecurity</strong> challenges.
              We help <strong className="font-semibold text-white">Automotive OEMs</strong> and{' '}
              <strong className="font-semibold text-white">Suppliers</strong> move forward with
              clarity — turning{' '}
              <strong className="font-semibold text-white">functional safety</strong>,{' '}
              <strong className="font-semibold text-white">cybersecurity</strong>, and
              software-defined vehicle challenges into structured engineering progress. Whether you
              are building next-generation ECUs, scaling ADAS capabilities, or navigating evolving
              regulations, we partner with your teams to reduce uncertainty, accelerate decisions,
              and embed safety and security into the DNA of your development lifecycle.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <GradientButton
                href="/functional-safety-services"
                variant="primary-gradient"
                size="lg"
                onClick={(e) =>
                  onNavigate(
                    {
                      label: 'Explore Our Services',
                      href: '/functional-safety-services',
                      sectionAnchor: 'capabilities',
                    },
                    e
                  )
                }
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1" />
              </GradientButton>

              <GradientButton
                href="#capabilities"
                variant="secondary-glass-dark"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Compass className="w-4 h-4 text-[#06B6D4]" />
                <span>Discover Drivvize</span>
              </GradientButton>
            </div>

            {/* Subtle Engineering Standards Bar */}
            <div className="pt-3 border-t border-white/14 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-medium text-[#DCE3EA]/85">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                ISO 26262 (ASIL A–D)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                ISO/SAE 21434 &amp; EU-CRA
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                SDV &amp; Zonal ECU Architecture
              </span>
            </div>
          </SectionReveal>

          {/* RIGHT COLUMN: High-Precision 3D-Styled Automotive SDV & ECU Engineering Visualization */}
          <SectionReveal delayMs={120} className="lg:col-span-6 xl:col-span-6 relative">
            <div className="relative rounded-[18px] bg-[#0B2545]/82 backdrop-blur-xl p-5 sm:p-7 border border-white/16 shadow-[0_28px_64px_-16px_rgba(6,21,41,0.68),inset_0_1px_0_0_rgba(6,182,212,0.22)] overflow-hidden">
              {/* Subtle Internal Technical Grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 engineering-grid-dark opacity-75 pointer-events-none"
              />

              {/* Soft Radial Blue & Cyan Glow inside visual */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[340px] rounded-full bg-gradient-to-tr from-[#2563EB]/25 via-[#06B6D4]/20 to-[#0D9488]/15 blur-3xl pointer-events-none"
              />

              {/* Top Header Bar of the Technical Visualization */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[11px] font-semibold tracking-wider uppercase text-white">
                    <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />
                    SDV Zonal E/E Architecture
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-mono text-[#94A3B8]">
                    ARCH-REV 4.2 // SILENT-TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#DCE3EA]">
                    ASIL-D &amp; CSMS Verified
                  </span>
                </div>
              </div>

              {/* Interactive Floating Domain Labels (Required Optional Labels in Brief) */}
              <div
                role="tablist"
                aria-label="Filter vehicle architecture layers"
                className="relative z-10 flex flex-wrap items-center gap-2 mt-4"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeDomain === 'fusa'}
                  onClick={() =>
                    setActiveDomain((prev) => (prev === 'fusa' ? 'all' : 'fusa'))
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.07em] uppercase transition-all cursor-pointer ${
                    activeDomain === 'fusa'
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border border-white/40 shadow-sm'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
                  FUNCTIONAL SAFETY
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeDomain === 'cyber'}
                  onClick={() =>
                    setActiveDomain((prev) => (prev === 'cyber' ? 'all' : 'cyber'))
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.07em] uppercase transition-all cursor-pointer ${
                    activeDomain === 'cyber'
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border border-white/40 shadow-sm'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#06B6D4]" />
                  AUTOMOTIVE CYBERSECURITY
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeDomain === 'adas'}
                  onClick={() =>
                    setActiveDomain((prev) => (prev === 'adas' ? 'all' : 'adas'))
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.07em] uppercase transition-all cursor-pointer ${
                    activeDomain === 'adas'
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border border-white/40 shadow-sm'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                  }`}
                >
                  <Radar className="w-3.5 h-3.5 text-[#FACC15]" />
                  ADAS ENGINEERING
                </button>
              </div>

              {/* Main 3D-Inspired Automotive Chassis, ADAS Radar Cones & Zonal ECU SVG Illustration */}
              <div className="relative z-10 my-3">
                <svg
                  viewBox="0 0 640 390"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="3D-styled automotive engineering schematic showing ADAS radar sensor cones, zonal ECU architecture, steer-by-wire, battery management system, and cybersecurity gateway"
                >
                  <defs>
                    <linearGradient id="vehicleBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                      <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#0B2545" stopOpacity="0.55" />
                    </linearGradient>
                    <linearGradient id="radarConeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.02" />
                      <stop offset="65%" stopColor="#2563EB" stopOpacity="0.26" />
                      <stop offset="100%" stopColor="#FACC15" stopOpacity="0.45" />
                    </linearGradient>
                    <linearGradient id="chassisWire" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#DCE3EA" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>

                  {/* Isometric Perspective Platform Grid Plane */}
                  <g opacity="0.35">
                    <polygon
                      points="70,285 245,190 595,225 425,335"
                      fill="none"
                      stroke="#DCE3EA"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line x1="155" y1="238" x2="510" y2="278" stroke="#2563EB" strokeWidth="0.9" />
                    <line x1="165" y1="300" x2="340" y2="202" stroke="#2563EB" strokeWidth="0.9" />
                    <line x1="280" y1="315" x2="455" y2="212" stroke="#2563EB" strokeWidth="0.9" />
                  </g>

                  {/* ADAS Front Radar & Camera Perception Cones (Left/Front of Vehicle) */}
                  <g
                    opacity={isHighlighted('adas') ? 1 : 0.28}
                    className="transition-opacity duration-300"
                  >
                    <path
                      d="M150 228 L18 165 C8 205 8 248 22 282 Z"
                      fill="url(#radarConeGrad)"
                    />
                    {/* Radar Wave Arcs */}
                    <path
                      d="M105 195 A48 48 0 0 0 105 256"
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="1.6"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M72 180 A76 76 0 0 0 74 270"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M40 166 A106 106 0 0 0 42 282"
                      fill="none"
                      stroke="#DCE3EA"
                      strokeWidth="1.1"
                      strokeOpacity="0.65"
                    />
                    {/* Front Radar Label Callout */}
                    <line x1="72" y1="180" x2="95" y2="128" stroke="#DCE3EA" strokeWidth="1" />
                    <circle cx="72" cy="180" r="3" fill="#FACC15" />
                    <rect
                      x="42"
                      y="102"
                      width="142"
                      height="24"
                      rx="5"
                      fill="#0B2545"
                      stroke="#06B6D4"
                      strokeWidth="1"
                    />
                    <text
                      x="113"
                      y="118"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="600"
                      letterSpacing="0.06em"
                    >
                      ADAS RADAR + CAMERA
                    </text>
                  </g>

                  {/* 3D Isometric Vehicle Silhouette & Structural Wireframe */}
                  <g>
                    {/* Lower Chassis Shadow */}
                    <ellipse
                      cx="345"
                      cy="268"
                      rx="185"
                      ry="44"
                      fill="#061529"
                      opacity="0.65"
                    />

                    {/* Vehicle Outer Aerodynamic Body Shell */}
                    <path
                      d="M142 226 L198 184 L292 142 L438 140 L524 178 L548 218 L522 256 L176 262 Z"
                      fill="url(#vehicleBodyGrad)"
                      stroke="url(#chassisWire)"
                      strokeWidth="1.8"
                    />

                    {/* Greenhouse / Cabin Roofline Wireframe */}
                    <path
                      d="M218 184 L296 146 L422 145 L484 180 L385 196 L245 196 Z"
                      fill="#2563EB"
                      fillOpacity="0.12"
                      stroke="#DCE3EA"
                      strokeWidth="1.2"
                      strokeOpacity="0.7"
                    />

                    {/* Internal High-Voltage Battery Pack / Skateboard Deck */}
                    <polygon
                      points="235,232 305,204 462,208 396,242"
                      fill="#0B2545"
                      fillOpacity="0.88"
                      stroke="#2563EB"
                      strokeWidth="1.4"
                    />
                    {/* Battery Cell Grid Lines */}
                    <line x1="270" y1="218" x2="425" y2="224" stroke="#2563EB" strokeWidth="0.9" strokeOpacity="0.6" />
                    <line x1="315" y1="208" x2="275" y2="235" stroke="#2563EB" strokeWidth="0.9" strokeOpacity="0.6" />
                    <line x1="365" y1="208" x2="325" y2="238" stroke="#2563EB" strokeWidth="0.9" strokeOpacity="0.6" />
                    <line x1="415" y1="208" x2="375" y2="240" stroke="#2563EB" strokeWidth="0.9" strokeOpacity="0.6" />

                    {/* 4 Isometric Wheels / Corner Modules (Steer-by-Wire & Brake-by-Wire) */}
                    {/* Front Left Wheel */}
                    <g>
                      <ellipse
                        cx="222"
                        cy="252"
                        rx="28"
                        ry="18"
                        fill="#0B2545"
                        stroke="#DCE3EA"
                        strokeWidth="2"
                      />
                      <ellipse
                        cx="222"
                        cy="252"
                        rx="15"
                        ry="9"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="1.5"
                      />
                    </g>
                    {/* Rear Left Wheel */}
                    <g>
                      <ellipse
                        cx="458"
                        cy="248"
                        rx="28"
                        ry="18"
                        fill="#0B2545"
                        stroke="#DCE3EA"
                        strokeWidth="2"
                      />
                      <ellipse
                        cx="458"
                        cy="248"
                        rx="15"
                        ry="9"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="1.5"
                      />
                    </g>
                  </g>

                  {/* ZONAL E/E ARCHITECTURE & TECHNICAL CONNECTION LINES */}
                  <g>
                    {/* Backbone Ethernet / CAN-FD Safety Bus */}
                    <path
                      d="M168 222 L238 222 L338 214 L468 214"
                      fill="none"
                      stroke="#DCE3EA"
                      strokeWidth="1.5"
                      strokeOpacity="0.5"
                    />
                    <path
                      d="M168 222 L238 222 L338 214 L468 214"
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="2.2"
                      className="svg-trace-line"
                    />
                    {/* Secondary Cyber Security Gateway Bus */}
                    <path
                      d="M238 222 L305 182 L412 182 L468 214"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="1.8"
                      className="svg-trace-line-delayed"
                    />
                  </g>

                  {/* ECU & SAFETY NODES */}
                  {/* Node 1: Front ADAS Domain Controller */}
                  <g
                    opacity={isHighlighted('adas') ? 1 : 0.35}
                    className="transition-opacity duration-300"
                  >
                    <circle cx="168" cy="222" r="8" fill="#2563EB" fillOpacity="0.3" />
                    <circle cx="168" cy="222" r="4.5" fill="#FACC15" />
                  </g>

                  {/* Node 2: Steer-by-Wire & Brake-by-Wire Redundant Actuator (ASIL-D) */}
                  <g
                    opacity={isHighlighted('fusa') ? 1 : 0.35}
                    className="transition-opacity duration-300"
                  >
                    <circle cx="238" cy="222" r="9" fill="#2563EB" fillOpacity="0.3" />
                    <circle cx="238" cy="222" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
                    <line x1="238" y1="222" x2="215" y2="312" stroke="#DCE3EA" strokeWidth="1" />
                    <rect
                      x="130"
                      y="312"
                      width="172"
                      height="26"
                      rx="5"
                      fill="#0B2545"
                      stroke="#DCE3EA"
                      strokeWidth="1"
                      strokeOpacity="0.45"
                    />
                    <circle cx="144" cy="325" r="3" fill="#FACC15" />
                    <text
                      x="222"
                      y="329"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="600"
                      letterSpacing="0.05em"
                    >
                      STEER / BRAKE-BY-WIRE
                    </text>
                  </g>

                  {/* Node 3: Central SDV HPC & Cybersecurity Gateway (ISO 21434) */}
                  <g
                    opacity={isHighlighted('cyber') ? 1 : 0.35}
                    className="transition-opacity duration-300"
                  >
                    <rect
                      x="288"
                      y="168"
                      width="34"
                      height="26"
                      rx="5"
                      fill="#2563EB"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle cx="305" cy="181" r="4" fill="#FACC15" />
                    <line x1="305" y1="168" x2="305" y2="96" stroke="#2563EB" strokeWidth="1.2" />
                    <rect
                      x="220"
                      y="68"
                      width="176"
                      height="28"
                      rx="6"
                      fill="#0B2545"
                      stroke="#2563EB"
                      strokeWidth="1.2"
                    />
                    <text
                      x="308"
                      y="86"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="600"
                      letterSpacing="0.06em"
                    >
                      CENTRAL HPC + SECURE GW
                    </text>
                  </g>

                  {/* Node 4: BMS & Inverter Safety Core */}
                  <g
                    opacity={isHighlighted('fusa') ? 1 : 0.35}
                    className="transition-opacity duration-300"
                  >
                    <circle cx="468" cy="214" r="9" fill="#0D9488" fillOpacity="0.4" />
                    <circle cx="468" cy="214" r="4.5" fill="#F97316" />
                    <line x1="468" y1="214" x2="495" y2="122" stroke="#DCE3EA" strokeWidth="1" />
                    <rect
                      x="422"
                      y="96"
                      width="168"
                      height="26"
                      rx="5"
                      fill="#0B2545"
                      stroke="#0D9488"
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />
                    <text
                      x="506"
                      y="113"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="600"
                      letterSpacing="0.05em"
                    >
                      BMS &amp; INVERTER CONTROL
                    </text>
                  </g>
                </svg>
              </div>

              {/* Bottom Floating Glass Information Panels inside Hero Visual */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="glass-panel-dark p-3.5 float-panel-gentle">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#DCE3EA]">
                      ISO 26262
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                  </div>
                  <p className="text-[13px] font-bold text-white mt-1">
                    ASIL B to ASIL D
                  </p>
                  <p className="text-[11px] text-[#DCE3EA]/80 mt-0.5">
                    End-to-end safety lifecycle
                  </p>
                </div>

                <div className="glass-panel-dark p-3.5 float-panel-gentle-delayed">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#DCE3EA]">
                      ISO 21434 &amp; EU-CRA
                    </span>
                    <Activity className="w-3.5 h-3.5 text-[#06B6D4]" />
                  </div>
                  <p className="text-[13px] font-bold text-white mt-1">
                    Cyber Resilience
                  </p>
                  <p className="text-[11px] text-[#DCE3EA]/80 mt-0.5">
                    TARA, CSMS &amp; secure ECUs
                  </p>
                </div>

                <div className="glass-panel-dark p-3.5 float-panel-gentle">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#DCE3EA]">
                      SDV &amp; ADAS
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-[9px] font-bold text-white">
                      CERTIFIABLE
                    </span>
                  </div>
                  <p className="text-[13px] font-bold text-white mt-1">
                    15+ Critical Systems
                  </p>
                  <p className="text-[11px] text-[#DCE3EA]/80 mt-0.5">
                    Systems, SW &amp; HW architecture
                  </p>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Subtle Animated Scroll Indicator */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <a
            href="#capabilities"
            aria-label="Scroll down to Engineering Capabilities"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex flex-col items-center gap-2 text-[#DCE3EA]/75 hover:text-white transition-colors"
          >
            <span className="text-[10.5px] font-mono tracking-[0.18em] uppercase text-[#94A3B8] group-hover:text-[#06B6D4] transition-colors">
              Scroll to Explore
            </span>
            <span className="w-6 h-9 rounded-full border border-white/25 group-hover:border-[#06B6D4] flex items-start justify-center p-1.5 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] scroll-indicator-dot" />
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#06B6D4] opacity-75 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

