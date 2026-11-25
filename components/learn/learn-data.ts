import { IMG } from '@/components/premium-home/data'

export const FSF_URL = 'https://www.functionalsafetyfirst.com/'
export const YOUTUBE_URL = 'https://www.youtube.com/@functionalsafety7935'

export type Block = { t: 'p'; x: string } | { t: 'h'; x: string } | { t: 'ul'; x: string[] }
export type Post = {
  slug: string
  title: string
  category: 'Functional Safety' | 'Cybersecurity' | 'Case Study'
  excerpt: string
  image: string
  blocks: Block[]
}

/**
 * Starter articles, written from the copy on the Services and Case Studies pages.
 */
export const POSTS: Post[] = [
  {
    slug: 'why-every-function-seems-critical',
    title: 'Why every function of a safety-relevant ECU seems critical',
    category: 'Functional Safety',
    excerpt: 'Hazard analysis and risk assessment turn “everything is critical” into precise safety goals, safe states and FTTIs.',
    image: IMG.aerialRoad,
    blocks: [
      { t: 'p', x: 'For any safety-relevant ECU, every function of the ECU seems to be critical.' },
      { t: 'h', x: 'Hazard Analysis and Risk Assessment' },
      { t: 'p', x: 'We help you precisely determine the hazards of your ECUs and its risk levels, in order to confidently derive your ECU’s safety goals, safe states and FTTIs. This ways, we neither over-define safety goals nor leave hazards unmitigated.' },
      { t: 'h', x: 'Beyond the HARA' },
      { t: 'p', x: 'We go further beyond the HARA and develop functional safety concepts, so that the vehicle architecture is fully safety-ready and the functional safety requirements and HW metrics for each system are clearly identified.' },
    ],
  },
  {
    slug: 'seooc-assumptions-of-use',
    title: 'SEooC: the “trend” in functional safety, and why assumptions of use decide everything',
    category: 'Functional Safety',
    excerpt: 'OS, software stacks, microcontrollers, ASICs and even systems are treated as SEooCs. Getting the AoUs right is the real challenge.',
    image: IMG.neon,
    blocks: [
      { t: 'p', x: 'Safety Element out of context (SEooC) is the “trend” in functional safety. OS, Software Stacks, Micro controllers, ASICs, Other complex ICs, even Systems have been thought of as SEooCs.' },
      { t: 'p', x: 'Defining the assumptions of use becomes the most critical challenge in SEooC development, else it can invalidate the achievement of ASIL for the product using the SEooC.' },
      { t: 'h', x: 'The question to ask' },
      { t: 'p', x: 'However, how to ensure that all AoUs are covered, and nothing has been missed? This is where experience and knowledge help you get it right.' },
    ],
  },
  {
    slug: 'qualification-reusing-hardware-and-software',
    title: 'Qualification: re-using hardware and software built without ISO 26262',
    category: 'Functional Safety',
    excerpt: 'Re-use can turn out to be a risky proposition if the gap analysis between the existing product and the required one is not done well.',
    image: IMG.clusterBw,
    blocks: [
      { t: 'p', x: 'Qualification is a strategy used in functional safety for re-using hardware and software built without ISO 26262 considerations.' },
      { t: 'p', x: 'It can turn out to be a risky proposition if the gap analysis between the existing product and the required one is not done well.' },
      { t: 'h', x: 'What a rigorous gap analysis does' },
      { t: 'p', x: 'A rigorous gap analysis identifies these risks and proposes suitable solutions to mitigate them.' },
    ],
  },
  {
    slug: 'supplier-management-and-the-dia',
    title: 'Supplier management for OEMs: getting the DIA right',
    category: 'Functional Safety',
    excerpt: 'OEMs need a deeper look into supplier development, yet rarely get access to supplier work products.',
    image: IMG.office,
    blocks: [
      { t: 'p', x: 'For an OEM, managing multiple suppliers for different ECUs is an exhaustive task.' },
      { t: 'p', x: 'Ensuring that the Suppliers follow safety practices and solutions implies getting a deeper peek into their development. However, OEMs don’t get access to the supplier workproducts, stating proprietary rights.' },
      { t: 'h', x: 'A workable way through' },
      { t: 'p', x: 'Defining the right DIA with suppliers, and regularly monitoring the safety progress of those suppliers, keeps safety visible without needing access to proprietary work products.' },
    ],
  },
  {
    slug: 'from-tara-to-cybersecurity-concepts',
    title: 'From TARA to cybersecurity concepts',
    category: 'Cybersecurity',
    excerpt: 'Identify the assets whose CIA can be compromised, understand how they may be attacked, then define the mechanisms that protect them.',
    image: IMG.servers,
    blocks: [
      { t: 'h', x: 'Threat Analysis and Risk Assessment' },
      { t: 'p', x: 'The first step is to accurately identify the assets of your systems for which the CIA can be compromised, and how these may be attacked. By taking a systematic approach to identify threat & damage scenarios, the associated risks can be treated by taking the right actions, including defining the cybersecurity goals of your system.' },
      { t: 'h', x: 'Cybersecurity Concepts' },
      { t: 'p', x: 'As a next step after the TARA, define the cybersecurity concept for the product, which involves defining the crucial security mechanisms that must be implemented in the system to be robust against threats.' },
    ],
  },
  {
    slug: 'vulnerability-analysis-does-not-stop-at-sop',
    title: 'Vulnerability analysis does not stop at SOP',
    category: 'Cybersecurity',
    excerpt: 'It starts during TARA, continues through architecture, verification and validation, and extends after start of production.',
    image: IMG.code,
    blocks: [
      { t: 'p', x: 'Vulnerability analysis is a continuous activity that is initiated during TARA and is continued during SW architecture, verification and validation and extends after SOP.' },
      { t: 'p', x: 'It is also used to update threat scenarios, refine cybersecurity claims and influences architectural decisions.' },
      { t: 'h', x: 'Systems thinking, plus software depth' },
      { t: 'p', x: 'Deep expertise in Systems thinking and Software is what lets you identify, mitigate and manage the vulnerabilities of your product.' },
    ],
  },
  {
    slug: 'asil-d-steer-by-wire-feasibility',
    title: 'Feasibility study for ASIL-D on a steer-by-wire system, in two months',
    category: 'Case Study',
    excerpt: 'HAZOP, a Rapid HARA and an FMEA revealed exactly where the architecture needed diversified redundancy.',
    image: IMG.wheel,
    blocks: [
      { t: 'p', x: 'A European Tier-1 company developing Steer-by-wire Systems needed to understand how their existing system architecture needed to be modified to achieve functional safety goals, at the highest ASIL level of ASIL D, within a short time span of 2 months.' },
      { t: 'h', x: 'Approach' },
      {
        t: 'ul',
        x: [
          'Define Item Boundary and Functionalities',
          'Perform HAZOP (Hazard and Operability study) based malfunction analysis to identify the Hazards of the Steer-by-wire System',
          'Perform a Rapid HARA to define the Safety goals of the System and their ASIL levels',
          'Perform an FMEA based Safety analysis of the critical HW and SW elements of the System',
        ],
      },
      { t: 'h', x: 'Outcome' },
      { t: 'p', x: 'Based on the HAZOP, Rapid HARA and FMEA, all the crucial technical modifications needed in the system were identified, such as system elements needing diversified redundancy, the decisions related to double or triple redundancy to meet fail-operational requirements, and redundancy for other components such as power supplies, communication, encoders etc.' },
    ],
  },
]

