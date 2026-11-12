/**
 * Official Drivvize Design System Tokens
 * Built for www.drivvize.com homepage and future multi-page expansion
 */

export const DRIVVIZE_TOKENS = {
  colors: {
    primary: {
      deepNavy: '#0B2545',
      technicalBlue: '#2563EB',
      safetyYellow: '#FACC15',
      coolGrey: '#F1F5F9',
      pureWhite: '#FFFFFF',
    },
    supporting: {
      cyan: '#06B6D4',
      teal: '#0D9488',
      steelBlue: '#315B7D',
      silver: '#94A3B8',
      slate: '#202B36',
      safetyOrange: '#F97316',
      lightSteel: '#DCE3EA',
    },
  },
  gradients: {
    corporateBlue: 'bg-gradient-corporate-blue',
    technicalInnovation: 'bg-gradient-technical-innovation',
    premiumDark: 'bg-gradient-premium-dark',
    lightCorporate: 'bg-gradient-light-corporate',
  },
  typography: {
    fontHeading: "'Manrope', sans-serif",
    fontBody: "'Inter', sans-serif",
    heroHeading: 'text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[68px] font-bold leading-[1.08] tracking-[-0.025em]',
    sectionHeading: 'text-[30px] sm:text-[38px] lg:text-[44px] font-bold leading-[1.14] tracking-[-0.022em]',
    subheading: 'text-[20px] sm:text-[24px] lg:text-[26px] font-semibold leading-[1.3]',
    bodyLarge: 'text-[16px] sm:text-[17px] lg:text-[18px] font-normal leading-[1.68]',
    bodyRegular: 'text-[15px] sm:text-[16px] font-normal leading-[1.65]',
    navLink: 'text-[14px] xl:text-[15px] font-medium leading-none',
    smallLabel: 'text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase',
  },
  spacing: {
    container: 'max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8',
    sectionPadding: 'py-16 sm:py-20 lg:py-24',
    grid12: 'grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8',
  },
  borders: {
    subtle: 'border border-[#DCE3EA]',
    interactive: 'border border-[#DCE3EA] hover:border-[#2563EB]/60',
    radiusCard: 'rounded-[14px]',
  },
  shadows: {
    cardRest: 'shadow-[0_2px_10px_-3px_rgba(11,37,69,0.04)]',
    cardHover: 'hover:shadow-[0_16px_36px_-12px_rgba(11,37,69,0.10)]',
    bluePrimary: 'shadow-[0_8px_22px_-6px_rgba(37,99,235,0.42)] hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.55)]',
  },
  animations: {
    micro: 'transition-all duration-250 ease-out',
    cardHover: 'transition-all duration-300 ease-out hover:-translate-y-1',
  },
} as const;

export interface NavRouteItem {
  label: string;
  href: string;
  description?: string;
  code?: string;
  sectionAnchor?: string;
  isPage?: boolean;
}

export const SERVICE_ROUTES: NavRouteItem[] = [
  {
    label: 'Functional Safety Services',
    href: '/services#functional-safety',
    description: 'End-to-end ISO 26262 lifecycle engineering, ASIL A–D concepts, audits & safety management.',
    code: 'ISO 26262',
    sectionAnchor: 'functional-safety',
    isPage: true,
  },
  {
    label: 'Cybersecurity Services',
    href: '/services#cybersecurity',
    description: 'ISO/SAE 21434 & EU-CRA compliance, TARA, CSMS architecture & cyber resilience.',
    code: 'ISO 21434',
    sectionAnchor: 'cybersecurity',
    isPage: true,
  },
  {
    label: 'Trainings',
    href: '/services#trainings',
    description: 'Practitioner-led technical training programs for automotive Systems, SW & HW engineering teams.',
    code: 'ACADEMY',
    sectionAnchor: 'trainings',
    isPage: true,
  },
];

export const PRIMARY_NAV_ROUTES: NavRouteItem[] = [
  { label: 'Products', href: '/products', isPage: true },
  // Services is rendered via ServicesDropdown right after Products
  { label: 'Clients', href: '/clients', sectionAnchor: 'experience' },
  { label: 'Case Studies', href: '/casestudies', isPage: true },
  { label: 'Learn', href: '/learn', sectionAnchor: 'recognition' },
  { label: 'Scope Checker', href: '/scope-checker', isPage: true },
];

