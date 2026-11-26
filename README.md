# Drivvize Official Website

Full-stack production web application and admin portal for **Drivvize** (`www.drivvize.com`) — an automotive engineering consultancy specializing in **Functional Safety (ISO 26262, SOTIF, ISO/PAS 8800)**, **Automotive Cybersecurity (ISO/SAE 21434, EU CRA)**, **ASPICE**, **ADAS**, and **Software-Defined Vehicles (SDV)**.

Built with **Next.js 16 (App Router, Turbopack)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Neon Postgres**, and **Drizzle ORM**.

---

## Tech Stack

- **Framework:** Next.js `16.4.6` (`cacheComponents: true`, `partialPrefetching: true`, Turbopack)
- **UI & Styling:** React `19.3.0`, TypeScript `5` (`strict`), Tailwind CSS v4 (`@tailwindcss/turbopack` `4.3.3`), `lucide-react`, `Inter` & `Manrope` (`next/font/google`)
- **Database & ORM:** Neon Postgres (`@neondatabase/serverless`) + Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Email & Notifications:** `nodemailer` (SMTP delivery for contact inquiries, career resume alerts, and gated PDF publications)
- **Authentication:** HMAC-SHA256 signed `httpOnly` session cookie (`drivvize_admin_session`) in `lib/adminAuth.ts`

---

## Project Structure

```text
.
├── app/
│   ├── page.tsx                     # Home landing page
│   ├── layout.tsx                   # Root layout, Google Fonts & SiteShell
│   ├── globals.css                  # Tailwind v4 @theme tokens & print/prose styles
│   ├── (public routes)/             # /services, /products, /casestudies, /learn, /events,
│   │                                # /blog, /blog/[slug], /scope-checker, /careers, /contact, /faqs
│   ├── admin/                       # Authenticated Admin Portal (/admin/**)
│   └── api/                         # Public & /api/admin/* route handlers
├── components/
│   ├── admin/                       # BlogEditorForm, EventEditorForm, Word-style RichTextEditor
│   ├── blog/                        # BlogListClient, BlogPostClient, ArticleContent,
│   │                                # BlogInteractions (rating/like/share/print), BlogComments
│   ├── careers/                     # CareersClient (hero, work areas, resume upload intake)
│   ├── casestudies/                 # CaseStudiesClient
│   ├── contact/                     # ContactClient
│   ├── events/                      # EventsClient, UpcomingEventToast, starter event data
│   ├── faqs/                        # FaqsClient & FAQ dataset
│   ├── layout/                      # SiteShell (shell routing boundary) & corporate nav/footer
│   ├── learn/                       # LearnClient, DownloadsSection, KnowledgeMineSection, PostCard
│   ├── premium-home/                # Active design system (Nav, Footer, Hero, About, Proof, Systems, Founders)
│   ├── products/                    # ProductsClient (ISO 26262 Safety Kit tiers)
│   ├── scope-checker/               # ScopeCheckerClient & interactive assessment logic
│   ├── services/                    # ServicesClient, ServiceStory, TrainingsSection (expandable syllabi)
│   └── ui/                          # Shared visual primitives
├── constants/
│   ├── learnResources.ts            # Metadata registry for gated PDF publications
│   └── tokens.ts                    # Shared brand tokens & navigation route constants
├── hooks/
│   └── useScrollReveal.ts           # Reduced-motion-aware scroll reveal hooks
├── lib/
│   ├── adminAuth.ts                 # HMAC session token signing/verification & cookie helpers
│   ├── blogConstants.ts             # Blog categories, presets, slugification, card merging
│   ├── blogQueries.ts               # Server-side blog, engagement, and comment queries
│   ├── db/
│   │   ├── index.ts                 # Neon HTTP + Drizzle database client
│   │   └── schema.ts                # Drizzle Postgres tables & inferred types
│   ├── eventConstants.ts            # Event defaults & helpers
│   ├── eventQueries.ts              # Server-side event queries
│   ├── functionalsafetyfirst.ts     # RSS parser for Knowledge Mine feed
│   ├── mailer.ts                    # Pooled Nodemailer SMTP client & email templates
│   └── richText.ts                  # HTML/markdown sanitization & rendering helpers
├── private_documents/download_pdf/  # Gated PDFs delivered strictly as email attachments
├── public/                          # Logos, founder portraits, and public imagery
├── drizzle.config.ts                # Drizzle Kit configuration (.env.local aware)
└── next.config.ts                   # Next.js configuration
```

