const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMG = {
  concept: img('photo-1704340142770-b52988e5b6eb', 2200),
  freeway: img('photo-1496055401924-5e7fdc885742', 2200),
  headlight: img('photo-1556448851-9359658faa54', 2200),
  neon: img('photo-1542282088-fe8426682b8f', 1200),
  engineer: img('photo-1730210730648-4c0618bb3e11', 1400),
  wheel: img('photo-1625690180114-5530b1304127', 1400),
  aerialRoad: img('photo-1498637841888-108c6b723fcb', 1400),
  charging: img('photo-1593941707874-ef25b8b4a92b', 1400),
  charger: img('photo-1639302610362-4c86747e8680', 1200),
  laptop: img('photo-1686984096026-23d6e82f9749', 1400),
  whiteCar: img('photo-1615572506040-1f2f7bc8cc47', 1400),
  office: img('photo-1758876017801-f5a892ee460a', 1400),
  cluster: img('photo-1585014165903-6d6c6ebad3e9', 1200),
  clusterBw: img('photo-1610913721979-b20ede600e63', 1000),
  speedo: img('photo-1597386601945-8980df52c3dc', 1000),
  porsche: img('photo-1615966996783-5d361a011237', 1000),
  plug: img('photo-1704475336842-0ab3798abf0e', 1000),
  garage: img('photo-1676288176903-a68732722cce', 900),
  cityEv: img('photo-1615829386703-e2bb66a7cb7d', 900),
  tractor: img('photo-1594771804886-a933bb2d609b', 1200),
  boat: img('photo-1571510168951-bc6189f2dfad', 1200),
  stage: img('photo-1587825140708-dfaf72ae4b04', 1400),
  audience: img('photo-1627931539006-d5c4677e05ea', 1000),
  road: img('photo-1670968982569-722c875727dc', 2200),
  brake: img('photo-1696494561430-de087dd0bd69', 2200),
  train: img('photo-1527295110-5145f6b148d0', 2200),
  padlock: img('photo-1555529902-5261145633bf', 1400),
  blueLock: img('photo-1757072600329-f38a321f3397', 1400),
  servers: img('photo-1782094673136-5198a372980c', 1400),
  code: img('photo-1515879218367-8466d910aaa4', 1400),
  presenting: img('photo-1758691736722-cda1858056e0', 1600),
  whiteboard: img('photo-1664382953518-4a664ab8a8c9', 1400),
  meeting: img('photo-1758691736067-b309ee3ef7b9', 1400),
}

export type NavItem = {
  label: string
  path: string
  anchor?: string
  children?: { label: string; path: string; anchor?: string }[]
}

export const NAV: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  {
    label: 'Services',
    path: '/services',
    children: [
      { label: 'Functional Safety Services', path: '/services#functional-safety', anchor: 'functional-safety' },
      { label: 'Cybersecurity Services', path: '/services#cybersecurity', anchor: 'cybersecurity' },
      { label: 'Trainings', path: '/services#trainings', anchor: 'trainings' },
    ],
  },
  { label: 'Clients', path: '/#proof', anchor: 'proof' },
  { label: 'Case Studies', path: '/casestudies' },
  {
    label: 'Learn',
    path: '/learn',
    children: [
      { label: 'Blog', path: '/blog' },
      { label: 'Events', path: '/events' },
      { label: 'Knowledge Mine', path: '/learn#knowledge', anchor: 'knowledge' },
      { label: 'Videos', path: '/learn#videos', anchor: 'videos' },
      { label: 'Downloads', path: '/learn#downloads', anchor: 'downloads' },
      { label: 'FAQs', path: '/faqs' },
    ],
  },
  { label: 'EU CRA Scope Checker', path: '/scope-checker' },
]

export const HERO_SLIDES = [
  { src: IMG.concept, pos: '50% 50%' },
  { src: IMG.freeway, pos: '50% 50%' },
  { src: IMG.headlight, pos: '50% 50%' },
]

export const BAND = [IMG.porsche, IMG.plug, IMG.clusterBw, IMG.garage, IMG.speedo, IMG.cityEv]

