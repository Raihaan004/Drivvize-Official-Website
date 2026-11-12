'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  GraduationCap,
  ArrowRight,
  Award,
  CheckCircle2,
  FileSearch,
  Cpu,
  Wrench,
  BookOpenCheck,
  Compass,
  Layers,
} from 'lucide-react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { AnimatedGradientBackground } from '@/components/ui/AnimatedGradientBackground';
import { GradientButton } from '@/components/ui/GradientButton';
import { useNavigation } from '@/components/layout/NavigationContext';

interface ServiceOfferingItem {
  number: string;
  title: string;
  description: string;
  tag: string;
}

interface TrainingProgramItem {
  number: string;
  title: string;
  category:
    | 'Fundamentals'
    | 'ISO 26262'
    | 'Cybersecurity & CRA'
    | 'SOTIF & SEooC'
    | 'Certification';
  highlight?: string;
}

const FUSA_SERVICES: ServiceOfferingItem[] = [
  {
    number: '01',
    title: 'ISO 26262 Process Setup',
    tag: 'ASIL-D PROCESS READINESS',
    description:
      "Having an ISO 26262 compliant in-house organizational process adds credibility to your Customers about your company's safety culture and capability to build safe products. We help build this process for you so that you are fully ready to get your Organization certified for ASIL-D.",
  },
  {
    number: '02',
    title: 'Hazard Analysis and Risk Assessment',
    tag: 'HARA · SAFETY GOALS & FTTI',
    description:
      "For any safety-relevant ECU, every function of the ECU seems to be critical. We help you precisely determine the hazards of your ECUs and its risk levels, in order to confidently derive your ECU's safety goals, safe states and FTTIs. This way, we neither over-define safety goals nor leave hazards unmitigated.",
  },
  {
    number: '03',
    title: 'Functional Safety Concepts',
    tag: 'VEHICLE ARCHITECTURE · FSC',
    description:
      'We go further beyond the HARA and develop functional safety concepts, so that the vehicle architecture is fully safety-ready and the functional safety requirements and HW metrics for each system are clearly identified.',
  },
  {
    number: '04',
    title: 'Technical Safety Concepts',
    tag: 'SYSTEM · SW & HW DESIGN',
    description:
      'A well-defined system architecture and robust safety concepts sets the base for engineering the system just-right for safety, thereby avoiding over-engineering. It also enables taking the right decisions for SW and HW development upfront. No two Systems are the same; hence, reuse decisions for safety concepts may turn out to be engineering-pricey. We are experts in understanding your Systems, its features and constraints and building the right kind of Safety concepts for it.',
  },
  {
    number: '05',
    title:
      'Safety Analysis & Dependent Failure Analysis at System, Software and Hardware',
    tag: 'FMEA · DFA · >90% RISK MITIGATION',
    description:
      "Top-down and Bottom-up Safety Analysis approaches are needed for functional safety. Safety analysis at any level needs an accurate understanding of the architecture and a systematic methodology. A well-done safety analysis results in an error-free design, mitigating >90% of the risks in your product. We have done this over and over again for extremely complex systems with high-redundancy and have blown away regulatory bodies with our FMEA competency. We also have a strong knowledge of dependent failure initiators and our proprietary 'master' list of initiators which we have built based on decades of experience. So, trust us to cover it all.",
  },
  {
    number: '06',
    title: 'Product Audits and Assessments',
    tag: 'ASIL ASSESSMENT · GAP MITIGATION',
    description:
      "Any Safety-critical product needs to be assessed for its achievement of ISO 26262 requirements and readiness for its required ASIL level. We perform exhaustive technical assessments of products, be it a System, or just a part of Software or Hardware to make sure they do not introduce unacceptable risks during operation. Clients count on us for our deep technical skills that come from our practical experience of building automotive products. We don't just find gaps but also propose solutions to help you mitigate them.",
  },
  {
    number: '07',
    title: 'Safety Element out of Context (SEooC)',
    tag: 'ASSUMPTIONS OF USE · OS / IC / MCU',
    description:
      'This is the "trend" in functional safety. OS, Software Stacks, Microcontrollers, ASICs, Other complex ICs, even Systems have been thought of as SEooCs. Defining the assumptions of use becomes the most critical challenge in SEooC development, else it can invalidate the achievement of ASIL for the product using the SEooC. However, how to ensure that all AoUs are covered, and nothing has been missed? This is where we bring in our experience and knowledge to help you get it right.',
  },
  {
    number: '08',
    title: 'Qualification',
    tag: 'HW & SW RE-USE · GAP ANALYSIS',
    description:
      'Qualification is a strategy used in functional safety for re-using hardware and software built without ISO 26262 considerations. It can turn out to be a risky proposition if the gap analysis between the existing product and the required one is not done well. We do a rigorous gap analysis to identify these risks and propose suitable solutions to mitigate them.',
  },
  {
    number: '09',
    title: 'Supplier Management',
    tag: 'OEM DIA · SUPPLIER MONITORING',
    description:
      "For an OEM, managing multiple suppliers for different ECUs is an exhaustive task. Ensuring that the Suppliers follow safety practices and solutions implies getting a deeper peek into their development. However, OEMs don't get access to the supplier workproducts, stating proprietary rights. We help OEMs in defining the right DIA with suppliers and regularly monitor the safety progress of their suppliers.",
  },
];

