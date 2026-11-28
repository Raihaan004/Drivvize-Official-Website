'use client';

import React, { useEffect, useState } from 'react';
import Nav from '@/components/premium-home/Nav';
import Footer from '@/components/premium-home/Footer';
import ServiceStory, { type ServiceItem } from './ServiceStory';
import { TrainingsSection } from './TrainingsSection';

const FUSA: ServiceItem[] = [
  {
    title: 'ISO 26262 Process Setup',
    image: '/images/services_img/functional_safety/FS-img1.jpg',
    body: 'Having an ISO 26262 compliant in-house organizational process adds credibility to your Customers about your company’s safety culture and capability to build safe products. We help build this process for you so that you are fully ready to get your Organization certified for ASIL-D',
  },
  {
    title: 'Hazard Analysis and Risk Assessment',
    image: '/images/services_img/functional_safety/FS-img2.jpg',
    body: 'For any safety-relevant ECU, every function of the ECU seems to be critical. We help you precisely determine the hazards of your ECUs and its risk levels, in order to confidently derive your ECU’s safety goals, safe states and FTTIs. This ways, we neither over-define safety goals nor leave hazards unmitigated.',
  },
  {
    title: 'Functional Safety Concepts',
    image: '/images/services_img/functional_safety/FS-img3.jpg',
    body: 'We go further beyond the HARA and develop functional safety concepts, so that the vehicle architecture is fully safety-ready and the functional safety requirements and HW metrics for each system are clearly identified',
  },
  {
    title: 'Technical Safety Concepts',
    image: '/images/services_img/functional_safety/FS-img4.jpg',
    body: 'A well-defined system architecture and robust safety concepts sets the base for engineering the system just-right for safety, thereby avoiding over-engineering. It also enables to take the right decisions for SW and HW development upfront. No two Systems are the same; hence, reuse decisions for safety concepts may turn out to be engineering-pricey. We are experts in understanding your Systems, its features and constraints and building the right kind of Safety concepts for it.',
  },
  {
    title: 'Safety Analysis & Dependent failure analysis at System, Software and Hardware',
    image: '/images/services_img/functional_safety/FS-img5.jpg',
    body: 'Top-down and Bottom-up Safety Analysis approaches are needed for functional safety. Safety analysis at any level needs an accurate understanding of the architecture and a systematic methodology. A well-done safety analysis results in an error-free design, mitigating >90% of the risks in your product. We have done this over and over again for extremely complex systems with high-redundancy and have blown away regulatory bodies with our FMEA competency. We also have a strong knowledge of dependent failure initiators and our proprietary ‘master’ list of initiators which we have built based on decades of experience. So, trust us to cover it all.',
  },
  {
    title: 'Product Audits and Assessments',
    image: '/images/services_img/functional_safety/FS-img6.jpg',
    body: 'Any Safety-critical product needs to be assessed for its achievement of ISO 26262 requirements and readiness for its required ASIL level. We perform exhaustive technical assessments of products, be it a System, or just a part of Software or Hardware to make sure they do not introduce unacceptable risks during operation. Clients count on us for our deep technical skills that comes from our practical experience of building automotive products. We don’t just find gaps but also propose solutions to help you mitigate it.',
  },
  {
    title: 'Safety Element out of context (SEooC)',
    image: '/images/services_img/functional_safety/FS-img7.jpg',
    body: 'This is the “trend” in functional safety. OS, Software Stacks, Micro controllers, ASICs, Other complex ICs, even Systems have been thought of as SEooCs. Defining the assumptions of use becomes the most critical challenge in SEooC development, else it can invalidate the achievement of ASIL for the product using the SEooC. However, how to ensure that all AoUs are covered, and nothing has been missed? This is where we bring in our experience and knowledge to help you get it right.',
  },
  {
    title: 'Qualification',
    image: '/images/services_img/functional_safety/FS-img8.jpg',
    body: 'Qualification is a strategy used in functional safety for re-using hardware and software built without ISO 26262 considerations. It can turn out to be a risky proposition if the gap analysis between the existing product and the required one is not done well. We do a rigorous gap analysis to identify these risks and propose suitable solutions to mitigate them',
  },
  {
    title: 'Supplier Management',
    image: '/images/services_img/functional_safety/FS-img9.jpg',
    body: 'For an OEM, managing multiple suppliers for different ECUs is an exhaustive task. Ensuring that the Suppliers follow safety practices and solutions implies getting a deeper peek into their development. However, OEMs don’t get access to the supplier workproducts, stating proprietary rights.  We help OEMs in defining the right DIA with suppliers and regularly monitor the safety progress of their suppliers.',
  },
];

