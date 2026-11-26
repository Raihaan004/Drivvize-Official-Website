export type TrainingCategory =
  | 'All'
  | 'ISO 26262 By Part'
  | 'Specialised & Analysis'
  | 'Management & All Parts'
  | 'SOTIF, AI & Custom';

export interface TrainingModule {
  heading: string;
  topics: string[];
}

export interface TrainingOffering {
  id: string;
  number: string;
  title: string;
  duration: string;
  category: Exclude<TrainingCategory, 'All'>;
  summary: string;
  modules: TrainingModule[];
}

export const TRAINING_CATEGORIES: TrainingCategory[] = [
  'All',
  'ISO 26262 By Part',
  'Specialised & Analysis',
  'Management & All Parts',
  'SOTIF, AI & Custom',
];

export const TRAINING_OFFERINGS: TrainingOffering[] = [
  {
    id: 'fusa-basics',
    number: '01',
    title: 'Automotive Functional Safety Basics',
    duration: '1 day',
    category: 'Management & All Parts',
    summary:
      'Foundational introduction to functional safety principles and an end-to-end overview of the key ISO 26262 parts.',
    modules: [
      {
        heading: 'Introduction to Functional Safety (0.5 day)',
        topics: [
          'Why is Safety important?',
          "Automotive's worst Safety Incidents",
          'Safety vs Reliability and Availability',
          'The Connection between Safety and Security',
          'Different Types of Safety',
          'Myths around Safety',
          'Introducing ISO 26262',
          'Framework of ISO 26262',
          'Responsibility split in ISO 26262',
          'Legal side of ISO 26262',
          'Cultivating a Safety culture',
          'Key Concepts of Safety',
        ],
      },
      {
        heading: 'Overview of the Key ISO 26262 Parts (0.5 day)',
        topics: [
          'Management Phase – Key Activities for an OEM and its significance',
          'Concept Phase – Activities performed and its significance',
          'System Phase – Activities performed and its significance',
          'Hardware Phase – Activities performed and its significance',
          'Software Phase – Activities performed and its significance',
          'Manufacturing Phase – Activities performed and its significance',
          'Supporting Phase – Activities performed and its significance',
        ],
      },
    ],
  },
  {
    id: 'iso-26262-part-3',
    number: '02',
    title: 'ISO 26262 Part-3 Concept Safety Training',
    duration: '0.75 day',
    category: 'ISO 26262 By Part',
    summary:
      'Master item definition, Hazard Analysis and Risk Assessment (HARA), safety goals, and functional safety concepts.',
    modules: [
      {
        heading: 'Concept Phase Curriculum',
        topics: [
          'Introduction to Functional Safety',
          'Flow of Functional Safety',
          'Introduction to Reference system',
          'Item definition',
          'Setting the base for performing a HARA (Hazard analysis and risk assessment)',
          'How to perform a HARA, with examples?',
          'Deriving a functional safety concept (FSC) based on HARA and Safety goals',
          'Key aspects to be considered while developing a FSC',
          'How to define an FSC',
        ],
      },
    ],
  },
  {
    id: 'iso-26262-part-4',
    number: '03',
    title: 'ISO 26262 Part-4 Systems Safety Training',
    duration: '1 day',
    category: 'ISO 26262 By Part',
    summary:
      'System-level product development: Technical Safety Concepts, TSRs, FMEA, FTA, HSIS, integration, and safety validation.',
    modules: [
      {
        heading: 'System Level Curriculum (Clauses 5–8)',
        topics: [
          'Introduction to Functional Safety',
          'Flow of Functional Safety',
          'Clause 5: General topics for Product development at System level',
          'System Architecture – a big picture view',
          'Introduction to Reference system',
          'Clause 6: How to prepare a Technical Safety Concept',
          'Clause 6: Steps involved in creation of TSRs',
          'Understanding the concept of Freedom From Interference',
          'Clause 6: System Safety Analysis – FMEA',
          'Clause 6: System Safety Analysis – FTA',
          'Clause 6: Hardware Software Interface Specification – with respect to Safety',
          'Clause 7: System & Item Integration and testing of TSRs',
          'Clause 8: Safety Validation of FSRs and Safety goals',
        ],
      },
    ],
  },
  {
    id: 'iso-26262-part-5',
    number: '04',
    title: 'ISO 26262 Part-5 Hardware Safety Training',
    duration: '1 day',
    category: 'ISO 26262 By Part',
    summary:
      'Hardware safety requirements, HSIS, schematics, HW safety & dependent failure analysis, FMEDA metrics, and integration testing.',
    modules: [
      {
        heading: 'Hardware Level Curriculum (Clauses 5–10)',
        topics: [
          'Why is HW Safety Important?',
          'Hardware Safety Model',
          'Clause 5: General topics for Product development at Hardware level',
          'Introduction to the Reference System used for explaining HW activities',
          'Basic concepts for HW Safety (Failures, Diagnostic coverage etc)',
          'Clause 6: Hardware Safety Requirements – What aspects should be considered, how to write and examples',
          'Clause 6: HW-SW Interface Specification – Role of HSIS in Hardware Safety',
          'Clause 7: Hardware Architecture and schematics',
          'Clause 7: Overview of Hardware Safety Analysis and methods for performing it',
          'Clause 7: Hardware dependent failure analysis',
          'Clause 8 & 9: HW Architectural metrics and Safety goal violation evaluation using Quantitative HW Analysis (FMEDA)',
          'Clause 10: Hardware Integration Test Specification – Methods and examples',
          'Clause 10: Execution of Hardware Integration tests',
        ],
      },
    ],
  },
  {
    id: 'iso-26262-part-6',
    number: '05',
    title: 'ISO 26262 Part-6 Software Safety Training',
    duration: '1 day',
    category: 'ISO 26262 By Part',
    summary:
      'End-to-end software safety lifecycle: FFI (Annex D), SW safety requirements, architecture, Annex E & C, unit verification, and embedded testing.',
    modules: [
      {
        heading: 'Software Level Curriculum (Clauses 5–11 & Annexes)',
        topics: [
          'Why is SW Safety Important?',
          'Software Safety Model',
          'Clause 5: General topics for Product development at Software level and what should be practically done to satisfy it?',
          'Understanding concept of FFI - Annex D: Freedom from Interference',
          'Introduction to the Reference System used for explaining SW Activities',
          'Clause 6: Software Safety Requirements – What aspects should be considered, how to write and examples',
          'Clause 6: HW-SW Interface Specification – Role of HSIS in Software Safety',
          'Clause 7: Software Architecture – What aspects should be considered, how to write and examples',
          'Overview of Annex E: Software Safety Analysis and Dependent failure analysis',
          'Annex C: Software Configuration and Calibration, how to identify safety relevant data and how to handle them',
          'SW Verification Plan and Strategy',
          'Clause 8: Software Unit design and implementation – What aspects should be considered and examples',
          'Clause 9: Software Unit Verification – Different methodologies of verification and examples',
          'Clause 10: Software Integration and Verification – Methods of Integration testing and examples',
          'Clause 11: Testing of the Embedded Software – Methods of Embedded software testing and examples',
        ],
      },
    ],
  },
  {
    id: 'iso-26262-part-7',
    number: '06',
    title: 'ISO 26262 Part-7 Manufacturing Safety Training',
    duration: '0.5 day',
    category: 'ISO 26262 By Part',
    summary:
      'Bridge functional safety requirements into production with Process FMEA, control plans, EOL testing, and ISO 26262 Part 7 compliance.',
    modules: [
      {
        heading: 'Manufacturing Overview',
        topics: [
          'Manufacturing Overview',
          'Different Manufacturing Testing',
          'Why are all these tests required during Manufacturing?',
          'Flow of Manufacturing Activities',
          'Manufacturing Specification',
          'Manufacturing Process Flow',
          'Process FMEA',
          'Flow of FMEA – Design to Process',
          'Special Characteristics',
          'Control Plan',
          'Challenge Part/Master Sample/Golden Sample',
          'End of Line Testing',
          'Hardware Test Coverage',
          'Part Numbers and Management of Software',
          'User Manual and Instructions Guide',
          'Field Monitoring',
        ],
      },
      {
        heading: 'Manufacturing as per ISO 26262',
        topics: [
          'ISO 26262 – Two aspects of Manufacturing',
          'Overall Planning (ISO 26262 – Part 2 Clause 7)',
          'Specification at systems level (ISO 26262 – Part 4 Clause 6.4.8)',
          'Specification at hardware level (ISO 26262 – Part 5 Clause 7.4.5)',
          'Supplier Manufacturing (ISO 26262 – Part 8 Clause 5.4.6)',
          'Production Planning (ISO 26262 – Part 7 Clause 5)',
          'Mass Production and Beyond (ISO 26262 – Part 7 Clause 6 and 7)',
        ],
      },
    ],
  },
  {
    id: 'seooc-training',
    number: '07',
    title: 'Safety Element out of context (SEooC) – Training',
    duration: '0.75 day',
    category: 'Specialised & Analysis',
    summary:
      'Practical guide to developing SW, HW, and System SEooCs, defining Assumptions of Use (AoU), and authoring effective safety manuals.',
    modules: [
      {
        heading: 'SEooC Methodology & Safety Manuals',
        topics: [
          'What is a Safety Element?',
          'Two types of development – In-context and Out-of-Context – a comparison',
          'What is an SEooC and different types of SEooC (SW, HW, System) with examples',
          'Pros and cons of an SEooC Approach',
          'Aspects considered in the development of an SEooC',
          'What aspects to look for in a Safety manual of an SEooC',
          'Questions to ask an SEooC developer',
          'Example of how to read and analyse SW and HW Safety manuals for the different aspects',
          'Overcoming the challenges of implementing the Safety manual assumptions',
          'How to define the SEooC Strategy with examples of SW and System SEooC',
          'Activities to be performed in a SW, HW and System SEooC with examples',
          'Strategies for creating an effective safety manual',
        ],
      },
    ],
  },
  {
    id: 'sw-safety-dfa',
    number: '08',
    title: 'Software Safety Analysis & Dependent Failure Analysis Training',
    duration: '1 day',
    category: 'Specialised & Analysis',
    summary:
      'Hands-on SW FMEA, SW FTA, Freedom from Interference, and Dependent Failure Analysis with coupling factor examples.',
    modules: [
      {
        heading: 'SW Safety Analysis & DFA Curriculum',
        topics: [
          '“Need” to perform SW Safety Analysis',
          'Outcomes of SW Safety Analysis',
          'Who should perform SW Safety Analysis?',
          'Basic Concepts for Safety Analysis - Systematic and Random Hardware failures, Prevent vs detect, FFI',
          'Basis/Pre-requisites for SW Safety Analysis',
          'Identifying the scope of Analysis',
          'Different Safety Analysis Approaches',
          'SW FMEA Approach (with example)',
          'SW FTA Approach (with example)',
          '“Need” to perform SW Dependent failure analysis',
          'Outcomes of SW Dependent failure analysis',
          'Basic Concepts for SW Dependent failure analysis – Cascading vs common cause, Independence',
          'Coupling factor classes for SW Dependent failure analysis with examples',
          'How to perform SW Dependent failure analysis (with example)',
        ],
      },
    ],
  },
  {
    id: 'technical-safety-concept',
    number: '09',
    title: 'Technical Safety Concept Training',
    duration: '1 day',
    category: 'Specialised & Analysis',
    summary:
      'Deep dive into system design, failure mode analysis, V-model execution, TSR creation, FFI, and safety analyses with real examples.',
    modules: [
      {
        heading: 'Technical Safety Concept Curriculum',
        topics: [
          'Introduction to Safety',
          'Flow of Functional Safety',
          'System Design – A big picture view',
          'Introduction to an Automotive system (Without Safety)',
          'Analyzing the failure modes of the automotive system',
          "V-Model in the ‘Real’ world",
          'Introduction to ALC system (with safety)',
          'Technical Safety Concept',
          'Steps involved in creation of TSRs',
          'Dependent failures',
          'Freedom From Interference',
          'Safety Analyses with examples',
        ],
      },
    ],
  },
  {
    id: 'fsm-training',
    number: '10',
    title: 'Training for Functional Safety Managers',
    duration: '1 day',
    category: 'Management & All Parts',
    summary:
      'Complete ISO 26262 Parts 1–12 perspective tailored for Functional Safety Managers orchestrating safety cases across teams and suppliers.',
    modules: [
      {
        heading: 'ISO 26262 Parts 1–12 Management Perspective',
        topics: [
          'Overview about ISO26262 Framework',
          'How to Interpret the Standard',
          'Understanding the “language” of ISO26262 (Part 1)',
          'How to define the strategy and plan for a successful safety case (Part 2)',
          'How to derive Safety goals and functional safety requirements (Part-3)',
          'What should we do in a System to achieve Safety? (Part 4)',
          'What should we do in a HW to achieve Safety? (Part 5)',
          'What should we do in a SW to achieve Safety? (Part 6)',
          'What should we do in a Manufacturing to achieve Safety? (Part 7)',
          'The Processes that are the backbone for the other ISO Parts (Part 8)',
          'How does Safety oriented analysis help to achieve Safety goals? (Part 9)',
          'Safety Element out of context and other useful guidelines for ISO26262 (Part 10)',
          'What should we do in a Semiconductor IC to achieve Safety? (Part 11)',
          'How is Safety for Motorcycles different from passenger cars? (Part 12)',
        ],
      },
    ],
  },
  {
    id: 'fusa-all-parts',
    number: '11',
    title: 'Functional Safety All Parts Training',
    duration: '4 days',
    category: 'Management & All Parts',
    summary:
      'Comprehensive 4-day practitioner program covering Management, Concept, System, Hardware, Software, and Supporting Safety Activities.',
    modules: [
      {
        heading: 'Day 1 — Foundations & Management',
        topics: [
          'Introduction to Functional Safety',
          'Flow of Functional Safety',
          'Framework of ISO 26262',
          'Key Concepts of Safety',
          'Management of Functional Safety',
        ],
      },
      {
        heading: 'Day 2 — Concept Phase',
        topics: [
          'Introduction to Reference System',
          'Concept phase of Functional Safety',
          'Item definition',
          'Hazard Analysis and Risk Assessment',
          'Functional Safety Concept',
        ],
      },
      {
        heading: 'Day 3 — System & Hardware Safety',
        topics: [
          'Introduction to System Safety',
          'Technical Safety Concept with examples',
          'System Integration and testing',
          'Safety Validation',
          'Goal of Safety Analysis and Methods for performing it',
          'Introduction to Hardware Safety',
          'Hardware Safety requirements and Architecture',
          'HW Architectural metrics and Safety goal violation evaluation using Quantitative HW Analysis (FMEDA)',
          'Hardware Integration and Verification',
          'HW component evaluation',
        ],
      },
      {
        heading: 'Day 4 — Software Safety & Supporting Processes',
        topics: [
          'Introduction to Software Safety',
          'Understanding concept of Freedom from Interference',
          'Software Safety Requirements',
          'Software Architecture',
          'Software Safety Analysis and Dependent failure analysis',
          'Software Unit design and implementation',
          'Software Unit Verification',
          'Software Integration and Verification',
          'Testing of the Embedded Software',
          'Overview about Supporting Safety Activities',
        ],
      },
    ],
  },
  {
    id: 'sotif-training',
    number: '12',
    title: 'ISO/PAS 21448 - SOTIF Training',
    duration: '1 day',
    category: 'SOTIF, AI & Custom',
    summary:
      'Safety of the Intended Functionality (ISO/PAS 21448) from Clause 5 to Clause 12, triggering conditions, V&V strategy, and release criteria.',
    modules: [
      {
        heading: 'ISO/PAS 21448 SOTIF Curriculum (Clauses 5–12)',
        topics: [
          'What is SOTIF?',
          'Scope of SOTIF',
          'SOTIF & ISO26262 – Overlap and differences',
          'SOTIF Basic Concepts',
          'Clauses in ISO/PAS 21448',
          'Clause 5: Functional and system specification (intended functionality content)',
          'Clause 6: Identification and Evaluation of hazards caused by the intended functionality',
          'Clause 7: Identification and Evaluation of triggering events',
          'Clause 8: Functional modifications to reduce SOTIF related risks',
          'Clause 9: Definition of the verification and validation strategy',
          'Clause 10: Verification of the SOTIF (Area 2)',
          'Clause 11: Validation of the SOTIF (Area 3)',
          'Clause 12: Methodology and criteria for SOTIF release',
        ],
      },
    ],
  },
  {
    id: 'pas-8800-ai-safety',
    number: '13',
    title: 'Introduction to ISO/PAS 8800:2024 (AI Safety)',
    duration: '1 day',
    category: 'SOTIF, AI & Custom',
    summary:
      'Integrating ISO 26262, SOTIF, and ISO/PAS 8800:2024 for automotive AI safety lifecycles, dataset integrity, V&V, and assurance cases.',
    modules: [
      {
        heading: 'ISO/PAS 8800:2024 AI Safety Curriculum',
        topics: [
          'Why PAS 8800?',
          'Scope of PAS 8800',
          'Integration of ISO 26262, SOTIF, and PAS 8800',
          'Fundamental concepts of AI systems in road vehicle safety',
          'AI safety life cycle',
          'Safety planning for AI-based systems',
          'AI safety requirements, architecture, and development measures',
          'Dataset considerations influencing AI safety',
          'Verification and validation of AI systems',
          'AI safety analysis',
          'AI safety measures during operation',
          'AI development frameworks and software tools for AI models',
          'Safety assurance (Case) for AI systems',
        ],
      },
    ],
  },
  {
    id: 'customized-trainings',
    number: '14',
    title: 'ISO 26262 Customized Trainings',
    duration: 'Depends on the customization',
    category: 'SOTIF, AI & Custom',
    summary:
      'Tailored curricula built around your engineering stack and roles — shown below with our sample Overview, Software Safety & Tools Qualification track.',
    modules: [
      {
        heading: 'Sample Track — Overview of Safety',
        topics: [
          'What is Safety?',
          'Why is SW Safety Important?',
          'Safety vs Reliability and Availability',
          'The Connection between Safety and Security',
          'Different Types of Safety',
          'Myths around Safety',
          'Introduction to Functional Safety',
          'Framework of ISO 26262',
          'Responsibility split in ISO 26262',
          'Flow of Functional Safety',
          'Key Concepts of Safety',
          'System Safety – an Overview',
        ],
      },
      {
        heading: 'Sample Track — ISO 26262 Part-6 Software Safety',
        topics: [
          'Software Safety Model',
          'General topics for Safe Software development',
          'Understanding concept of Freedom from Interference',
          'Introduction to the Reference System used for explaining SW Activities',
          'Software Safety Requirements – What aspects should be considered, how to write and examples',
          'Software Architecture – What aspects should be considered, how to write and examples',
          'Software Safety Analysis and Dependent failure analysis',
          'Software Configuration and Calibration, how to identify safety relevant data and how to handle them',
          'Software Unit design and implementation – What aspects should be considered and examples',
          'Software Verification – Different methodologies of verification and examples',
        ],
      },
      {
        heading: 'Sample Track — Tools Qualification',
        topics: [
          'Significance of tools qualification',
          'Tool classification levels (TCL) with examples',
          'Tools qualification activity',
        ],
      },
    ],
  },
  {
    id: 'leadership-training',
    number: '15',
    title: 'Functional Safety – Leadership Training',
    duration: '1 day',
    category: 'Management & All Parts',
    summary:
      'Executive and engineering leadership overview covering safety culture, competence management, OEM/System concepts, HW, and SW phases.',
    modules: [
      {
        heading: 'Introduction to Functional Safety',
        topics: [
          'What is Functional Safety?',
          'Why is Safety important?',
          "Automotive's worst Safety Incidents",
          'Safety vs Reliability and Availability',
          'The connection between Safety and Security',
          'Different Types of Safety',
          'Myths around Safety',
          'Functional Safety standards',
          'Introducing ISO 26262',
          'Framework of ISO 26262',
          'Responsibility split in ISO 26262',
          'Legal side of ISO 26262',
        ],
      },
      {
        heading: 'For the Leaders',
        topics: ['Cultivating a Culture of Safety', 'Competence Management'],
      },
      {
        heading: 'Key Concepts',
        topics: [
          'Systematic faults vs Random faults',
          'Fault, Error & Failure',
          'Prevent or Detect?',
          'ASIL vs Quality',
          'ECUs and its typical ASIL levels',
          'Examples of Safety Goal',
          'The 3Fs and S2 for a Safe Vehicle',
          'SEooC and Software Tools Qualification',
        ],
      },
      {
        heading: 'Concept Phase (OEM) and System Phase',
        topics: [
          'Item Definition',
          'Hazard Analysis and Risk Assessment',
          'ASIL Determination for Safety Goals',
          'Functional Safety Requirements',
          'Technical Safety Concept',
        ],
      },
      {
        heading: 'Hardware Phase',
        topics: [
          'Hardware Safety Requirements',
          'Hardware – Software Interface Specification (HSIS)',
          'HW Design (Architecture and Schematics)',
          'Hardware - Safety Analyses',
          'Hardware - Dependent Failure Analysis (DFA)',
          'FMEDA',
          'Hardware Integration and Verification',
        ],
      },
      {
        heading: 'Software Phase',
        topics: [
          'Software Safety Requirements',
          'Software Architecture',
          'Software Unit design and implementation',
          'Software Unit Verification',
          'Software Integration and Verification',
          'Testing of the Embedded Software',
          'Software Configuration and Calibration',
          'Software Safety Analysis and Dependent failure analysis',
        ],
      },
    ],
  },
];