const CYBER_SERVICES: ServiceOfferingItem[] = [
  {
    number: '01',
    title: 'ISO 21434 Process Setup',
    tag: 'CSMS CERTIFICATION · EU-CRA',
    description:
      "Having an ISO 21434 compliant in-house organizational process adds credibility to your Customers about your company's cybersecurity culture and capability to build secure products. We help build this process for you so that you are fully ready to get your Organization certified for cybersecurity. We also extend this to cover EU-CRA compliance.",
  },
  {
    number: '02',
    title: 'Threat Analysis and Risk Assessment',
    tag: 'TARA · CIA ASSETS · CYBER GOALS',
    description:
      'We accurately identify the assets of your systems for which the CIA can be compromised, and how these may be attacked. By taking a systematic approach to identify threat & damage scenarios, we treat the associated risks by taking the right actions, including defining the cybersecurity goals of your system.',
  },
  {
    number: '03',
    title: 'Cybersecurity Concepts',
    tag: 'SECURITY MECHANISMS · ROBUSTNESS',
    description:
      'As a next step after the TARA, we define the cybersecurity concept for the product, which involves defining the crucial security mechanisms that must be implemented in the system to be robust against threats.',
  },
  {
    number: '04',
    title: 'Vulnerability Analysis',
    tag: 'CONTINUOUS V&V · POST-SOP',
    description:
      'Vulnerability analysis is a continuous activity that is initiated during TARA and is continued during SW architecture, verification and validation and extends after SOP. It is also used to update threat scenarios, refine cybersecurity claims and influences architectural decisions. We bring in our deep expertise in Systems thinking and Software to identify, mitigate and manage the vulnerabilities of your product.',
  },
];

const TRAININGS_INTRO =
  'We offer a wide variety of trainings. Our trainings are practical, filled with lots of examples and tips that you can start using at work right after. We also offer certification trainings in which you are certified as a functional safety practitioner once you pass our exam. Our certifications are issued by a well-renowned international certification body.';

const TRAINING_PROGRAMS: TrainingProgramItem[] = [
  {
    number: '01',
    title: 'Introduction to Functional Safety (FuSa)',
    category: 'Fundamentals',
  },
  {
    number: '02',
    title: 'Introduction to Cybersecurity (ISO 21434)',
    category: 'Cybersecurity & CRA',
  },
  {
    number: '03',
    title: 'Introduction to EU Cyber Resilience Act (EU CRA)',
    category: 'Cybersecurity & CRA',
  },
  {
    number: '04',
    title: 'ISO 26262 Part-4 Systems Safety Training',
    category: 'ISO 26262',
  },
  {
    number: '05',
    title: 'ISO 26262 Part-5 Hardware Safety Training',
    category: 'ISO 26262',
  },
  {
    number: '06',
    title: 'ISO 26262 Part-6 Software Safety Training',
    category: 'ISO 26262',
  },
  {
    number: '07',
    title: 'ISO 26262 Part-7 Manufacturing Training',
    category: 'ISO 26262',
  },
  {
    number: '08',
    title: 'ISO 26262 & ISO 21434 Customized Trainings',
    category: 'Fundamentals',
    highlight: 'Tailored to Team',
  },
  {
    number: '09',
    title: 'ISO/PAS 21448 - SOTIF Training',
    category: 'SOTIF & SEooC',
  },
  {
    number: '10',
    title: 'How to develop an SEooC - Training',
    category: 'SOTIF & SEooC',
  },
  {
    number: '11',
    title: 'PAS 8800 Training',
    category: 'SOTIF & SEooC',
    highlight: 'AI Safety',
  },
  {
    number: '12',
    title: 'ISO 26262 Certification (4-day) Training',
    category: 'Certification',
    highlight: '4-Day Exam Track',
  },
  {
    number: '13',
    title: 'ISO 21434 Certification (3-day) Training',
    category: 'Certification',
    highlight: '3-Day Exam Track',
  },
];