export const PARTNER = [
  { text: 'build Automotive products safe and secure from scratch following ISO 26262 and ISO 21434 standards', image: IMG.wheel },
  { text: 'navigate the new evolving regulations for ADAS', image: IMG.aerialRoad },
  { text: 'make your products cyber resilient as per EU-CRA standards', image: IMG.charging },
  { text: 'build certification-ready processes for functional safety and cybersecurity', image: IMG.laptop },
  { text: 'adapt pre-built Automotive products to become safe and secure', image: IMG.neon },
  { text: 'scale pre-defined Systems and vehicle architectures for future capabilities', image: IMG.whiteCar },
  { text: 'build certification-ready Automotive SW and tools', image: IMG.office },
]

export const STATS = [
  { n: 40, label: 'Safety Projects end-to-end' },
  { n: 35, label: 'ASIL B programs' },
  { n: 5, label: 'ASIL D programs' },
  { n: 7, label: 'Safety Assessments held' },
  { n: 15, label: 'Safety critical Systems' },
  { n: 8, label: 'Regions' },
]

export const INDUSTRIES = [
  { name: 'Automotive', image: IMG.whiteCar },
  { name: 'Agriculture', image: IMG.tractor },
  { name: 'Marine', image: IMG.boat },
]

export const GROUPS = [
  {
    name: 'Chassis & motion',
    image: IMG.aerialRoad,
    systems: ['Steer-by-wire', 'Brake-by-wire', 'Anti-lock braking System', 'Electronic Parking Brakes', 'Tyres'],
  },
  {
    name: 'Powertrain & energy',
    image: IMG.charger,
    systems: ['Motor Control Units', 'Inverters', 'Battery Management Systems', 'Fuel-cell compressors'],
  },
  {
    name: 'ADAS & perception',
    image: IMG.headlight,
    systems: ['Front Camera', 'Radars', 'ADAS Controllers'],
  },
  {
    name: 'Cockpit & cabin',
    image: IMG.cluster,
    systems: ['Instrument Clusters', 'Cockpit domain controllers', 'Seats'],
  },
]

export const RECOGNITION = [
  { kind: 'Author', title: 'FunctionalSafetyFirst.com', note: '>400K viewers', href: 'https://www.functionalsafetyfirst.com/' },
  { kind: 'Media partner', title: 'Auto IQ Safety Conference' },
  { kind: 'Media partner', title: 'NEV Conference, Europe' },
  { kind: 'Speaker', title: 'CII Conference', note: '2024' },
  { kind: 'Speaker', title: 'Embedded Safety and Security Conference', note: '2024' },
  { kind: 'Speaker', title: 'SDV Conference, IIT Chennai', note: '2025' },
  { kind: 'Speaker', title: 'Ansys Conference', note: '2025', soon: true },
]

export const FOUNDERS = [
  {
    name: 'Nageswaran Jayaraman',
    initials: 'NJ',
    years: 22,
    image: '/images/founders/Nagesh_edited.jpg',
    linkedin: 'https://www.linkedin.com/in/nageshjayaraman/',
    bio: 'Nagesh has over 22 years of experience in the Automotive. He is a visionary leader who has successfully built FuSa and Cybersecurity teams globally and successfully delivered over 30 ASIL programs and 5 Cybersecurity programs.',
  },
  {
    name: 'Sridharan Subramani',
    initials: 'SS',
    years: 20,
    image: '/images/founders/Sridhar_edited_edited.jpg',
    linkedin: 'https://www.linkedin.com/in/sridharan-subramani-b035336/',
    bio: 'Sridhar has over 20 years of experience in Automotive and is an expert in FuSa across Systems, SW, HW, Manufacturing and Safety Management. He builds simple, scalable, efficient and certifiable processes for Functional Safety and Cybersecurity.',
  },
  {
    name: 'Sowmya Radhakrishnan',
    initials: 'SR',
    years: 22,
    image: '/images/founders/Sowmya_edited.jpg',
    linkedin: 'https://www.linkedin.com/in/sowmyark/',
    bio: 'Sowmya has over 22 years of experience in Automotive and is an Expert in Systems and Software Safety. Her experience as a SW Architect gives her an edge in offering practical and customized solutions to SW and System Safety challenges. She is also an expert in training technical teams and regularly performs technical FuSa audits and assessments.',
  },
]

export function goTo(anchor: string, fallbackPath?: string) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(anchor);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (fallbackPath) {
    window.location.href = fallbackPath;
  } else {
    window.location.href = anchor === 'top' ? '/' : `/#${anchor}`;
  }
}

