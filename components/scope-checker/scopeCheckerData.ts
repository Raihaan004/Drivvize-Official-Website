export type ScopeCategory = 'in' | 'c1' | 'c2' | 'cr' | 'ou' | 'co';

export interface VerdictMeta {
  label: string;
  guidance: string;
  shortLabel: string;
  badgeClass: string;
  accentBarClass: string;
}

export const VERDICTS: Record<ScopeCategory, VerdictMeta> = {
  in: {
    label: 'In scope: default category',
    shortLabel: 'default category',
    guidance:
      'Self-assessment (Module A) is generally available; full Annex I requirements, vulnerability handling, SBOM, reporting.',
    badgeClass:
      'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
    accentBarClass: 'from-[#DC2626] to-[#F97316]',
  },
  c1: {
    label: 'In scope: Important product, Class I (Annex III)',
    shortLabel: 'Class I (Annex III)',
    guidance:
      'Module A only if a harmonised standard, common specification or EU cybersecurity certification scheme is fully applied; otherwise third-party assessment (Module B+C or H).',
    badgeClass:
      'bg-[#FEFCE8] text-[#854D0E] border border-[#FDE68A]',
    accentBarClass: 'from-[#FACC15] to-[#F97316]',
  },
  c2: {
    label: 'In scope: Important product, Class II (Annex III)',
    shortLabel: 'Class II (Annex III)',
    guidance:
      "Third-party conformity assessment (Module B+C or H) or EU cybersecurity certification at least 'substantial'.",
    badgeClass:
      'bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]',
    accentBarClass: 'from-[#F97316] to-[#EA580C]',
  },
  cr: {
    label: 'In scope: Critical product (Annex IV)',
    shortLabel: 'Critical product (Annex IV)',
    guidance:
      'Highest tier. Commission may require an EU cybersecurity certification scheme by delegated act; otherwise Class II-type routes apply.',
    badgeClass:
      'bg-[#FEF2F2] text-[#7F1D1D] border border-[#FCA5A5]',
    accentBarClass: 'from-[#B91C1C] to-[#7F1D1D]',
  },
  ou: {
    label: 'Out of scope',
    shortLabel: 'Out of scope',
    guidance:
      'The CRA does not apply (see reason). Sector rules may still impose their own cybersecurity duties.',
    badgeClass:
      'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    accentBarClass: 'from-[#0D9488] to-[#10B981]',
  },
  co: {
    label: 'Conditional: depends on facts',
    shortLabel: 'Conditional: depends on facts',
    guidance:
      'Scope turns on how the product is made available or architected. Check the stated condition.',
    badgeClass:
      'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]',
    accentBarClass: 'from-[#2563EB] to-[#06B6D4]',
  },
};

export interface CatalogItem {
  name: string;
  keywords: string;
  category: ScopeCategory;
  description: string;
  basis: string;
}

export const CATALOG: CatalogItem[] = [
  // Annex III Class I
  {
    name: 'Password manager',
    keywords: 'password manager,credential vault',
    category: 'c1',
    description: 'Annex III Class I, point 3',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Web browser (standalone or embedded)',
    keywords: 'browser,chrome,firefox,safari,webview',
    category: 'c1',
    description: 'Annex III Class I, point 2',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Antivirus / anti-malware software',
    keywords: 'antivirus,anti-virus,anti malware,malware scanner,endpoint protection',
    category: 'c1',
    description: 'Software that searches for, removes or quarantines malicious software.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'VPN product',
    keywords: 'vpn,virtual private network',
    category: 'c1',
    description: 'Product with VPN function.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Identity / privileged access management',
    keywords: 'identity management,iam,pam,privileged access,sso,authentication software',
    category: 'c1',
    description:
      'Identity management and PAM software/hardware, incl. authentication and access control readers.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Biometric / access control reader',
    keywords: 'access control,biometric reader,badge reader,fingerprint reader,rfid reader',
    category: 'c1',
    description: 'Authentication and access control readers incl. biometric readers.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Network management system',
    keywords: 'network management,nms,network monitoring',
    category: 'c1',
    description: 'Annex III Class I.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'SIEM',
    keywords: 'siem,security information and event management',
    category: 'c1',
    description: 'Annex III Class I.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Boot manager',
    keywords: 'boot manager,bootloader,boot loader',
    category: 'c1',
    description: 'Annex III Class I.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'PKI / certificate issuance software',
    keywords: 'pki,certificate authority,certificate issuance,digital certificate',
    category: 'c1',
    description: 'Annex III Class I.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Network interface (physical/virtual)',
    keywords: 'network interface,nic,network card,ethernet adapter',
    category: 'c1',
    description: 'Annex III Class I.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'General-purpose operating system',
    keywords: 'operating system,os,windows,linux,android,ios,macos',
    category: 'c1',
    description: 'Operating systems not covered by Class II.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Router, modem, switch',
    keywords: 'router,modem,switch,wifi router,gateway router,access point',
    category: 'c1',
    description: 'Routers/modems for internet connection and switches, not covered by Class II.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Microprocessor with security functions',
    keywords: 'microprocessor,cpu,soc',
    category: 'c1',
    description: 'Only if it has security-related functionality; otherwise default.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Microcontroller with security functions',
    keywords: 'microcontroller,mcu',
    category: 'c1',
    description: 'Only if it has security-related functionality; otherwise default.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'ASIC / FPGA with security functions',
    keywords: 'asic,fpga',
    category: 'c1',
    description: 'Only if it has security-related functionality.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Smart home virtual assistant',
    keywords: 'smart speaker,voice assistant,alexa,google home,virtual assistant,echo',
    category: 'c1',
    description: 'General-purpose virtual assistants for smart home.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Smart door lock',
    keywords: 'smart lock,door lock,connected lock',
    category: 'c1',
    description: 'Smart home products with security functionalities.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Security camera / CCTV',
    keywords: 'security camera,cctv,ip camera,doorbell camera,surveillance camera,video doorbell',
    category: 'c1',
    description: 'Smart home products with security functionalities.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Baby monitor',
    keywords: 'baby monitor,baby camera',
    category: 'c1',
    description: 'Smart home products with security functionalities.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Alarm system',
    keywords: 'alarm system,home alarm,intruder alarm',
    category: 'c1',
    description: 'Smart home products with security functionalities.',
    basis: 'Annex III Cl. I',
  },
  {
    name: 'Connected toy (social/location features)',
    keywords: 'connected toy,smart toy,toy with camera,interactive toy',
    category: 'c1',
    description:
      'Toys under Dir. 2009/48/EC with social interactive features or location tracking. Otherwise default.',
    basis: 'Annex III Cl. I',
  },
  {
    name: "Health-monitoring wearable / children's wearable",
    keywords: 'smartwatch,fitness tracker,health wearable,wearable,kids watch,child tracker',
    category: 'c1',
    description:
      'Personal wearables for health monitoring (not covered by MDR) or for children. General wearables without these features are default.',
    basis: 'Annex III Cl. I',
  },

  // Annex III Class II
  {
    name: 'Hypervisor',
    keywords: 'hypervisor,vmware esxi,kvm,xen',
    category: 'c2',
    description: 'Supports virtualised execution of operating systems.',
    basis: 'Annex III Cl. II',
  },
  {
    name: 'Container runtime system',
    keywords: 'container runtime,docker engine,containerd,cri-o',
    category: 'c2',
    description: 'Supports virtualised execution of OS and similar environments.',
    basis: 'Annex III Cl. II',
  },
  {
    name: 'Firewall',
    keywords: 'firewall,ngfw,waf',
    category: 'c2',
    description: 'Annex III Class II.',
    basis: 'Annex III Cl. II',
  },
  {
    name: 'Intrusion detection / prevention system',
    keywords: 'ids,ips,intrusion detection,intrusion prevention',
    category: 'c2',
    description: 'Annex III Class II.',
    basis: 'Annex III Cl. II',
  },
  {
    name: 'Tamper-resistant microprocessor / microcontroller',
    keywords: 'tamper-resistant,tamper resistant mcu,secure mcu',
    category: 'c2',
    description: 'Annex III Class II.',
    basis: 'Annex III Cl. II',
  },

  // Annex IV Critical
  {
    name: 'Hardware device with security box / HSM',
    keywords: 'hsm,hardware security module,security box,secure enclave device',
    category: 'cr',
    description: 'Annex IV.',
    basis: 'Annex IV',
  },
  {
    name: 'Smart meter gateway',
    keywords: 'smart meter gateway,metering gateway',
    category: 'cr',
    description: 'Smart meter gateways within smart metering systems (Dir. 2019/944).',
    basis: 'Annex IV',
  },
  {
    name: 'Smartcard / secure element',
    keywords: 'smartcard,smart card,secure element,sim card,esim,chip card',
    category: 'cr',
    description: 'Smartcards or similar devices incl. secure elements.',
    basis: 'Annex IV',
  },

  // Default
  {
    name: 'Smartphone / tablet',
    keywords: 'smartphone,phone,tablet,ipad',
    category: 'in',
    description: 'Connected consumer device (OS part of it may be Class I).',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Laptop / PC',
    keywords: 'laptop,pc,desktop computer,notebook',
    category: 'in',
    description: 'Connected consumer device.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Smart TV / set-top box',
    keywords: 'smart tv,tv,set-top box,streaming stick',
    category: 'in',
    description: 'Connected consumer device.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Connected appliance (fridge, washer, oven)',
    keywords:
      'smart fridge,fridge,washing machine,connected appliance,smart oven,robot vacuum,vacuum',
    category: 'in',
    description: 'Connected household IoT.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Smart light / plug / thermostat',
    keywords: 'smart bulb,smart light,smart plug,thermostat,smart thermostat',
    category: 'in',
    description:
      'Connected IoT (a thermostat tied to security functions may be reviewed).',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Mobile app',
    keywords: 'mobile app,app,android app,ios app',
    category: 'in',
    description: 'Software; in scope when commercially made available.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Desktop / commercial software',
    keywords: 'software,desktop software,erp,accounting software,photo editor,game,video game',
    category: 'in',
    description: 'Commercial software with data connection.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Games console',
    keywords: 'console,playstation,xbox,nintendo',
    category: 'in',
    description: 'Connected consumer device.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Printer / scanner',
    keywords: 'printer,scanner,mfp',
    category: 'in',
    description: 'Network-connected peripheral.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Industrial controller / PLC / IoT sensor',
    keywords: 'plc,industrial controller,iot sensor,sensor,scada,gateway,edge device',
    category: 'in',
    description: 'Connected industrial/IoT product.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Wireless headphones / peripherals',
    keywords: 'headphones,earbuds,bluetooth speaker,keyboard,mouse,webcam,usb',
    category: 'in',
    description: 'Product with logical or physical data connection.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Drone / consumer robot',
    keywords: 'drone,robot,toy drone',
    category: 'in',
    description:
      'Connected product (aviation rules may apply to some drones; check Reg. 2018/1139).',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Firmware / embedded software',
    keywords: 'firmware,embedded software',
    category: 'in',
    description: 'In scope as part of product, or on its own if placed on market.',
    basis: 'Art. 2(1)',
  },
  {
    name: 'Connected e-bike / e-scooter',
    keywords: 'e-bike,ebike,e-scooter,scooter',
    category: 'co',
    description:
      'Check vehicle type: L-category vehicles under Reg. 168/2013 are covered by a delegated exclusion (verify its adoption and scope; L1e pedal cycles stay in scope).',
    basis: 'Art. 2(5), Del. Reg. on Reg. 168/2013',
  },

  // Out of scope
  {
    name: 'Medical device (incl. software as a medical device)',
    keywords: 'medical device,pacemaker,insulin pump,mri,hearing aid,samd,medical software',
    category: 'ou',
    description: 'Covered by Regulation (EU) 2017/745.',
    basis: 'Art. 2(2)(a)',
  },
  {
    name: 'In-vitro diagnostic device',
    keywords: 'in vitro,ivd,diagnostic analyser,lab analyzer,blood glucose meter',
    category: 'ou',
    description: 'Covered by Regulation (EU) 2017/746.',
    basis: 'Art. 2(2)(b)',
  },
  {
    name: 'Motor vehicle and its systems/components (type-approved)',
    keywords: 'car,vehicle,ecu,automotive,adas,infotainment,truck,bus,motor vehicle',
    category: 'ou',
    description: 'Covered by Regulation (EU) 2019/2144 (type approval).',
    basis: 'Art. 2(2)(c)',
  },
  {
    name: 'Civil aviation product (certified)',
    keywords: 'aircraft,avionics,airplane,aviation,flight control',
    category: 'ou',
    description: 'Certified under Regulation (EU) 2018/1139.',
    basis: 'Art. 2(3)',
  },
  {
    name: 'Marine equipment',
    keywords: 'marine equipment,ship equipment,vessel navigation,ecdis,gmdss',
    category: 'ou',
    description: 'Within Directive 2014/90/EU.',
    basis: 'Art. 2(4)',
  },
  {
    name: 'Defence / national security / classified-processing product',
    keywords: 'military,defence,defense,classified,crypto classified',
    category: 'ou',
    description:
      'Developed or modified exclusively for national security/defence, or designed to process classified information.',
    basis: 'Art. 2(6)',
  },
  {
    name: 'Pure SaaS / website / cloud service',
    keywords: 'saas,website,web app,cloud service,paas,iaas,web portal,online platform,crm saas',
    category: 'ou',
    description:
      "Services not forming part of a product's remote data processing are outside the CRA (NIS2 may apply). A SaaS with an installable app or device is conditional.",
    basis: 'Recital 11–12, Art. 3(2)',
  },
  {
    name: 'Spare part (identical replacement)',
    keywords: 'spare part,replacement part,replacement component',
    category: 'ou',
    description: 'Components supplied by the original manufacturer as identical replacements.',
    basis: 'Art. 2(7)',
  },
  {
    name: 'Product with no data connection',
    keywords: 'offline device,standalone device,no connectivity,air-gapped,pocket calculator',
    category: 'ou',
    description:
      'No direct or indirect logical or physical data connection to a device or network.',
    basis: 'Art. 2(1)',
  },

  // Conditional
  {
    name: 'Open-source software / library',
    keywords: 'open source,oss,library,npm package,github project,foss',
    category: 'co',
    description:
      'Out of scope if non-commercial (not monetised, no commercial activity). In scope if supplied commercially; open-source stewards get a lighter regime (Art. 24).',
    basis: 'Recital 18–20, Art. 3(14), Art. 24',
  },
  {
    name: 'Remote data processing solution (app backend)',
    keywords: 'remote data processing,backend,cloud backend,companion cloud',
    category: 'co',
    description:
      'In scope if designed and developed by or for the manufacturer and the product cannot perform a function without it.',
    basis: 'Art. 3(2)',
  },
  {
    name: 'Web service with companion mobile app',
    keywords: 'saas with app,cloud app with mobile app,service with mobile app',
    category: 'co',
    description:
      'The app is a product with digital elements (in scope); the pure web service is not unless it is a remote data processing solution.',
    basis: 'Art. 3(2), Recital 12',
  },
  {
    name: 'AI / ML model or AI-enabled product',
    keywords: 'ai,ml model,ai system,llm,chatbot,ai device',
    category: 'co',
    description:
      'Software with data connection is in scope; the AI Act may also apply. A bare hosted model/service may fall outside.',
    basis: 'Art. 2(1), Art. 12',
  },
];

export const EXAMPLE_CHIPS = [
  'Smart door lock',
  'Pacemaker',
  'Password manager',
  'Firewall',
  'SaaS',
  'Smart TV',
  'Open source library',
  'Car ECU',
];

export interface WizardQuestion {
  question: string;
  hint: string;
  triggerAnswer: 'yes' | 'no';
  outReason: string;
}

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    question:
      'Is the product a hardware or software product with a direct or indirect logical or physical data connection to a device or network (incl. Bluetooth, USB, internet)?',
    hint: 'Art. 2(1). Also count remote data processing solutions the product needs to work.',
    triggerAnswer: 'no',
    outReason: 'Without a data connection the CRA does not apply (Art. 2(1)).',
  },
  {
    question:
      'Will it be made available on the EU market in the course of a commercial activity (sold, or free but monetised e.g. via support, data, paid services)?',
    hint: 'Purely non-commercial open source is outside scope; Art. 3(22)/Recital 18–20.',
    triggerAnswer: 'no',
    outReason:
      'Not made available in the course of a commercial activity. Open-source stewards (Art. 24) may still have light duties if they support commercial use.',
  },
  {
    question:
      'Is it a medical device or IVD (Reg. 2017/745, 2017/746), a type-approved motor vehicle/component (Reg. 2019/2144), certified civil aviation product (Reg. 2018/1139) or marine equipment (Dir. 2014/90/EU)?',
    hint: 'Art. 2(2)–(4). Also check the delegated act for L-category vehicles (Reg. 168/2013).',
    triggerAnswer: 'yes',
    outReason:
      'Excluded by Art. 2(2)–(4) to avoid duplicate cybersecurity regimes.',
  },
  {
    question:
      'Is it developed or modified exclusively for national security or defence, or designed to process classified information?',
    hint: 'Art. 2(6).',
    triggerAnswer: 'yes',
    outReason: 'Excluded under Art. 2(6).',
  },
  {
    question:
      'Is it only a spare part, identical to the one it replaces and supplied by the same manufacturer?',
    hint: 'Art. 2(7).',
    triggerAnswer: 'yes',
    outReason: 'Excluded under Art. 2(7).',
  },
  {
    question:
      'Is it purely a hosted service (SaaS/website) with nothing installed on the user side and not a remote data processing solution for a product?',
    hint: 'Recital 11–12, Art. 3(2).',
    triggerAnswer: 'yes',
    outReason:
      'Pure SaaS is outside the CRA (NIS2 may apply to the provider).',
  },
];

