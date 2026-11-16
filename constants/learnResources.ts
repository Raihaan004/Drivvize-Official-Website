export interface LearnResource {
  id: string;
  field: string;
  fieldBadgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  fileName: string;
  fileSize: string;
  topics: string[];
  iconName: 'ShieldCheck' | 'Radio' | 'Lock';
}

export const LEARN_RESOURCES: LearnResource[] = [
  {
    id: 'iso-26262-seooc',
    field: 'Functional Safety',
    fieldBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'ISO 26262 SEooC Training & Implementation Guide',
    subtitle: 'Safety Element out of Context (SEooC) Architecture & Methodology',
    description:
      'A comprehensive technical guide into developing and integrating Safety Elements out of Context (SEooC) under ISO 26262-10. Covers assumptions of use (AoU), ASIL-tailored safety requirements, SW/HW element qualification, and tier-to-OEM verification strategies.',
    fileName: 'Drivvize_ISO26262_SEooC_Training.pdf',
    fileSize: '1.66 MB',
    topics: [
      'Safety Element out of Context (SEooC)',
      'Assumptions of Use (AoU) Definition',
      'ASIL A–D Allocation & Traceability',
      'SW & HW Element Qualification',
      'OEM Integration & Safety Case Delivery',
    ],
    iconName: 'ShieldCheck',
  },
  {
    id: 'v2x-whitepaper',
    field: 'Connected Mobility',
    fieldBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Vehicle-to-Everything (V2X) Technical Whitepaper',
    subtitle: 'Architectures, Standards & Safe Telematics for Connected Fleets',
    description:
      'Essential technical whitepaper on Vehicle-to-Everything (V2X) deployment, C-V2X cellular protocols, low-latency safety messaging, roadside unit (RSU) interaction, and fail-operational telemetry architectures for connected vehicle fleets.',
    fileName: 'Drivvize_V2X_Whitepaper.pdf',
    fileSize: '784 KB',
    topics: [
      'C-V2X & Direct Short-Range Standards',
      'Direct Safety Messaging Protocols',
      'Roadside Unit (RSU) Infrastructure',
      'Fail-Operational Telematics Architecture',
      'Cyber-Resilient Fleet Telemetry',
    ],
    iconName: 'Radio',
  },
  {
    id: 'eu-cra-intro',
    field: 'Cybersecurity & Compliance',
    fieldBadgeColor: 'bg-amber-50 text-amber-750 border-amber-200',
    title: 'EU Cyber Resilience Act (CRA) – An Introduction',
    subtitle: 'Product Security, Threat Modeling & European Regulatory Compliance',
    description:
      "A strategic and technical guide to the European Union's Cyber Resilience Act (EU CRA). Outlines mandatory cybersecurity requirements for products with digital elements, vulnerability management lifecycles, and alignment with ISO/SAE 21434 and UNECE R155.",
    fileName: 'EU_CRA_An_Intro.pdf',
    fileSize: '1.10 MB',
    topics: [
      'EU Cyber Resilience Act (CRA) Scope',
      'Security-by-Design Architecture',
      'Vulnerability Handling & Coordinated Disclosure',
      'Supply Chain Cyber Due Diligence',
      'UNECE R155/R156 & CRA Cross-Harmonization',
    ],
    iconName: 'Lock',
  },
];