export const readMinutes = (p: Post) => {
  const words = p.blocks.map((b) => (b.t === 'ul' ? b.x.join(' ') : b.x)).join(' ').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Teasers for the "Our knowledge mine" section (each links out to Functional Safety First). */
export const KNOWLEDGE = [
  {
    title: 'Technical Safety Concepts',
    para: 'A well-defined system architecture and robust safety concepts sets the base for engineering the system just-right for safety, thereby avoiding over-engineering. No two Systems are the same; hence, reuse decisions for safety concepts may turn out to be engineering-pricey.',
  },
  {
    title: 'Safety Analysis & Dependent Failure Analysis',
    para: 'Top-down and Bottom-up Safety Analysis approaches are needed for functional safety. Safety analysis at any level needs an accurate understanding of the architecture and a systematic methodology.',
  },
  {
    title: 'Product Audits and Assessments',
    para: 'Any Safety-critical product needs to be assessed for its achievement of ISO 26262 requirements and readiness for its required ASIL level. A good assessment doesn’t just find gaps but also proposes solutions to mitigate them.',
  },
  {
    title: 'Functional Safety Concepts',
    para: 'Going further beyond the HARA, functional safety concepts make the vehicle architecture fully safety-ready, with the functional safety requirements and HW metrics for each system clearly identified.',
  },
]

export const VIDEOS = [
  {
    title: 'Automotive Functional Safety ISO26262 Systems Part 4 Webinar',
    tag: 'ISO 26262 Part 4',
    url: 'https://www.youtube.com/watch?v=ZXzJEk5Vn8k',
    image: 'https://i.ytimg.com/vi/ZXzJEk5Vn8k/hqdefault.jpg',
  },
  {
    title: 'Drivvize FuSa Connect 2',
    tag: 'FuSa Connect',
    url: 'https://youtu.be/F3v5mv1oikA?si=zPUJLdgPt42vVgVD',
    image: 'https://i.ytimg.com/vi/F3v5mv1oikA/hqdefault.jpg',
  },
  {
    title: 'FMEDA Random HW Fault Classification',
    tag: 'Hardware Safety',
    url: 'https://youtu.be/TwOa3HIGjWI?si=JqwbKpDnkh-FlLs0',
    image: 'https://i.ytimg.com/vi/TwOa3HIGjWI/hqdefault.jpg',
  },
  {
    title: 'Flow of Functional Safety Requirements',
    tag: 'Functional Safety',
    url: 'https://youtu.be/7nmI11ORzyY?si=ElLRzcRk0edqU3Rj',
    image: 'https://i.ytimg.com/vi/7nmI11ORzyY/hqdefault.jpg',
  },
]

/** Set `file` (e.g. '/downloads/iso-26262-kit.pdf' in /public) once a document exists. */
export const DOWNLOADS: { title: string; note: string; image: string; file?: string }[] = [
  { title: 'ISO 26262 Kit overview', note: 'Basic, Custom and Consultant editions', image: IMG.cluster },
  { title: 'Functional Safety Services', note: 'From process setup to supplier management', image: IMG.aerialRoad },
  { title: 'Cybersecurity Services', note: 'ISO 21434, TARA and EU-CRA', image: IMG.padlock },
  { title: 'Training catalogue', note: 'Foundations, ISO 26262 parts and certification', image: IMG.laptop },
]

