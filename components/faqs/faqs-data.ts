export type FaqCategory =
  | 'All'
  | 'Functional Safety'
  | 'Cybersecurity & CRA'
  | 'Trainings'
  | 'Processes & Certification'
  | 'OEM & ECUs';

export type FaqBlock =
  | { type: 'p'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: [string, string, string]; rows: [string, string, string][] };

export type FaqItem = {
  id: string;
  question: string;
  category: Exclude<FaqCategory, 'All'>;
  blocks: FaqBlock[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  'All',
  'Functional Safety',
  'Cybersecurity & CRA',
  'Trainings',
  'Processes & Certification',
  'OEM & ECUs',
];

export const FAQS: FaqItem[] = [
  {
    id: 'services-offered',
    question: 'What services does Drivvize offer?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'Drivvize offers the following services:' },
      {
        type: 'list',
        items: [
          'Functional Safety Support (ISO 26262, SOTIF, PAS 8800)',
          'Cybersecurity Support (ISO 21434)',
          'ASPICE Process Support',
        ],
      },
    ],
  },
  {
    id: 'functional-safety-services',
    question: 'What services does Drivvize offer with respect to Functional Safety?',
    category: 'Functional Safety',
    blocks: [
      { type: 'heading', text: 'Systems' },
      {
        type: 'list',
        items: [
          'Technical Safety Concept',
          'System Safety Analysis (FMEA & FTA)',
          'Safety Manual Analysis',
          'Consultation on System Verification & Validation',
        ],
      },
      { type: 'heading', text: 'Hardware' },
      {
        type: 'list',
        items: [
          'HW Safety Requirements (HSR)',
          'Design FMEA (DFMEA)',
          'FMEDA',
          'FTA',
          'Dependent Failure Analysis (DFA)',
        ],
      },
      { type: 'heading', text: 'Software' },
      {
        type: 'list',
        items: [
          'SW Safety Analysis',
          'SW Safety Requirements (SSR) & Architecture',
          'SW Safety Manual Analysis',
          'SW Component Qualification',
          'Dependent Failure Analysis (DFA)',
          'Consultation on SW Verification & Testing',
        ],
      },
    ],
  },
  {
    id: 'microcontroller-os-tools-selection',
    question:
      'Does Drivvize help an organization with their microcontroller, complex ICs, Operating System (OS) & tools selection?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Drivvize guides an organization by working closely with them in microcontroller, complex ICs, Operating System (OS) & tools selection. We support the organization by suggesting various options & we even work directly with potential vendors.',
      },
    ],
  },
  {
    id: 'semiconductor-fusa',
    question: 'Does Drivvize support in Functional Safety Semiconductor development?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Drivvize is capable of handling Semiconductor related FuSa development activities.',
      },
    ],
  },
  {
    id: 'cybersecurity-iso-21434',
    question: 'What services does Drivvize offer with respect to Cybersecurity (ISO 21434)?',
    category: 'Cybersecurity & CRA',
    blocks: [
      {
        type: 'p',
        text: 'Drivvize provides complete end to end support for an organization with respect to Cybersecurity implementation. A non-exhaustive list of activities is given below:',
      },
      {
        type: 'list',
        items: [
          'Cybersecurity policy, rules & process establishment',
          'Cybersecurity Interface Agreement (CIA)',
          'Threat Analysis & Risk Assessment (TARA)',
          'Cybersecurity Goals',
          'Technical Security Concept',
          'Cybersecurity Requirements',
          'Vulnerability analysis and management',
        ],
      },
    ],
  },
  {
    id: 'eu-cra-compliance',
    question: 'Does Drivvize support in EU Cyber Resilience Act (CRA) compliance?',
    category: 'Cybersecurity & CRA',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Drivvize has a team of experts who could help organizations in their EU CRA journey.',
      },
    ],
  },
  {
    id: 'trainings-offered',
    question: 'What trainings does Drivvize offer?',
    category: 'Trainings',
    blocks: [
      {
        type: 'table',
        headers: ['S. No', 'Training Topic', 'Training Duration'],
        rows: [
          ['1', 'Automotive Functional Safety Basics', '1 day'],
          ['2', 'ISO 26262 Part-3 Concept Safety Training', '0.75 day'],
          ['3', 'ISO 26262 Part-4 Systems Safety Training', '1 day'],
          ['4', 'ISO 26262 Part-5 Hardware Safety Training', '1 day'],
          ['5', 'ISO 26262 Part-6 Software Safety Training', '1 day'],
          ['6', 'ISO 26262 Part-7 Manufacturing Training', '0.5 day'],
          ['7', 'Safety Element out of context (SEOOC) – Training', '0.75 day'],
          ['8', 'Software Safety Analysis and Dependent Failure Analysis Training', '1 day'],
          ['9', 'Technical Safety Concept', '1 day'],
          ['10', 'Training for Functional Safety Managers', '1 day'],
          ['11', 'Functional Safety All Parts training', '4 days'],
          ['12', 'ISO/PAS 21448 - SOTIF Training', '1 day'],
          ['13', 'Introduction to ISO/PAS 8800:2024 (AI Safety)', '1 day'],
          ['14', 'ISO 26262 Customized Trainings', 'depends on the customization'],
          ['15', 'Functional Safety – Leadership Training', '1 day'],
        ],
      },
    ],
  },
  {
    id: 'custom-organization-trainings',
    question: 'Do we offer trainings exclusively for organizations?',
    category: 'Trainings',
    blocks: [
      {
        type: 'p',
        text: 'Yes. Drivvize provides customized trainings to organizations based on their specific need.',
      },
      {
        type: 'p',
        text: 'Some of the custom trainings we have provided till now include:',
      },
      {
        type: 'list',
        items: [
          'SW Safety Training',
          'Introduction to Functional Safety',
          'Technical Safety Concept & Requirement creation',
        ],
      },
      {
        type: 'p',
        text: 'Please get in touch with us by emailing to consult@drivvize.com in case you have any specific topics to be covered.',
      },
    ],
  },
  {
    id: 'audits-and-assessments',
    question: 'Does Drivvize perform Audits & Assessments?',
    category: 'Processes & Certification',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'We have done multiple audits & technical assessments for our clients. We have an extensive checklist available (created based on our experience) using which we perform the audits.',
      },
    ],
  },
  {
    id: 'asil-certification',
    question: 'Does Drivvize provide ASIL certification for process or products?',
    category: 'Processes & Certification',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Drivvize has tied up with a Certification body that can provide process and product certification and is able to support the Customer to get their end-product or process certified.',
      },
    ],
  },
  {
    id: 'types-of-certifications',
    question: 'What are the kind of certifications that an organization could achieve?',
    category: 'Processes & Certification',
    blocks: [
      {
        type: 'p',
        text: 'There are 2 possible certifications an organization could achieve:',
      },
      { type: 'heading', text: 'Process certification' },
      {
        type: 'p',
        text: 'The development process of an organization is evaluated.',
      },
      { type: 'heading', text: 'Project certification' },
      {
        type: 'p',
        text: 'A specific project is evaluated.',
      },
      {
        type: 'p',
        text: 'Drivvize is capable of supporting organizations in both the certification journeys given above.',
      },
    ],
  },
  {
    id: 'highest-asil',
    question: 'What is the highest ASIL Drivvize could support for customers?',
    category: 'Processes & Certification',
    blocks: [
      {
        type: 'p',
        text: 'Drivvize can support safety projects up to ASIL-D.',
      },
    ],
  },
  {
    id: 'establishing-safety-process',
    question:
      'How does Drivvize help customers in establishing safety process within their organization?',
    category: 'Processes & Certification',
    blocks: [
      {
        type: 'p',
        text: 'Drivvize helps customers who want to establish safety process within their organization by providing them with:',
      },
      {
        type: 'list',
        items: [
          'Workflows – 60+ workflows',
          'Templates – 85+ templates',
          'Guidelines – 50+ guidelines',
          'Checklists – 45+ checklists',
        ],
      },
      {
        type: 'p',
        text: 'We provide all the above at ASIL-D compliance level. We work very closely with an organization in updating the guidelines as per the tools that is used by them. This way, an organization is enabled to move quickly in their safety journey.',
      },
    ],
  },
  {
    id: 'buy-specific-parts',
    question:
      'Is it possible to buy only certain portions (Say only Part-6) of the process templates?',
    category: 'Processes & Certification',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Organizations could choose any specific area of the ISO 26262 standard and buy it from us.',
      },
    ],
  },
  {
    id: 'buy-specific-asil',
    question: 'Is it possible to buy process artifacts for certain ASIL (Say ASIL-B) only?',
    category: 'Processes & Certification',
    blocks: [
      {
        type: 'p',
        text: 'All Drivvize process artifacts are created for ASIL-D compliance. In the case an organization is interested in purchasing the artifacts at a lower ASIL, we will be able to customize them accordingly.',
      },
    ],
  },
  {
    id: 'aspice-compliant',
    question: 'Are Drivvize templates ASPICE compliant?',
    category: 'Processes & Certification',
    blocks: [
      { type: 'p', text: 'Mostly Yes.' },
      {
        type: 'p',
        text: 'There are some specific aspects of ASPICE that are not currently covered by the Drivvize artifacts. We are actively working to address those gaps.',
      },
      {
        type: 'p',
        text: 'Please email to consult@drivvize.com in case of questions relating to this topic.',
      },
    ],
  },
  {
    id: 'sw-development-services',
    question: 'Does Drivvize offer Functional Safety SW development services?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'No.' },
      {
        type: 'p',
        text: 'We are not into SW development activities. However, we have partnered with a Software consulting firm who will be able to support an organizations’ FuSa development.',
      },
    ],
  },
  {
    id: 'fault-injection-testing',
    question: 'Does Drivvize offer Functional Safety Fault Injection Testing services?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'No.' },
      {
        type: 'p',
        text: 'We are not into Fault Injection Testing activities. However, we have partnered with a Software consulting firm who will be able to support an organizations’ FuSa testing needs.',
      },
    ],
  },
  {
    id: 'sw-components-tool-qualification',
    question:
      'Does Drivvize support achieving FuSa compliance for Software Components and Tool development?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Drivvize will be able to help organizations in SW component qualification & tool qualification activities.',
      },
    ],
  },
  {
    id: 'industries-companies-supported',
    question: 'What are the type of industries/companies supported by Drivvize?',
    category: 'OEM & ECUs',
    blocks: [
      {
        type: 'p',
        text: 'Drivvize supports all kinds of industries (Aerospace, Medical, Automotive, Railways, Agriculture etc.) where there is a need relating to functional safety, cybersecurity or process establishment.',
      },
      {
        type: 'p',
        text: 'Any company that is an OEM, Tier-1, Tier-2 or any other company focusing on any specific area in the development cycle is supported by Drivvize.',
      },
    ],
  },
  {
    id: 'sotif-and-ai-safety',
    question: 'Does Drivvize support SOTIF (ISO 21448) and Safety for AI (PAS 8800)?',
    category: 'Functional Safety',
    blocks: [
      { type: 'p', text: 'Yes.' },
      {
        type: 'p',
        text: 'Drivvize can support SOTIF (ISO 21448) and Safety for AI (PAS 8800). The following activities can be supported:',
      },
      { type: 'heading', text: 'SOTIF (ISO 21448)' },
      {
        type: 'list',
        items: [
          'Support HARA related to Safety of the Intended Functionality',
          'Support Identification and Evaluation of trigger events',
          'Support Functional requirements refinement related to Safety of the Intended Functionality',
          'Support defining the Verification and Validation strategy related to Safety of the Intended Functionality',
          'Process guidance, Audit/Assessment, Consultation, Training',
        ],
      },
      { type: 'heading', text: 'Safety for AI (PAS 8800)' },
      {
        type: 'list',
        items: [
          'Support AI Requirements refinement related to Safety',
          'Guidance on AI Safety design Verification and Validation',
          'Support Evaluation of Safety Assurance argument',
          'Support Qualification of AI Development Framework and AI Software tools',
          'Process guidance, Audit/Assessment, Consultation, Training',
        ],
      },
      {
        type: 'p',
        text: 'Drivvize provides support/guidance on tailoring ISO 26262 for SOTIF and Safety for AI developments.',
      },
    ],
  },
  {
    id: 'services-to-oems',
    question: 'What are the services offered by Drivvize to OEMs?',
    category: 'OEM & ECUs',
    blocks: [
      {
        type: 'p',
        text: 'Drivvize supports the OEM with the following activities:',
      },
      {
        type: 'list',
        items: [
          'Hazard Analysis & Risk Assessment (HARA)',
          'Item Definition',
          'Functional Safety Concept (FSC)',
          'Systems Engineering',
          'Supplier Management',
          'Supplier Audits and Assessments',
          'Safety Case',
          'Safety Product Release',
        ],
      },
    ],
  },
  {
    id: 'ecus-supported',
    question: 'What are the ECUs supported by Drivvize?',
    category: 'OEM & ECUs',
    blocks: [
      {
        type: 'p',
        text: 'Drivvize is capable of supporting any kind of ECU. Our strength is in our ability to quickly understand any complex system/ECU and perform systems, safety & security related activities related to that system/ECU.',
      },
      {
        type: 'p',
        text: 'Drivvize team has worked on the following ECUs till now:',
      },
      {
        type: 'list',
        items: [
          'Instrument Clusters',
          'Electronic Parking Brake (EPB)',
          'Anti-lock Braking System (ABS)',
          'Motor Control Unit',
          'ADAS domain controllers',
          'Seat ECU',
          'Radar',
          'Camera',
          'Vehicle Control Unit (VCU)',
          'Battery Management System (BMS)',
          'Fuel Cell Compressor',
          'Steer-by-Wire',
        ],
      },
    ],
  },
];