const CYBER: ServiceItem[] = [
  {
    title: 'ISO 21434 Process Setup',
    image: '/images/services_img/cybersecurity/CS-img1.jpg',
    body: 'Having an ISO 21434 compliant in-house organizational process adds credibility to your Customers about your company’s cybersecurity culture and capability to build secure products. We help build this process for you so that you are fully ready to get your Organization certified for cybersecurity. We also extend this to cover EU-CRA compliance.',
  },
  {
    title: 'Threat Analysis and Risk Assessment',
    image: '/images/services_img/cybersecurity/CS-img2.jpg',
    body: 'We accurately identify the assets of your systems for which the CIA can be compromised, and how these may be attacked. By taking a systematic approach to identify threat & damage scenarios, we treat the associated risks by taking the right actions, including defining the cybersecurity goals of your system.',
  },
  {
    title: 'Cybersecurity Concepts',
    image: '/images/services_img/cybersecurity/CS-img3.jpg',
    body: 'As a next step after the TARA, we define the cybersecurity concept for the product, which involves defining the crucial security mechanisms that must be implemented in the system to be robustness against threats',
  },
  {
    title: 'Vulnerability Analysis',
    image: '/images/services_img/cybersecurity/CS-img4.jpg',
    body: 'Vulnerability analysis is a continuous activity that is initiated during TARA and is continued during SW architecture, verification and validation and extends after SOP. It is also used to update threat scenarios, refine cybersecurity claims and influences architectural decisions. We bring in our deep expertise in Systems thinking and Software to identify, mitigate and manage the vulnerabilities of your product.',
  },
];

const TABS = [
  { id: 'functional-safety', label: 'Functional Safety' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'trainings', label: 'Trainings' },
];

export function ServicesClient() {
  const [active, setActive] = useState(TABS[0].id);

  // honour /services#trainings on first load
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 150);
  }, []);

  useEffect(() => {
    const on = () => {
      let a = TABS[0].id;
      TABS.forEach((t) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) a = t.id;
      });
      setActive(a);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const jump = (id: string) => {
    window.history.replaceState({}, '', `/services#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-ink selection:bg-signal selection:text-ink">
      <Nav />
      <main>
        {/* hero */}
        <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink text-white">
          <img
            src="/images/services_img/service-banner.jpg"
            alt=""
            className="kenburns absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,16,24,0.85),rgba(10,16,24,0.35)),linear-gradient(0deg,rgba(10,16,24,0.7),transparent_50%)]" />
          <div className="mx-auto w-full max-w-[1320px] px-6 pb-20 pt-40 lg:px-10 lg:pb-24">
            <p className="eyebrow fade-up mb-6 text-signal">Services</p>
            <h1 className="title max-w-4xl text-[clamp(2.8rem,7vw,6.2rem)] text-white">
              {['Safe', 'and', 'secure', 'by', 'design.'].map((w, i) => (
                <span key={w} className="word mr-[0.22em]">
                  <span
                    className={
                      i === 0 || i === 2 ? 'font-semibold text-white' : 'text-white/80'
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
              Functional Safety Services, Cybersecurity Services and Trainings.
            </p>
            <div
              className="fade-up mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: '1.1s' }}
            >
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => jump(t.id)}
                  className={`rounded-full px-6 py-3.5 text-[14px] font-bold transition-all hover:-translate-y-0.5 ${
                    i === 0
                      ? 'bg-signal text-ink'
                      : 'border border-white/40 font-semibold text-white hover:bg-white hover:text-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* sticky section tabs */}
        <div className="sticky top-16 sm:top-20 z-30 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1320px] gap-8 overflow-x-auto px-6 lg:px-10">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => jump(t.id)}
                className={`relative whitespace-nowrap py-4 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  active === t.id ? 'text-ink' : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {t.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-signal transition-transform duration-500 ${
                    active === t.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <ServiceStory
          id="functional-safety"
          eyebrow="Functional Safety Services"
          title={
            <>
              From concept to <b>ASIL-ready.</b>
            </>
          }
          items={FUSA}
        />

        <ServiceStory
          id="cybersecurity"
          dark
          eyebrow="Cybersecurity Services"
          title={
            <>
              Secure by <b>design.</b>
            </>
          }
          items={CYBER}
        />

        {/* trainings */}
        <TrainingsSection />
      </main>
      <Footer />
    </div>
  );
}

export default ServicesClient;
