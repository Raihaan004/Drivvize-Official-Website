'use client';

import React, { useEffect, useState } from 'react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import { Photo, Reveal } from '@/components/premium-home/hooks';

type Case = {
  id: string;
  tab: string;
  tag: string;
  title: string;
  client: string;
  image: string;
  position?: string;
  stats: { v: string; l: string }[];
  paras: string[];
  bullets: string[];
  approach: string[];
  summary: string;
};

const CASES: Case[] = [
  {
    id: 'epb',
    tab: 'Electronic Park Brake',
    tag: 'Technical Safety Concept',
    title: 'Technical Safety concept for an ASIL-B Electronic park brake System',
    client: 'Indian Tier-1',
    image: '/images/case_studies_img/cs-1.jpg',
    stats: [
      { v: 'ASIL-B', l: 'Safety level' },
      { v: '2 Tier-1s', l: 'Jointly developed' },
      { v: '1 month', l: 'Time span' },
    ],
    paras: [
      'An Indian Tier-1 company developing a part of an Electronic Park brake systems needed to develop a technical safety concept for their system. There were 2 challenges.',
    ],
    bullets: [
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
      'The Technical Safety concept was defined for each safety goal with a clear identification of the safety related failure modes and elements. By proactively performing a clear boundary definition between the two Tier-1s in terms of system boundary and FSR scope, we won the confidence and appreciation of the OEM. We also clearly communicated all the technical dependencies to the other Tier-1, in other to achieve a robust safety concept.',
  },
  {
    id: 'steer-by-wire',
    tab: 'Steer-by-wire',
    tag: 'Feasibility Study',
    title: 'Feasibility Study for achieving ASIL-D for a Steer-by-wire System',
    client: 'European Tier-1',
    image: '/images/case_studies_img/cs-2.jpg',
    stats: [
      { v: 'ASIL-D', l: 'Highest ASIL level' },
      { v: '2 months', l: 'Time span' },
      { v: '4 steps', l: 'From HAZOP to FMEA' },
    ],
    paras: [
      'A European Tier-1 company developing Steer-by-wire Systems needed to understand how their existing system architecture needs to be modified to achieve functional safety goals, at the highest ASIL level of ASIL D.',
      'The challenge was to provide a technical solution to the Customer within a short time span of 2 months',
    ],
    bullets: [],
    approach: [
      'Define Item Boundary and Functionalities',
      'Perform HAZOP (Hazard and Operability study) based malfunction analysis to identify the Hazards of the Steer-by-wire System',
      'Perform a Rapid HARA to define the Safety goals of the System and their ASIL levels',
      'Perform an FMEA based Safety analysis of the critical HW and SW elements of the System',
    ],
    summary:
      'Based on the HAZOP, Rapid HARA and FMEA, we identified all the crucial technical modifications needed in the system such as system elements needing diversified redundancy, the decisions related to double or triple redundancy to meet fail-operational requirements, and redundancy for other components such as power supplies, communication, encoders etc.',
  },
  {
    id: 'autosar',
    tab: 'AUTOSAR Platform',
    tag: 'SW Assessment',
    title: 'SW Assessment for ASIL D AUTOSAR Platform',
    client: 'Indian Tier-2',
    image: '/images/case_studies_img/cs-3.jpg',
    stats: [
      { v: '200+', l: 'SW Safety work products' },
      { v: '50+', l: 'Gaps found in the first 3 days' },
      { v: '100+', l: 'Verification & validation gaps' },
    ],
    paras: [
      'An Indian Tier-2 company developing an ASIL-D AUTOSAR Stack approached us for an Assessment of their SW SEooC in accordance to ISO 26262.',
      'The Customer’s intent was to use our Assessment to identify all their safety gaps before going for an External Certification body.',
      'The Customer wanted an extremely rigorous/technically exhaustive assessment to be performed within 1 month and there were 200+ SW Safety Work products developed for the platform.',
    ],
    bullets: [],
    approach: [
      'Define an Assessment checklist tailored to the Platform that addresses all ISO 26262 requirements, and also considers typical SW Safety pitfalls known from experience',
      'Focus on the SW SEooC Strategy to identify major gaps in strategy definition',
      'Rigorous assessment of SW Safety requirements and design',
      'In-depth assessment of SW Safety analysis and SW DFA methodologies',
      'Verification and Validation approaches of SW SEooC with a more specific focus on worst-case and corner cases',
      'Focus on the strategy for identifying AoUs (assumptions of use) and the correctness and completeness of the safety manual',
    ],
    summary:
      'By taking a methodical approach to the Assessment and leveraging our strong SW experience to locate common pitfalls, we were able to identify 50+ gaps within the first 3 days of Assessments. Our rigor in assessing the SW Safety analysis and DFA, and AoUs revealed 50+ major/critical gaps that needed SW updates. We also identified 100+ gaps related to verification & validation, which lead to improving the test cases, analysis &  reviews, thereby giving complete confidence to the Customer on the safety case.',
  },
  {
    id: 'adas',
    tab: 'L2+ ADAS',
    tag: 'Technical Safety Concept',
    title: 'Technical Safety Concept for a L2+ ADAS System',
    client: 'American OEM',
    image: '/images/case_studies_img/cs-4.jpg',
    stats: [
      { v: '25+', l: 'ADAS features' },
      { v: '>64', l: 'Safety Goals' },
      { v: 'ASIL-D', l: 'ADAS Domain Controller' },
    ],
    paras: [
      'An American OEM had defined an L2+ ADAS system with 25+ ADAS features and > 64 Safety Goals.',
      'The System had 5 Radars, a Front Camera, 12 Ultrasonic sensors and 4 surround view cameras besides an ASIL-D ADAS Domain Controller.',
      'The Challenge was to define the technical safety concepts for >64 Safety goals with the intent to add technical safety mechanisms without leading to too high a complexity in terms of implementation, so that the balance between functionality and safety is achieved.',
    ],
    bullets: [],
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
  },
  {
    id: 'oem',
    tab: 'OEM Solution',
    tag: 'Complete Solution · Ongoing',
    title: 'Complete Functional Safety Solution for an OEM (Ongoing)',
    client: 'OEM',
    image: '/images/case_studies_img/cs-5.jpg',
    stats: [
      { v: 'ISO 26262', l: 'Combined with EN 50128/9' },
      { v: 'ASIL-D', l: 'Compliance target' },
      { v: 'Ongoing', l: 'Engagement' },
    ],
    paras: [
      'An OEM is developing a special kind of ‘Vehicle’ that is a combination of a Railway and an automotive system. Some of the key challenges are:',
    ],
    bullets: [
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
  },
];

const pad = (n: number) => String(n + 1).padStart(2, '0');
const jump = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function CaseStudiesClient() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const on = () => {
      let a = -1;
      const triggerY = window.innerHeight * 0.45;
      CASES.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            a = i;
          }
        }
      });
      if (a >= 0) setActive(a);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main>
        {/* hero */}
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink text-white">
          <img
            src="/images/case_studies_img/case-banner.jpg"
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.85),rgba(10,16,24,0.35)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Case Studies</p>
            <h1 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white">
              {['Safety', 'proven', 'on', 'real', 'programs.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 0 || i === 4 ? 'font-semibold text-white' : 'text-white/80'
                    }
                    style={{ animationDelay: `${150 + i * 100}ms` }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="fade-up mt-8 max-w-lg text-[17px] leading-relaxed text-white/75"
              style={{ animationDelay: '0.9s' }}
            >
              From electronic park brakes and steer-by-wire to AUTOSAR platforms, L2+ ADAS
              and a railway-automotive vehicle.
            </p>
          </div>
        </section>

        {/* index */}
        <section className="py-28 lg:py-36">
          <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
            <Reveal className="mb-14 flex items-center gap-4">
              <p className="eyebrow text-brand">{CASES.length} case studies</p>
              <span className="h-px flex-1 bg-ink/10" />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {CASES.map((c, i) => (
                <Reveal key={c.id} delay={i * 80}>
                  <button
                    onClick={() => jump(c.id)}
                    className="group relative block aspect-[3/4] w-full overflow-hidden bg-deep text-left text-white"
                  >
                    <img
                      src={c.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                      style={{ objectPosition: c.position }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/5" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mb-2 text-xs font-bold tabular-nums text-signal">{pad(i)}</p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
                        {c.tag}
                      </p>
                      <p className="mt-1.5 text-lg font-light leading-snug tracking-tight text-white">
                        {c.tab}
                      </p>
                    </div>
                    <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* sticky tabs */}
        <div className="sticky top-16 sm:top-20 z-30 border-y border-ink/10 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1320px] gap-8 overflow-x-auto px-6 lg:px-10">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => jump(c.id)}
                className={`relative flex items-baseline gap-2 whitespace-nowrap py-4 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  active === i ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                <span className="tabular-nums text-brand">{pad(i)}</span>
                {c.tab}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-signal transition-transform duration-500 ${
                    active === i ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* cases */}
        {CASES.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            className={`scroll-mt-32 py-24 lg:py-36 ${i % 2 ? 'bg-paper' : 'bg-white'}`}
          >
            <div className="mx-auto max-w-[1320px] px-6 lg:px-10">
              <Reveal className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-9">
                  <p className="eyebrow mb-6 flex items-center gap-4 text-brand">
                    <span className="tabular-nums">{pad(i)}</span>
                    <span className="h-px w-10 bg-brand/40" />
                    {c.tag}
                  </p>
                  <h2 className="title text-[clamp(2rem,4.2vw,3.6rem)] text-ink">
                    {c.title}
                  </h2>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/50 lg:col-span-3 lg:text-right">
                  Client
                  <span className="mt-1 block text-lg normal-case tracking-tight text-ink">
                    {c.client}
                  </span>
                </p>
              </Reveal>

              <Photo
                src={c.image}
                alt={c.tab}
                className="aspect-[21/9]"
                speed={0.07}
                position={c.position}
              />

              <div className="grid grid-cols-1 border-b border-ink/10 sm:grid-cols-3">
                {c.stats.map((s, k) => (
                  <Reveal
                    key={s.l}
                    delay={k * 90}
                    className="border-t border-ink/10 py-8 pr-6 sm:border-t-0 sm:py-10"
                  >
                    <p className="title text-[clamp(2.2rem,4vw,3.6rem)] !font-extralight leading-none text-deep">
                      {s.v}
                    </p>
                    <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/50">
                      {s.l}
                    </p>
                  </Reveal>
                ))}
              </div>

              <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-4">
                  <div className="bg-deep p-8 text-white lg:sticky lg:top-40 lg:p-10">
                    <p className="eyebrow mb-6 !text-[11px] text-signal">Problem Statement</p>
                    {c.paras.map((p) => (
                      <p
                        key={p}
                        className="mb-5 text-[15.5px] leading-[1.7] text-white/80 last:mb-0"
                      >
                        {p}
                      </p>
                    ))}
                    {c.bullets.length > 0 && (
                      <ul className="mt-6 space-y-4">
                        {c.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex gap-3 text-[15.5px] leading-[1.7] text-white/80"
                          >
                            <i className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rotate-45 bg-signal" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>

                <div className="lg:col-span-8">
                  <Reveal>
                    <p className="eyebrow mb-6 text-ink">Approach</p>
                  </Reveal>
                  <ol>
                    {c.approach.map((a, k) => (
                      <Reveal as="li" key={a} delay={(k % 3) * 60}>
                        <div className="group flex gap-5 border-t border-ink/10 py-5 transition-all duration-300 hover:pl-2 sm:gap-8">
                          <span className="w-6 shrink-0 pt-1 text-sm font-bold tabular-nums text-brand">
                            {String(k + 1).padStart(2, '0')}
                          </span>
                          <p className="text-[clamp(1.05rem,1.5vw,1.3rem)] font-medium leading-snug tracking-tight text-ink">
                            {a}
                          </p>
                        </div>
                      </Reveal>
                    ))}
                    <li className="border-t border-ink/10" />
                  </ol>

                  <Reveal className="mt-14">
                    <p className="eyebrow mb-6 text-ink">Summary</p>
                    <p className="title border-l-[3px] border-signal pl-6 text-[clamp(1.2rem,1.85vw,1.65rem)] !leading-[1.5] text-ink/70">
                      {c.summary}
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default CaseStudiesClient;
