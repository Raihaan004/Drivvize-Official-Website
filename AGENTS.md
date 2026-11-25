<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

---

# Drivvize Official Website — Agent Architecture & Engineering Guide

You are working on **Drivvize Official Website** (`www.drivvize.com`), a production-grade Next.js full-stack web application for **Drivvize** — an automotive engineering consultancy specializing in **Functional Safety (ISO 26262, SOTIF, PAS 8800)**, **Automotive Cybersecurity (ISO/SAE 21434, EU CRA)**, **ASPICE**, **ADAS**, and **Software-Defined Vehicles (SDV)**.

This document is the single source of truth for how the project is structured, how its runtime/data flows behave, and the engineering, styling, and SEO rules every AI must follow.

---

## 1. Tech Stack & Configuration

- **Framework:** Next.js `16.4.6` (App Router, Turbopack), React `19.3.0`, TypeScript `5` (`strict: true`).
  - `next.config.ts` enables `cacheComponents: true`, `partialPrefetching: true`, and `experimental.agentFeedback: true`.
  - **Next.js 16 Implications:** Dynamic route `params` are `Promise`s (`await params`). Dynamic server pages or GET handlers reading live DB data must opt into request-time rendering via `await connection()` (from `next/server`) or `<Suspense>` boundaries. Always consult `node_modules/next/dist/docs/` before using unfamiliar Next.js APIs.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/turbopack` `4.3.3`) configured via CSS-first `@theme inline` in `app/globals.css` (no `tailwind.config.*`).
  - Fonts loaded via `next/font/google` in `app/layout.tsx`: `Inter` (`--font-inter`) and `Manrope` (`--font-manrope`).
- **Database & ORM:** Neon Lakebase Postgres (`@neondatabase/serverless` HTTP driver) + Drizzle ORM (`drizzle-orm`, `drizzle-kit`), configured in `drizzle.config.ts`, `neon.ts`, `lib/db/index.ts`, and `lib/db/schema.ts`.
- **Email & Auth:** `nodemailer` (SMTP / Gmail App Password in `lib/mailer.ts` and `app/api/contact/route.ts`) and HMAC-SHA256 signed `httpOnly` session cookies (`lib/adminAuth.ts`).
- **Icons:** `lucide-react` + custom inline SVGs inside `components/premium-home/`.
- **Path Alias:** `@/*` resolves to the project root `./*` (note: this repository uses root-level `app/`, `components/`, `constants/`, `hooks/`, `lib/` rather than a `src/` directory).

### Useful Commands
- `npm run dev` — Start Next.js dev server.
- `npm run build` — Production build + TypeScript verification.
- `npm run lint` — ESLint (`eslint-config-next/core-web-vitals` + `typescript`; `@next/next/no-img-element` is off in `eslint.config.mjs`).
- `npm run db:push` / `npm run db:generate` / `npm run db:migrate` / `npm run db:studio` — Drizzle Kit database commands (uses `DATABASE_URL_UNPOOLED || DATABASE_URL` from `.env.local`).

---

## 2. Directory Structure & Active vs. Legacy Boundaries

Maintain strict separation of concerns across the root-level App Router architecture:

- **`app/`** — Routing, layouts, `page.tsx`, API routes (`app/api/**`), `globals.css`, and the Admin Portal (`app/admin/**`).
  - Keep `page.tsx` files **thin**: export typed `Metadata` (or `generateMetadata`), perform server data fetching if needed, and render modular feature/section components rather than writing huge page layouts inline.
- **`components/premium-home/`** — **Active primary design system** used across the homepage and all public pages:
  - `Nav.tsx`, `Footer.tsx`, `Hero.tsx`, `About.tsx`, `Band.tsx`, `Partner.tsx`, `Proof.tsx`, `Systems.tsx`, `Recognition.tsx`, `Founders.tsx`, `data.ts` (centralized `IMG`, `NAV`, `HERO_SLIDES`, `BAND`, `PARTNER`, `STATS`, `INDUSTRIES`, `GROUPS`, `RECOGNITION`, `FOUNDERS`, `goTo`), and `hooks.tsx` (`useInView`, `Reveal`, `Photo`, `CountUp`).
- **`components/<domain>/`** — Modular domain/page feature packages (all public pages compose `Nav` and `Footer` from `components/premium-home/`):
  - `blog/` (`BlogListClient.tsx`, `BlogPostClient.tsx`, `ArticleContent.tsx`)
  - `careers/` (`CareersClient.tsx`)
  - `casestudies/` (`CaseStudiesClient.tsx`)
  - `contact/` (`ContactClient.tsx`)
  - `events/` (`EventsClient.tsx`, `UpcomingEventToast.tsx`, `events-data.ts`)
  - `faqs/` (`FaqsClient.tsx`, `faqs-data.ts`)
  - `learn/` (`LearnClient.tsx`, `PostCard.tsx`, `learn-data.ts`)
  - `products/` (`ProductsClient.tsx`)
  - `scope-checker/` (`ScopeCheckerClient.tsx`, `scopeCheckerData.ts`)
  - `services/` (`ServicesClient.tsx`, `ServiceStory.tsx`)
- **`components/layout/` & `components/ui/` & `components/sections/`** — Earlier corporate shell & primitives:
  - `app/layout.tsx` wraps `{children}` in `<SiteShell>` (`components/layout/SiteShell.tsx`).
  - **Critical Shell Routing Rule:** `SiteShell.tsx` checks `isCustomShell` for `/`, `/products`, `/services`, `/casestudies`, `/learn`, `/events`, `/contact`, `/scope-checker`, `/careers`, `/faqs`, `/blog`, `/blog/*`, and `/admin/*` — returning `<>{children}</>` directly so each route uses `premium-home`'s `Nav`/`Footer` (or `admin/layout.tsx`). **Whenever you add a new public route using `premium-home` `Nav`/`Footer`, add its path to `isCustomShell` in `components/layout/SiteShell.tsx`** (otherwise the legacy `Navbar`/`Footer` from `components/layout/` will wrap the page).
  - `components/sections/` is legacy and currently unreferenced; do not add new code there unless intentionally consolidating.
  - `components/ui/` holds reusable visual primitives (`DrivvizeLogo.tsx`, `GradientButton.tsx`, `GlassNavbar.tsx`, `SectionContainer.tsx`, `SectionHeader.tsx`, `SectionReveal.tsx`, `AnimatedCounter.tsx`, `AmbientGlow.tsx`, `AnimatedGradientBackground.tsx`, `TechnicalGrid.tsx`).
- **`constants/`** — Static configuration & data:
  - `tokens.ts` (`DRIVVIZE_TOKENS`, `SERVICE_ROUTES`, `PRIMARY_NAV_ROUTES` for the corporate shell/tokens).
  - `learnResources.ts` (`LEARN_RESOURCES` registry mapping `fileId`s to PDF metadata in `private_documents/download_pdf/`).
- **`hooks/`** — Shared client hooks (`useScrollReveal.ts`: `usePrefersReducedMotion`, `useScrollReveal`).
- **`lib/`** — Server/shared infrastructure:
  - `db/index.ts` (Neon HTTP + Drizzle client), `db/schema.ts` (Postgres tables & inferred types), `adminAuth.ts` (HMAC token signing/verification + cookie helpers), `mailer.ts` (Nodemailer pooled SMTP + PDF attachment email templates).
- **`private_documents/download_pdf/`** — Gated PDF publications (`Drivvize_ISO26262_SEooC_Training.pdf`, `Drivvize_V2X_Whitepaper.pdf`, `EU_CRA_An_Intro.pdf`). **Never move these to `public/`**; they are delivered strictly via email attachment through `/api/learn/download`.
- **`public/`** — Public static assets (`drivvize-logo.png`, `favicon.png`, `images/founders/*`, `images/home_img/*`, `images/logo/*`).
- **`Premium Automotive Safety Website/`** — Archived standalone Vite/Figma Make reference project. Excluded in `tsconfig.json` and `eslint.config.mjs`. **Never modify or import from this directory.**

---

## 3. Application Routes, APIs & Data Behavior

### Public Pages
- `/` (`app/page.tsx`) — Home landing page: `Nav`, `Hero`, `About`, `Band`, `Partner`, `Proof`, `Systems`, `Recognition`, `Founders`, `Footer`, and `UpcomingEventToast` (dismissible via `sessionStorage`).
- `/products`, `/services`, `/casestudies`, `/learn`, `/events`, `/contact`, `/scope-checker`, `/careers`, `/faqs` — Each `page.tsx` exports `Metadata` and renders its `*Client` component (`/events` wraps `EventsClient` in `<Suspense>`).
- `/blog` (`app/blog/page.tsx`) — Dynamic RSC (`await connection()`) querying published `blogs` from Neon Postgres and passing `initialBlogs` to `BlogListClient`, which merges DB posts with fallback starter `POSTS` (`components/learn/learn-data.ts`) deduplicated by `slug`.
- `/blog/[slug]` (`app/blog/[slug]/page.tsx`) — `generateMetadata` + DB lookup (increments `views` for published DB posts) with fallback to starter `POSTS`, calling `notFound()` if neither exists. Renders `ArticleContent` (custom markdown renderer) for DB articles or `Block[]` for starter articles.

### Public API Routes
- `POST /api/contact` & `GET /api/contact` (`app/api/contact/route.ts`) — Validates contact form fields, inserts into `contact_submissions`, optionally sends notification email via Nodemailer (`SMTP_USER`/`SMTP_PASS`/`CONTACT_RECEIVER_EMAIL`), and optionally fires `CONTACT_WEBHOOK_URL`.
- `POST /api/learn/download` & `GET /api/learn/download` (`app/api/learn/download/route.ts`) — Validates `email` and `fileId` against `LEARN_RESOURCES`, verifies file existence in `private_documents/download_pdf/`, inserts a lead row into `pdf_downloads`, and schedules `sendResourcePdfEmail` via Next.js `after()` without returning any direct file URL. *(Note: `components/learn/LearnClient.tsx` currently uses `learn-data.ts` `DOWNLOADS` with mailto/direct `item.file` fallback; any gated download UI tied to `LEARN_RESOURCES` should POST to `/api/learn/download`.)*
- `GET /api/blogs` & `GET /api/blogs/[slug]` — Public read endpoints for published blogs (`await connection()` on `GET /api/blogs`).
- `GET /api/neon` — Neon Lakebase Postgres connectivity and `contact_submissions` row-count health check.

### Admin Portal & Protected APIs
- **Routes:** `/admin/login`, `/admin` (dashboard), `/admin/blogs`, `/admin/blogs/new`, `/admin/blogs/[id]`, `/admin/inquiries`, `/admin/downloads`, `/admin/pages`.
- **Auth (`lib/adminAuth.ts`):** Uses `ADMIN_EMAIL` (default `admin@drivvize.com`), `ADMIN_PASSWORD` (default `admin123`), and `ADMIN_JWT_SECRET`. Issues a 7-day HMAC-SHA256 signed `httpOnly` cookie (`drivvize_admin_session`).
- **Behavior:** `app/admin/layout.tsx` verifies `/api/admin/auth/me` on mount (except `/admin/login`) and redirects unauthenticated users to `/admin/login`. **Every `/api/admin/*` route (except `auth/login` and `auth/logout`) MUST call `await getAdminSession()` and return HTTP `401` if null.**
- **Endpoints:**
  - `POST /api/admin/auth/login`, `POST /api/admin/auth/logout`, `GET /api/admin/auth/me`
  - `GET /api/admin/stats`
  - `GET, POST /api/admin/blogs` & `GET, PUT, DELETE /api/admin/blogs/[id]`
  - `GET /api/admin/inquiries` & `DELETE /api/admin/inquiries/[id]`
  - `GET /api/admin/downloads` & `DELETE /api/admin/downloads/[id]`

### Database Schema (`lib/db/schema.ts`)
- `contact_submissions`: `id`, `first_name`, `last_name`, `email`, `phone`, `company_name`, `message`, `created_at`
- `pdf_downloads`: `id`, `email`, `file_id`, `file_name`, `file_title`, `field`, `downloaded_at`
- `blogs`: `id`, `title`, `slug` (unique), `excerpt`, `content`, `cover_image`, `category`, `author`, `read_time`, `is_published`, `views`, `published_at`, `created_at`, `updated_at`

---

## 4. Engineering, Component & Dependency Rules

Adapted from `.antigravity/rules.md` to match this repository's structure:

1. **Component Reuse & File Size Discipline:**
   - Before creating any UI element, inspect `components/premium-home/`, `components/ui/`, and existing domain components. Reuse or compose existing components instead of duplicating logic.
   - Keep new or refactored components focused and ideally under **150–200 lines**; split large sections into sub-components or extract client state into custom hooks (`hooks/` or local `hooks.tsx`).
2. **Server Components by Default:**
   - Keep `page.tsx` and `layout.tsx` as **React Server Components (RSC)**—never add `'use client'` to `app/*/page.tsx` or `app/layout.tsx`.
   - Push `'use client'` down to the lowest interactive leaf component that uses hooks (`useState`, `useEffect`), browser APIs, or event handlers.
3. **TypeScript, Naming & Code Hygiene:**
   - Components: `PascalCase.tsx` | Hooks: `useCamelCase.ts` | Utilities/Data: `camelCase.ts` (existing `*-data.ts` kebab files should remain consistent within their folders).
   - Zero `any` types, zero commented-out dead code, and preserve existing comments/docstrings unrelated to your changes.
   - Extract shared helpers rather than duplicating code across components or API routes.
4. **Package & shadcn/ui Discipline:**
   - Never silently assume an unlisted package or shadcn/ui primitive is installed—check `package.json` and `components/ui/` first (note: Radix/shadcn CLI packages are not currently installed).
   - Only introduce external `npm` packages when React/Next.js/Tailwind or existing dependencies cannot cleanly solve the problem.
   - Whenever installing a new `npm` package or `shadcn` component is genuinely required, **explicitly tell the user**:
     1. The exact install command (`npm install <package>` or `npx shadcn@latest add <component>`).
     2. Why it is needed over existing dependencies.
     3. Which exact file(s) will import and wrap it (isolate third-party integrations inside `lib/` or dedicated wrapper components).
   - If using shadcn/ui primitives, customize their variants/classes directly inside `components/ui/<component>.tsx` instead of wrapping them in noisy inline overrides.
5. **Design System & Accessibility Consistency:**
   - Respect the CSS custom properties in `app/globals.css`: `ink` (`#0a1018`), `deep` (`#1d3f6e`), `brand` (`#4f81bd`), `sky` (`#9dbfe8`), `signal` (`#ffcc00`), `paper` (`#f5f6f8`), `line` (`#e3e6eb`), plus `drivvize-*` palette tokens.
   - Honor `prefers-reduced-motion` (supported in `app/globals.css` and `hooks/useScrollReveal.ts`).
   - Keep navigation arrays in sync when adding/updating routes: `NAV` in `components/premium-home/data.ts`, `Footer.tsx`, `SiteShell.tsx` (`isCustomShell`), `constants/tokens.ts` (if applicable), and `app/admin/pages/page.tsx`.