> **Note:** `components/layout/SiteShell.tsx` bypasses the legacy corporate shell on `/`, `/products`, `/services`, `/casestudies`, `/learn`, `/events`, `/contact`, `/scope-checker`, `/careers`, `/faqs`, `/blog`, `/blog/*`, and `/admin/*` so each page renders with `components/premium-home/` (`Nav` & `Footer`) or `app/admin/layout.tsx`.

---

## Core Features

### Public Website
- **Home (`/`):** Animated hero, engineering methodology band, OEM partnership pillars, metrics proof, safety-critical systems showcase, industry recognition, founders section, and dismissible upcoming event toast.
- **Services (`/services`):** Functional safety, cybersecurity, SOTIF, PAS 8800, ASPICE consulting, plus an interactive **Trainings** section with expandable curriculum modules.
- **Products (`/products`):** ISO 26262 Safety Kit comparison tiers (`Basic`, `Custom`, `Consultant`).
- **Learn Hub (`/learn`):**
  - Gated technical PDF downloads delivered via `/api/learn/download` using `private_documents/download_pdf/`.
  - Embedded Functional Safety YouTube training videos.
  - **Knowledge Mine** external feed synced with ISR/caching via `/api/knowledge-mine`.
  - Latest blog articles.
- **Engineering Blog (`/blog`, `/blog/[slug]`):**
  - Server-rendered articles backed strictly by Neon Postgres (`blogs`) with empty states when none are published.
  - Card metadata (thumbnail, category, title, excerpt, author, published date, read time).
  - Interactive reader bar: 5-star rating, likes (`/api/blogs/[slug]/engage`), LinkedIn share, copy link, print layout, optional downloadable attachment card, daily/unique view telemetry (`blog_views`), and public comments (`blog_comments`).
- **Events (`/events`):** Published workshops/webinars from Postgres (`events`) with registration either via external Google Form links or built-in database registration (`/api/events/register`).
- **Interactive Scope Checker (`/scope-checker`):** Guided self-assessment for functional safety and regulatory compliance scope.
- **Careers (`/careers`):** Resume submission form (`POST /api/careers`) validating and storing PDF/DOC/DOCX uploads (up to 5 MB) directly in Postgres (`career_applications`), with optional HR SMTP alerts.
- **Contact (`/contact`):** Inquiry intake (`POST /api/contact`) persisted to Postgres (`contact_submissions`) with optional SMTP & webhook notifications.
- **Case Studies (`/casestudies`) & FAQs (`/faqs`):** Automotive case studies and filterable engineering FAQs.

### Admin Portal (`/admin`)
Protected by signed `httpOnly` cookie authentication (`/admin/login`). Every `/api/admin/*` endpoint enforces `getAdminSession()`.

- **Dashboard (`/admin`):** Real-time summary metrics across blogs, inquiries, PDF downloads, events/registrations, and career resumes.
- **Blog Overview (`/admin/blogs/overview`):** 30-day & daily view analytics, unique visitor tracking, comment/rating/like totals, SVG sparklines, and per-post performance table.
- **Blog Editor & Manager (`/admin/blogs`, `/admin/blogs/new`, `/admin/blogs/[id]`):** Word-style `RichTextEditor`, writer selector synced with `blog_writers`, cover thumbnail picker/uploader, optional attached document, publish scheduling, and live card/article preview.
- **Comments Moderation (`/admin/blogs/comments`):** Search, Visible/Hidden status filtering, official Drivvize team replies, visibility toggle, and deletion.
- **Writers Directory (`/admin/blogs/writers`):** Manage writer profiles, titles, roles, avatar colors, and view live article counts.
- **Events Manager (`/admin/events`, `/admin/events/new`, `/admin/events/[id]`):** Create/edit events, toggle featured/published status, paste Google Form registration URLs, and review attendee registrations.
- **Career Resumes (`/admin/careers`):** Search/filter candidate resumes, update hiring status (`new`, `reviewed`, `shortlisted`, `contacted`, `archived`), save internal HR notes, preview PDFs in-browser, download resume files, or delete entries.
- **Contact Inquiries (`/admin/inquiries`) & PDF Downloads (`/admin/downloads`):** Inspect, search, export/follow up, and manage lead records.
- **Pages Overview (`/admin/pages`):** Live route directory and database linkage status.

