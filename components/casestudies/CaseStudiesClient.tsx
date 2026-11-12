'use client';

import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Cpu,
  Radar,
  Layers,
  ArrowRight,
  Target,
  FileCheck2,
} from 'lucide-react';
import { AmbientGlow } from '@/components/ui/AmbientGlow';
import { TechnicalGrid } from '@/components/ui/TechnicalGrid';
import { AnimatedGradientBackground } from '@/components/ui/AnimatedGradientBackground';
import { GradientButton } from '@/components/ui/GradientButton';
import { useNavigation } from '@/components/layout/NavigationContext';

type CaseCategory = 'all' | 'chassis' | 'oem' | 'software' | 'adas';

interface CaseStudyItem {
  id: string;
  number: string;
  title: string;
  category: Exclude<CaseCategory, 'all'>;
  categoryLabel: string;
  clientProfile: string;
  asilBadge: string;
  timeframeOrScope: string;
  problemParagraphs: string[];
  problemBullets?: string[];
  approach: string[];
  summary: string;
  keyHighlight: string;
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'steer-by-wire-asil-d',
    number: 'CS-01',
    title: 'Feasibility Study for achieving ASIL-D for a Steer-by-wire System',
    category: 'chassis',
    categoryLabel: 'Chassis & Motion',
    clientProfile: 'European Tier-1 Supplier',
    asilBadge: 'ASIL-D',
    timeframeOrScope: '2 Months',
    problemParagraphs: [
      'A European Tier-1 company developing Steer-by-wire Systems needed to understand how their existing system architecture needs to be modified to achieve functional safety goals, at the highest ASIL level of ASIL D.',
      'The challenge was to provide a technical solution to the Customer within a short time span of 2 months.',
    ],
    approach: [
      'Define Item Boundary and Functionalities',
      'Perform HAZOP (Hazard and Operability study) based malfunction analysis to identify the Hazards of the Steer-by-wire System',
      'Perform a Rapid HARA to define the Safety goals of the System and their ASIL levels',
      'Perform an FMEA based Safety analysis of the critical HW and SW elements of the System',
    ],
    summary:
      'Based on the HAZOP, Rapid HARA and FMEA, we identified all the crucial technical modifications needed in the system such as system elements needing diversified redundancy, the decisions related to double or triple redundancy to meet fail-operational requirements, and redundancy for other components such as power supplies, communication, encoders etc.',
    keyHighlight: 'Fail-operational double/triple redundancy roadmap in 2 months',
  },
  {
    id: 'electronic-park-brake-asil-b',
    number: 'CS-02',
    title: 'Technical Safety concept for an ASIL-B Electronic park brake System',
    category: 'chassis',
    categoryLabel: 'Chassis & Motion',
    clientProfile: 'Indian Tier-1 Supplier',
    asilBadge: 'ASIL-B',
    timeframeOrScope: '1 Month',
    problemParagraphs: [
      'An Indian Tier-1 company developing a part of an Electronic Park brake systems needed to develop a technical safety concept for their system. There were 2 challenges:',
    ],
    problemBullets: [
      'the system was jointly developed by two Tier-1s, hence defining a technical safety concept needed clear boundaries and identification of scope of both Tier-1s, and',
      'this was needed to be done within a time span of only 1 month',
    ],
    approach: [
      'Define System Boundary and understand system functionalities',
      'Define the FSR split between the two Tier-1s',
      'Identify the safety-critical system functions and elements',
      'Define the safety critical path to achieve each safety goal and identify the dependencies on the other Tier-1 to achieve the safety goal',
      'Define the safety concept for each safety goal',
    ],
    summary:
      'The Technical Safety concept was defined for each safety goal with a clear identification of the safety related failure modes and elements. By proactively performing a clear boundary definition between the two Tier-1s in terms of system boundary and FSR scope, we won the confidence and appreciation of the OEM. We also clearly communicated all the technical dependencies to the other Tier-1, in order to achieve a robust safety concept.',
    keyHighlight: 'Multi-Tier-1 FSR split & OEM confidence delivered in 1 month',
  },
  {
    id: 'complete-fusa-solution-oem',
    number: 'CS-03',
    title: 'Complete Functional Safety Solution for an OEM (Ongoing)',
    category: 'oem',
    categoryLabel: 'OEM Full Lifecycle',
    clientProfile: 'Rail-Automotive OEM',
    asilBadge: 'ASIL-D · EN 50128/9',
    timeframeOrScope: 'Ongoing',
    problemParagraphs: [
      "An OEM is developing a special kind of 'Vehicle' that is a combination of a Railway and an automotive system. Some of the key challenges are:",
    ],
    problemBullets: [
      'The standard to be complied is a combination of ISO 26262 and EN 50128/9 (Railways standard)',
      'The OEM does not have any safety background and hence the entire Functional Safety process has to be built ground up',
    ],
    approach: [
      'Apply Pareto principle of solving the most critical & biggest issues first',
      'Create Vehicle Architecture & Item Definition',
      'Provide Safety Process for ASIL-D compliance',
      'Guide & track suppliers in achieving safety compliance',
      'Create Safety Case for their vehicle',
      'Work with external certification body to formulate the standard to be followed',
    ],
    summary:
      'As the OEM was new to functional safety, we created and rolled out a FuSa strategy that brings in immediate value to the OEM. Also, the strategy was formulated in such a way that we could also guide the suppliers. We also work closely with an external certification body to ensure that our strategy is in alignment to their overall strategy. Guidance on Tier-1 supplier selection was also given to the OEM so that the entire vehicle system could achieve ASIL-D compliance.',
    keyHighlight: 'Ground-up ISO 26262 + EN 50128/9 FuSa strategy & supplier governance',
  },
  {
    id: 'sw-assessment-autosar-asil-d',
    number: 'CS-04',
    title: 'SW Assessment for ASIL D AUTOSAR Platform',
    category: 'software',
    categoryLabel: 'SW & AUTOSAR SEooC',
    clientProfile: 'Indian Tier-2 Supplier',
    asilBadge: 'ASIL-D SW SEooC',
    timeframeOrScope: '1 Month · 200+ Work Products',
    problemParagraphs: [
      'An Indian Tier-2 company developing an ASIL-D AUTOSAR Stack approached us for an Assessment of their SW SEooC in accordance to ISO 26262.',
      "The Customer's intent was to use our Assessment to identify all their safety gaps before going for an External Certification body.",
      'The Customer wanted an extremely rigorous/technically exhaustive assessment to be performed within 1 month and there were 200+ SW Safety Work products developed for the platform.',
    ],
    approach: [
      'Define an Assessment checklist tailored to the Platform that addresses all ISO 26262 requirements, and also considers typical SW Safety pitfalls known from experience',
      'Focus on the SW SEooC Strategy to identify major gaps in strategy definition',
      'Rigorous assessment of SW Safety requirements and design',
      'In-depth assessment of SW Safety analysis and SW DFA methodologies',
      'Verification and Validation approaches of SW SEooC with a more specific focus on worst-case and corner cases',
      'Focus on the strategy for identifying AoUs (assumptions of use) and the correctness and completeness of the safety manual',
    ],
    summary:
      'By taking a methodical approach to the Assessment and leveraging our strong SW experience to locate common pitfalls, we were able to identify 50+ gaps within the first 3 days of Assessments. Our rigor in assessing the SW Safety analysis and DFA, and AoUs revealed 50+ major/critical gaps that needed SW updates. We also identified 100+ gaps related to verification & validation, which lead to improving the test cases, analysis & reviews, thereby giving complete confidence to the Customer on the safety case.',
    keyHighlight: '50+ gaps found in first 3 days · 100+ V&V gaps & 50+ critical SW gaps resolved',
  },
  {
    id: 'l2-plus-adas-tsc',
    number: 'CS-05',
    title: 'Technical Safety Concept for a L2+ ADAS System',
    category: 'adas',
    categoryLabel: 'ADAS & Automated Driving',
    clientProfile: 'American OEM',
    asilBadge: 'ASIL-D Domain Controller',
    timeframeOrScope: '25+ Features · >64 Safety Goals',
    problemParagraphs: [
      'An American OEM had defined an L2+ ADAS system with 25+ ADAS features and > 64 Safety Goals.',
      'The System had 5 Radars, a Front Camera, 12 Ultrasonic sensors and 4 surround view cameras besides an ASIL-D ADAS Domain Controller.',
      'The Challenge was to define the technical safety concepts for >64 Safety goals with the intent to add technical safety mechanisms without leading to too high a complexity in terms of implementation, so that the balance between functionality and safety is achieved.',
    ],
    approach: [
      'In-depth understanding of the ADAS feature nominal functionality requirements',
      'Understanding of the hazards intended to be mitigated by each safety goal',
      'Understanding of the system architecture for each feature (without safety)',
      'Identifying what kind of approach is needed for each SG - whether a monitoring approach is feasible or the intended functionality must be implemented as ASIL',
      'Identification of safety critical inputs and whether they are implemented at the required ASIL level or redundant inputs are needed',
      'Modification of System Architecture to implement the safety critical system elements',
    ],
    summary:
      'By taking a methodical approach to performing the technical safety concept, and by identifying what aspects of the system are needed to be really implemented as ASIL, we implemented the right technical solutions at the safety concept level to adequately mitigate the hazards without overly increasing the complexity of the System. We also identified common aspects across different features and synchronized them such that when all the concepts for >64 safety goals were implemented, the system still functioned without compromising its reliability and availability requirements.',
    keyHighlight: 'Synchronized TSC across 25+ ADAS features & >64 safety goals',
  },
];