---

## 5. Technical SEO & Performance Rules

Every public page and component must uphold search visibility and Core Web Vitals:

- **Metadata API on Every Route:** Every public `app/*/page.tsx` must export a strongly typed `Metadata` object (or `generateMetadata`) with unique `title` and `description` (and `openGraph`/`twitter`/`alternates.canonical` where appropriate).
- **Semantic HTML5 Hierarchy:**
  - Strictly **one `<h1>` per page** (the primary value proposition or page headline).
  - Logical heading hierarchy (`h1` -> `h2` -> `h3`); never choose heading tags purely for visual font size (use Tailwind CSS classes for sizing).
  - Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` landmarks properly.
- **Structured Data (JSON-LD):** When adding or upgrading SEO schemas (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Service`, `Article`), place clean builders in `lib/schema.ts` and render via `<script type="application/ld+json">`.
- **Images & Links:**
  - Provide descriptive, keyword-relevant `alt` text for meaningful photos (empty `alt=""` only for purely decorative backgrounds).
  - Prefer `next/image` with explicit dimensions (or `fill` + sized parent) and `priority` for above-the-fold hero LCP images on new components (remember to configure `images.remotePatterns` in `next.config.ts` if using external URLs with `next/image`). Note that existing `components/premium-home/` animations (Ken Burns / parallax `Photo`) intentionally use `<img>` with `@next/next/no-img-element` disabled in `eslint.config.mjs`.
  - Always use `next/link` for internal routes with descriptive anchor text (never generic "Click here").
- **Crawlability:** Maintain `app/sitemap.ts` and `app/robots.ts` whenever adding or updating crawlable public routes (currently not yet created—add them when implementing full technical SEO).

---

## 6. Execution & Verification Workflow

1. **Plan First:** Before modifying code, identify the exact files to create/edit, whether `SiteShell.tsx` / `NAV` / `lib/db/schema.ts` / SEO metadata are affected, and whether any new packages are needed.
2. **Modular Delivery:** Implement cleanly separated Server Components, client leaves, shared data/types, and API handlers. Keep security boundaries strict (`getAdminSession()` on admin APIs, parameterized Drizzle queries, HTML escaping in emails).
3. **Verify Before Finishing:** Run `npm run lint` and `npm run build` (plus Drizzle checks if schema changed) after edits and ensure zero TypeScript, ESLint, or build regressions.