---

## Database Schema (`lib/db/schema.ts`)

| Table | Purpose |
| --- | --- |
| `blogs` | Published/draft blog articles, metadata, view counters, and optional document attachment |
| `blog_engagements` | Per-slug likes and 5-star rating aggregates |
| `blog_writers` | Author/writer directory linked to blog post authorship |
| `blog_comments` | Reader comments, moderation status (`approved`/`hidden`), and `admin_reply` |
| `blog_views` | Timestamped daily & hashed anonymous visitor view telemetry |
| `events` | Events/trainings metadata, dates, hosts, and optional `registration_url` |
| `event_registrations` | Direct website event signups |
| `career_applications` | Candidate details, hiring status, HR notes, and uploaded resume payload |
| `contact_submissions` | Contact form inquiries |
| `pdf_downloads` | Gated whitepaper/resource download lead log |

---

## API Routes Overview

### Public APIs
- `POST /api/contact`, `GET /api/contact` — Submit or inspect recent contact submissions
- `POST /api/careers` — Multipart resume submission (PDF/DOC/DOCX up to 5 MB)
- `GET /api/blogs`, `GET /api/blogs/[slug]` — Public published blog listings and article lookup
- `POST /api/blogs/[slug]/engage` — Submit like or 5-star rating
- `GET /api/blogs/[slug]/comments`, `POST /api/blogs/[slug]/comments` — Read approved comments or post a comment
- `GET /api/events`, `POST /api/events/register` — Public event feed and registration
- `POST /api/learn/download`, `GET /api/learn/download` — Email-gated PDF delivery & catalog info
- `GET /api/knowledge-mine` — Cached Knowledge Mine RSS feed
- `GET /api/neon` — Neon Postgres connectivity check

### Admin APIs (`getAdminSession()` required except login/logout)
- `POST /api/admin/auth/login`, `POST /api/admin/auth/logout`, `GET /api/admin/auth/me`
- `GET /api/admin/stats`
- `GET, POST /api/admin/blogs` & `GET, PUT, DELETE /api/admin/blogs/[id]`
- `GET /api/admin/blogs/overview`
- `GET, PUT, DELETE /api/admin/blogs/comments`
- `GET, POST /api/admin/writers` & `PUT, DELETE /api/admin/writers/[id]`
- `GET, POST /api/admin/events`, `GET, PUT, DELETE /api/admin/events/[id]`, `GET /api/admin/events/registrations`
- `GET /api/admin/careers`, `PATCH, DELETE /api/admin/careers/[id]`, `GET /api/admin/careers/[id]/resume`
- `GET /api/admin/inquiries` & `DELETE /api/admin/inquiries/[id]`
- `GET /api/admin/downloads` & `DELETE /api/admin/downloads/[id]`

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon Postgres (required)
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...

# Admin Authentication (recommended to override defaults in production)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-strong-password
ADMIN_JWT_SECRET=your-long-random-secret

# Optional SMTP Email Delivery (Contact alerts, Career resume alerts, Gated Learn PDFs)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-smtp-user@example.com
SMTP_PASS=your-smtp-app-password
CONTACT_RECEIVER_EMAIL=inbox@example.com
CAREERS_RECEIVER_EMAIL=hr@example.com

# Optional Webhook / Careers Endpoint Override
CONTACT_WEBHOOK_URL=
NEXT_PUBLIC_CAREERS_ENDPOINT=/api/careers
```

> **Security Note:** Never commit `.env.local`. Set strong values for `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` in production instead of relying on development fallbacks in `lib/adminAuth.ts`.

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the Admin Portal.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js development server (Turbopack) |
| `npm run build` | Run TypeScript checks & production build |
| `npm run start` | Start the production Next.js server |
| `npm run lint` | Run ESLint across the repository |
| `npm run db:push` | Push Drizzle schema changes directly to Postgres |
| `npm run db:generate` | Generate SQL migration files in `drizzle/` |
| `npm run db:migrate` | Apply generated migrations |
| `npm run db:studio` | Open Drizzle Studio database explorer |

---

## Verification

Before deploying, verify linting, type checking, and the production build:

```bash
npm run lint && npm run build
```