const CATEGORY_TABS: Array<{
  key: CaseCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'all', label: 'All Case Studies', icon: Layers },
  { key: 'chassis', label: 'Chassis & Braking', icon: ShieldCheck },
  { key: 'oem', label: 'OEM Strategy', icon: Building2 },
  { key: 'software', label: 'AUTOSAR & SW', icon: Cpu },
  { key: 'adas', label: 'ADAS L2+', icon: Radar },
];

export const CaseStudiesClient: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<CaseCategory>('all');

  const filteredCases = useMemo(() => {
    if (activeCategory === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter((cs) => cs.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-white">
      {/* HERO HEADER */}
      <section
        aria-labelledby="casestudies-hero-heading"
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
          <div className="max-w-[820px]">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/18 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.09em] uppercase text-white">
                PROVEN ENGINEERING OUTCOMES <span className="text-[#06B6D4] mx-1">|</span>{' '}
                OEM · TIER-1 · TIER-2
              </span>
            </div>

            <h1
              id="casestudies-hero-heading"
              className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-[-0.025em]"
            >
              Automotive{' '}
              <span className="text-gradient-innovation">Case Studies</span>
            </h1>

            <p className="mt-4 text-[16px] sm:text-[18px] text-[#DCE3EA] leading-[1.68] max-w-[700px]">
              Real-world functional safety engineering engagements across Steer-by-wire,
              Electronic Park Brake, Rail-Automotive platforms, ASIL-D AUTOSAR SEooC
              assessments, and L2+ ADAS systems.
            </p>

            {/* Quick Summary Metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[780px]">
              <div className="glass-panel-dark px-4 py-3">
                <div className="text-[20px] font-extrabold text-white">5</div>
                <div className="text-[11.5px] text-[#DCE3EA]/80">Featured Cases</div>
              </div>
              <div className="glass-panel-dark px-4 py-3">
                <div className="text-[20px] font-extrabold text-[#FACC15]">
                  ASIL-B to D
                </div>
                <div className="text-[11.5px] text-[#DCE3EA]/80">Safety Criticality</div>
              </div>
              <div className="glass-panel-dark px-4 py-3">
                <div className="text-[20px] font-extrabold text-[#06B6D4]">200+</div>
                <div className="text-[11.5px] text-[#DCE3EA]/80">SW Work Products</div>
              </div>
              <div className="glass-panel-dark px-4 py-3">
                <div className="text-[20px] font-extrabold text-white">&gt;64</div>
                <div className="text-[11.5px] text-[#DCE3EA]/80">ADAS Safety Goals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES LIST */}
      <AnimatedGradientBackground
        variant="light-corporate"
        showGrid
        showOrbs
        className="py-14 sm:py-18 lg:py-20"
      >
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter + Quick Jump */}
          <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_TABS.map((tab) => {
                const IconComp = tab.icon;
                const active = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13.5px] font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-xs'
                        : 'bg-white text-[#315B7D] border-[#DCE3EA] hover:border-[#2563EB] hover:text-[#2563EB]'
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 ${active ? 'text-[#06B6D4]' : 'text-[#2563EB]'}`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[13px] font-medium text-[#315B7D]">
              Showing {filteredCases.length} of {CASE_STUDIES.length} engagements
            </div>
          </div>

          {/* Case Study Cards */}
          <div className="space-y-10">
            {filteredCases.map((cs) => (
              <article
                key={cs.id}
                id={cs.id}
                className="scroll-mt-24 rounded-[18px] bg-white border border-[#DCE3EA] overflow-hidden shadow-[0_14px_36px_-14px_rgba(11,37,69,0.10)]"
              >
                {/* Top Header Strip */}
                <div className="px-6 sm:px-8 py-5 bg-[#F8FAFC] border-b border-[#DCE3EA] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className="px-3 py-1 rounded-lg bg-[#0B2545] text-[#FACC15] text-[12px] font-mono font-bold shrink-0">
                      {cs.number}
                    </span>
                    <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-[#0B2545] leading-[1.25]">
                      {cs.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCE3EA] text-[12px] font-semibold text-[#315B7D]">
                      <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      {cs.clientProfile}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[12px] font-bold text-[#1E40AF]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                      {cs.asilBadge}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[12px] font-semibold text-[#065F46]">
                      <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                      {cs.timeframeOrScope}
                    </span>
                  </div>
                </div>

                {/* 2-Column Slide Layout: Blue Problem Statement Left + Approach & Summary Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* LEFT: Problem Statement Blue Panel */}
                  <div className="lg:col-span-4 bg-gradient-to-br from-[#0B2545] via-[#123A6E] to-[#1D4ED8] text-white p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.11em] text-[#FACC15] mb-3">
                        <Target className="w-4 h-4" />
                        Problem Statement
                      </div>

                      <div className="space-y-3.5 text-[14.5px] sm:text-[15px] text-[#F1F5F9] leading-[1.68]">
                        {cs.problemParagraphs.map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>

                      {cs.problemBullets && (
                        <ul className="mt-3.5 space-y-2.5 text-[14px] text-[#DCE3EA] leading-[1.6]">
                          {cs.problemBullets.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] mt-2 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/18">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#06B6D4]">
                        Key Outcome
                      </div>
                      <div className="text-[13.5px] font-semibold text-white mt-1 leading-snug">
                        {cs.keyHighlight}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Approach & Summary */}
                  <div className="lg:col-span-8 p-6 sm:p-8 space-y-6 bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-3.5">
                        <FileCheck2 className="w-4.5 h-4.5 text-[#2563EB]" />
                        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B2545]">
                          Approach
                        </h3>
                      </div>

                      <ul className="space-y-2.5">
                        {cs.approach.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-[14.5px] sm:text-[15px] text-[#202B36] leading-[1.6]"
                          >
                            <CheckCircle2 className="w-4.5 h-4.5 text-[#2563EB] shrink-0 mt-1" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-5 border-t border-[#DCE3EA]">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                        <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0B2545]">
                          Summary
                        </h3>
                      </div>
                      <p className="text-[14.5px] sm:text-[15.5px] text-[#202B36]/90 leading-[1.7]">
                        {cs.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* BOTTOM CTA */}
          <div className="mt-14 rounded-[18px] bg-white border border-[#DCE3EA] p-7 sm:p-10 shadow-[0_12px_32px_-12px_rgba(11,37,69,0.09)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-[660px]">
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B2545]">
                Facing a Similar Safety or Architecture Challenge?
              </h2>
              <p className="text-[15px] text-[#315B7D] mt-2 leading-[1.6]">
                Whether you need a rapid ASIL-D feasibility study, multi-supplier TSC
                alignment, or an exhaustive SEooC assessment, our engineering team is
                ready to partner with you.
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
                    isPage: true,
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
    </div>
  );
};

