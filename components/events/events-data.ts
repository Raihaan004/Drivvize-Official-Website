import { IMG } from '@/components/premium-home/data'

export type EventKind = 'internal' | 'external'
export type DrivvizeEvent = {
  id: string
  title: string
  kind: EventKind
  format: 'In person' | 'Online' | 'Hybrid'
  start?: string
  end?: string
  time?: string
  location: string
  hosts: string[]
  about: string
  agenda?: string[]
  image: string
  tags: string[]
}

export type PastEvent = { id: string; title: string; kind: EventKind; year: number; role: string; image: string }

function ist(days: number, hh: number, mm = 0) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(hh)}:${p(mm)}:00+05:30`
}

export const UPCOMING: DrivvizeEvent[] = [
  {
    id: 'intro-fusa',
    title: 'Introduction to Functional Safety (FuSa)',
    kind: 'internal',
    format: 'Online',
    start: ist(18, 10),
    end: ist(18, 13),
    time: '10:00 – 13:00 IST',
    location: 'Live online session',
    hosts: ['Sowmya Radhakrishnan'],
    about: 'A practical introduction to functional safety, filled with lots of examples and tips that you can start using at work right after.',
    agenda: ['Why functional safety matters in vehicles', 'The ISO 26262 lifecycle at a glance', 'Hazards, safety goals and ASIL', 'Questions and discussion'],
    image: IMG.presenting,
    tags: ['Training', 'ISO 26262'],
  },
  {
    id: 'iso26262-cert',
    title: 'ISO 26262 Certification (4-day) Training',
    kind: 'internal',
    format: 'In person',
    start: ist(35, 9, 30),
    end: ist(38, 17, 30),
    time: '09:30 – 17:30 IST, daily',
    location: 'Venue shared on registration',
    hosts: ['Sowmya Radhakrishnan', 'Sridharan Subramani'],
    about: 'Certification training in which you are certified as a functional safety practitioner once you pass our exam. Certifications are issued by a well-renowned international certification body.',
    agenda: ['Systems, hardware and software safety', 'Safety analysis and dependent failure analysis', 'Safety concepts and work products', 'Certification exam'],
    image: IMG.meeting,
    tags: ['Certification', 'ISO 26262'],
  },
  {
    id: 'seooc-workshop',
    title: 'How to develop an SEooC',
    kind: 'internal',
    format: 'Online',
    start: ist(52, 15),
    end: ist(52, 17),
    time: '15:00 – 17:00 IST',
    location: 'Live online session',
    hosts: ['Sridharan Subramani'],
    about: 'Defining the assumptions of use is the most critical challenge in SEooC development. Learn how to make sure all AoUs are covered and nothing is missed.',
    agenda: ['What counts as an SEooC', 'Defining assumptions of use', 'Safety manual and integration', 'Questions and discussion'],
    image: IMG.whiteboard,
    tags: ['Training', 'SEooC'],
  },
  {
    id: 'iso21434-cert',
    title: 'ISO 21434 Certification (3-day) Training',
    kind: 'internal',
    format: 'Online',
    start: ist(70, 10),
    end: ist(72, 16),
    time: '10:00 – 16:00 IST, daily',
    location: 'Live online sessions',
    hosts: ['Nageswaran Jayaraman', 'Sowmya Radhakrishnan'],
    about: 'Certification training for automotive cybersecurity, from TARA to cybersecurity concepts and vulnerability analysis, with an exam at the end.',
    image: IMG.laptop,
    tags: ['Certification', 'ISO 21434'],
  },
  {
    id: 'ansys-2025',
    title: 'Ansys Conference 2025',
    kind: 'external',
    format: 'In person',
    location: 'To be announced',
    hosts: ['Drivvize team'],
    about: 'Drivvize will be speaking at the Ansys Conference. Date, venue and session details will be announced soon.',
    image: IMG.stage,
    tags: ['Speaker', 'Conference'],
  },
]

export const PAST: PastEvent[] = [
  { id: 'sdv-2025', title: 'SDV Conference, IIT Chennai', kind: 'external', year: 2025, role: 'Speaker', image: IMG.audience },
  { id: 'cii-2024', title: 'CII Conference', kind: 'external', year: 2024, role: 'Speaker', image: IMG.stage },
  { id: 'essc-2024', title: 'Embedded Safety and Security Conference', kind: 'external', year: 2024, role: 'Speaker', image: IMG.presenting },
  { id: 'autoiq', title: 'Auto IQ Safety Conference', kind: 'external', year: 0, role: 'Media partner', image: IMG.meeting },
  { id: 'nev', title: 'NEV Conference, Europe', kind: 'external', year: 0, role: 'Media partner', image: IMG.concept },
]

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', ...o }).format(new Date(iso))
export const month = (iso: string) => fmt(iso, { month: 'short' })
export const day = (iso: string) => fmt(iso, { day: 'numeric' })
export const weekday = (iso: string) => fmt(iso, { weekday: 'long' })
export const longDate = (e: DrivvizeEvent) => {
  if (!e.start) return 'Date to be announced'
  const a = fmt(e.start, { day: 'numeric', month: 'long', year: 'numeric' })
  if (!e.end) return a
  const b = fmt(e.end, { day: 'numeric', month: 'long', year: 'numeric' })
  return a === b ? a : `${fmt(e.start, { day: 'numeric', month: 'long' })} – ${b}`
}
export const dayRange = (e: DrivvizeEvent) => {
  if (!e.start) return 'TBA'
  const a = day(e.start)
  const b = e.end ? day(e.end) : a
  return a === b ? a : `${a}–${b}`
}

export function icsFor(e: DrivvizeEvent) {
  if (!e.start) return ''
  const z = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Drivvize//Events//EN',
    'BEGIN:VEVENT',
    `UID:${e.id}@drivvize.com`,
    `DTSTAMP:${z(new Date().toISOString())}`,
    `DTSTART:${z(e.start)}`,
    `DTEND:${z(e.end ?? e.start)}`,
    `SUMMARY:${e.title}`,
    `DESCRIPTION:${e.about.replace(/\n/g, ' ')}`,
    `LOCATION:${e.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