const TRAINING_CATEGORIES: Array<'All' | TrainingProgramItem['category']> = [
  'All',
  'Fundamentals',
  'ISO 26262',
  'Cybersecurity & CRA',
  'SOTIF & SEooC',
  'Certification',
];

const SECTION_LINKS = [
  {
    id: 'functional-safety',
    label: 'Functional Safety Services',
    count: '9 Offerings',
    icon: ShieldCheck,
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity Services',
    count: '4 Offerings',
    icon: Lock,
  },
  {
    id: 'trainings',
    label: 'Trainings',
    count: '13 Programs',
    icon: GraduationCap,
  },
];

const FUSA_ICONS = [
  ShieldCheck,
  Compass,
  Layers,
  Cpu,
  FileSearch,
  CheckCircle2,
  Wrench,
  BookOpenCheck,
  Award,
];

const CYBER_ICONS = [ShieldCheck, FileSearch, Lock, Cpu];

export const ServicesClient: React.FC = () => {
  const { navigate } = useNavigation();
  const [trainingFilter, setTrainingFilter] = useState<
    'All' | TrainingProgramItem['category']
  >('All');

  const filteredTrainings = useMemo(() => {
    if (trainingFilter === 'All') return TRAINING_PROGRAMS;
    return TRAINING_PROGRAMS.filter((t) => t.category === trainingFilter);
  }, [trainingFilter]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderServiceCard = (
    item: ServiceOfferingItem,
    index: number,
    icons: React.ComponentType<{ className?: string }>[],
    accent: 'blue' | 'cyan'
  ) => {
    const IconComp = icons[index % icons.length];
    return (
      <article
        key={item.number}
        className="group relative overflow-hidden rounded-[16px] bg-white border border-[#DCE3EA] hover:border-[#06B6D4] p-6 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1 shadow-[0_4px_16px_-6px_rgba(11,37,69,0.06)] hover:shadow-[0_20px_38px_-12px_rgba(37,99,235,0.13)] flex flex-col justify-between"
      >
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${
            accent === 'blue'
              ? 'from-[#2563EB] via-[#06B6D4] to-[#0D9488]'
              : 'from-[#06B6D4] via-[#2563EB] to-[#0B2545]'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="w-11 h-11 rounded-[10px] bg-[#F1F5F9] group-hover:bg-gradient-to-br group-hover:from-[#2563EB] group-hover:to-[#06B6D4] border border-[#DCE3EA] group-hover:border-transparent flex items-center justify-center transition-all duration-300">
              <IconComp className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors duration-300" />
            </div>

            <span className="text-[12px] font-mono font-bold tracking-[0.08em] text-[#315B7D] bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#DCE3EA]">
              {item.number}
            </span>
          </div>

          <h3 className="text-[19px] sm:text-[20px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-[1.3] transition-colors">
            {item.title}
          </h3>

          <p className="mt-3 text-[14.5px] sm:text-[15px] text-[#202B36]/85 leading-[1.68]">
            {item.description}
          </p>
        </div>

        <div className="mt-6 pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#315B7D] group-hover:text-[#0D9488] transition-colors">
            {item.tag}
          </span>
          <span className="w-4 h-[2px] rounded-full bg-[#DCE3EA] group-hover:w-8 group-hover:bg-gradient-to-r group-hover:from-[#2563EB] group-hover:to-[#06B6D4] transition-all duration-300" />
        </div>
      </article>
    );
  };

  return (
    <div className="bg-white">
      {/* HERO HEADER */}
      <section
        aria-labelledby="services-hero-heading"
        className="relative overflow-hidden bg-gradient-corporate-blue text-white border-b border-[#315B7D]/45"
      >
        <AmbientGlow
          tone="blue"
          position="top-right"
          sizeClass="w-[360px] h-[360px] sm:w-[560px] sm:h-[560px]"
        />
        <AmbientGlow
          tone="cyan"
          position="bottom-left"
          hideOnMobile
          sizeClass="w-[460px] h-[460px]"
        />
        <TechnicalGrid theme="dark" showNodes showParticles opacityClass="opacity-60" />

        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
          <div className="max-w-[840px]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.09em] uppercase text-white">
                DRIVVIZE SERVICES <span className="text-[#06B6D4] mx-1">|</span> ISO 26262 ·
                ISO/SAE 21434 · ACADEMY
              </span>
            </div>

            <h1
              id="services-hero-heading"
              className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-[-0.025em]"
            >
              Engineering{' '}
              <span className="text-gradient-innovation">Services &amp; Trainings</span>
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] text-[#DCE3EA] leading-[1.68] max-w-[700px]">
              End-to-end Functional Safety (ISO 26262), Automotive Cybersecurity
              (ISO/SAE 21434 &amp; EU-CRA), and practitioner-led Certification Trainings
              for OEMs and Tier-1 Suppliers.
            </p>

            {/* Section Jump Navigation */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[760px]">
              {SECTION_LINKS.map((sec) => {
                const IconComp = sec.icon;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(sec.id);
                    }}
                    className="group flex items-center gap-3 px-4 py-3 rounded-[12px] bg-white/10 hover:bg-white/18 border border-white/18 hover:border-[#06B6D4]/70 backdrop-blur-md transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <IconComp className="w-4.5 h-4.5 text-[#06B6D4]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-white leading-tight truncate">
                        {sec.label}
                      </div>
                      <div className="text-[11.5px] text-[#DCE3EA]/80 mt-0.5">
                        {sec.count}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: FUNCTIONAL SAFETY SERVICES */}
      <section
        id="functional-safety"
        aria-labelledby="fusa-section-heading"
        className="scroll-mt-20 relative border-b border-[#DCE3EA]"
      >
        <AnimatedGradientBackground
          variant="light-corporate"
          showGrid
          showOrbs
          className="py-16 sm:py-20"
        >
          <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white border border-[#DCE3EA] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
                    SECTION 01 · ISO 26262 CONSULTING
                  </span>
                </div>
                <h2
                  id="fusa-section-heading"
                  className="text-[30px] sm:text-[38px] lg:text-[42px] font-bold text-[#0B2545] leading-[1.14]"
                >
                  Functional Safety Services
                </h2>
              </div>
              <p className="text-[15px] text-[#315B7D] max-w-[480px] leading-[1.6]">
                Full-lifecycle functional safety engineering from organizational ASIL-D
                process setup through HARA, concepts, safety analysis, SEooC, audits,
                qualification, and OEM supplier management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FUSA_SERVICES.map((item, idx) =>
                renderServiceCard(item, idx, FUSA_ICONS, 'blue')
              )}
            </div>
          </div>
        </AnimatedGradientBackground>
      </section>

      {/* SECTION 2: CYBERSECURITY SERVICES */}
      <section
        id="cybersecurity"
        aria-labelledby="cyber-section-heading"
        className="scroll-mt-20 relative bg-white py-16 sm:py-20 border-b border-[#DCE3EA]"
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#DCE3EA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
                  SECTION 02 · ISO/SAE 21434 &amp; EU-CRA
                </span>
              </div>
              <h2
                id="cyber-section-heading"
                className="text-[30px] sm:text-[38px] lg:text-[42px] font-bold text-[#0B2545] leading-[1.14]"
              >
                Cybersecurity Services
              </h2>
            </div>
            <p className="text-[15px] text-[#315B7D] max-w-[480px] leading-[1.6]">
              End-to-end automotive cybersecurity engineering extending from ISO 21434
              organizational certification to EU-CRA compliance and continuous
              vulnerability management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CYBER_SERVICES.map((item, idx) =>
              renderServiceCard(item, idx, CYBER_ICONS, 'cyan')
            )}
          </div>

          {/* EU CRA Scope Checker Callout */}
          <div className="mt-8 rounded-[16px] bg-gradient-corporate-blue text-white p-6 sm:p-8 border border-[#315B7D]/45 shadow-[0_18px_40px_-14px_rgba(11,37,69,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-[680px]">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] uppercase text-[#FACC15]">
                <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                INTERACTIVE COMPLIANCE TOOL
              </span>
              <h3 className="text-[20px] sm:text-[24px] font-bold text-white mt-1.5">
                Checking EU Cyber Resilience Act (EU-CRA) Applicability?
              </h3>
              <p className="text-[14.5px] text-[#DCE3EA] mt-1.5 leading-[1.6]">
                Use our EU CRA Scope Checker to screen connected products, ECUs, embedded
                software, and Annex III/IV classifications in seconds.
              </p>
            </div>
            <Link
              href="/scope-checker"
              onClick={(e) =>
                navigate(
                  {
                    label: 'Scope Checker',
                    href: '/scope-checker',
                    isPage: true,
                  },
                  e
                )
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-[#FACC15] hover:bg-[#FDE047] text-[#0B2545] text-[14px] font-bold shrink-0 transition-colors"
            >
              <span>Open Scope Checker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: TRAININGS */}
      <section
        id="trainings"
        aria-labelledby="trainings-section-heading"
        className="scroll-mt-20 relative"
      >
        <AnimatedGradientBackground
          variant="light-corporate"
          showGrid
          showOrbs
          className="py-16 sm:py-20"
        >
          <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white border border-[#DCE3EA] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                  <span className="text-[11.5px] font-bold tracking-[0.11em] uppercase text-[#315B7D]">
                    SECTION 03 · DRIVVIZE ACADEMY ({TRAINING_PROGRAMS.length} PROGRAMS)
                  </span>
                </div>
                <h2
                  id="trainings-section-heading"
                  className="text-[30px] sm:text-[38px] lg:text-[42px] font-bold text-[#0B2545] leading-[1.14]"
                >
                  Trainings &amp; Practitioner Certifications
                </h2>
              </div>
            </div>

            {/* Intro & Certification Card */}
            <div className="rounded-[16px] bg-white border border-[#DCE3EA] p-6 sm:p-8 shadow-[0_8px_24px_-10px_rgba(11,37,69,0.08)] mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <p className="text-[15.5px] sm:text-[16.5px] text-[#202B36] leading-[1.7] max-w-[780px]">
                  {TRAININGS_INTRO}
                </p>
                <div className="rounded-[12px] bg-[#F8FAFC] border border-[#DCE3EA] p-4 sm:p-5 shrink-0 lg:max-w-[320px]">
                  <div className="flex items-center gap-2 text-[#2563EB] font-bold text-[13px] uppercase tracking-[0.08em]">
                    <Award className="w-4 h-4 text-[#FACC15]" />
                    International Certification
                  </div>
                  <p className="text-[13.5px] text-[#315B7D] mt-1.5 leading-[1.55]">
                    Exam-based Functional Safety &amp; Cybersecurity practitioner
                    certifications issued by a renowned international certification body.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {TRAINING_CATEGORIES.map((cat) => {
                const active = trainingFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTrainingFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-xs'
                        : 'bg-white text-[#315B7D] border-[#DCE3EA] hover:border-[#2563EB] hover:text-[#2563EB]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Training Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrainings.map((course) => (
                <article
                  key={course.number}
                  className="group rounded-[14px] bg-white border border-[#DCE3EA] hover:border-[#06B6D4] p-5 transition-all duration-250 hover:-translate-y-0.5 shadow-[0_2px_10px_-4px_rgba(11,37,69,0.05)] hover:shadow-[0_14px_30px_-10px_rgba(37,99,235,0.12)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#315B7D] border border-[#DCE3EA]">
                        {course.category}
                      </span>
                      <span className="text-[12px] font-mono font-bold text-[#94A3B8] group-hover:text-[#2563EB] transition-colors">
                        {course.number}
                      </span>
                    </div>

                    <h3 className="text-[16.5px] font-bold text-[#0B2545] group-hover:text-[#2563EB] leading-[1.35] transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#0D9488]">
                      {course.highlight ?? 'Practical Workshop'}
                    </span>
                    <GraduationCap className="w-4 h-4 text-[#315B7D] group-hover:text-[#2563EB] transition-colors" />
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom Consultation CTA */}
            <div className="mt-14 rounded-[18px] bg-white border border-[#DCE3EA] p-7 sm:p-10 shadow-[0_12px_32px_-12px_rgba(11,37,69,0.09)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-[660px]">
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B2545]">
                  Need Tailored Safety, Cybersecurity, or Team Training?
                </h2>
                <p className="text-[15px] text-[#315B7D] mt-2 leading-[1.6]">
                  Partner with Drivvize&apos;s engineering practitioners to structure your
                  ISO 26262, ISO/SAE 21434, SOTIF, or EU-CRA program with confidence.
                </p>
              </div>
              <GradientButton
                href="/contact"
                variant="primary-gradient"
                size="lg"
                onClick={(e) =>
                  navigate(
                    {
                      label: 'Talk to Our Experts',
                      href: '/contact',
                      sectionAnchor: 'cta-contact',
                    },
                    e
                  )
                }
                className="shrink-0"
              >
                <span>Talk to Our Experts</span>
                <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </div>
        </AnimatedGradientBackground>
      </section>
    </div>
  );
};