export interface AnnexOption {
  key: 'none' | 'c1' | 'c2' | 'cr';
  label: string;
}

export const ANNEX_OPTIONS: AnnexOption[] = [
  { key: 'none', label: 'None of these' },
  {
    key: 'c1',
    label:
      'Class I (e.g. password manager, browser, OS, router, smart lock, security camera, VPN, antivirus)',
  },
  {
    key: 'c2',
    label:
      'Class II (hypervisor, container runtime, firewall, IDS/IPS, tamper-resistant MCU)',
  },
  {
    key: 'cr',
    label:
      'Critical (HSM/security box, smart meter gateway, smartcard/secure element)',
  },
];

export interface TimelineMilestone {
  date: string;
  title: string;
  detail: string;
  accentClass: string;
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    date: '10 Dec 2024',
    title: 'Entered into force',
    detail: 'Regulation (EU) 2024/2847 formally entered into force.',
    accentClass: 'bg-[#2563EB]',
  },
  {
    date: '11 Sep 2026',
    title: 'Reporting & Notified Bodies',
    detail:
      'Reporting obligations (Art. 14) and notified-body provisions apply.',
    accentClass: 'bg-[#06B6D4]',
  },
  {
    date: '11 Dec 2027',
    title: 'Full Application',
    detail: 'All other EU Cyber Resilience Act obligations apply.',
    accentClass: 'bg-[#FACC15]',
  },
];

export function normalizeQuery(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 \-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchCatalog(query: string): CatalogItem[] {
  const q = normalizeQuery(query);
  if (q.length < 2) return [];
  const qt = q.split(' ').filter((w) => w.length > 2);

  return CATALOG.map((c) => {
    let s = 0;
    const ks = c.keywords.split(',').concat([normalizeQuery(c.name)]);
    for (const k of ks) {
      if (k === q) {
        s = Math.max(s, 100);
      } else if (q.includes(k) && k.length > 2) {
        s = Math.max(s, 60 + k.length);
      } else if (k.includes(q) && q.length > 2) {
        s = Math.max(s, 40 + q.length);
      } else {
        const kt = k.split(' ');
        const o = qt.filter((w) => kt.includes(w)).length;
        if (o) {
          s = Math.max(s, 10 * o);
        }
      }
    }
    return { score: s, item: c };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.item);
}

