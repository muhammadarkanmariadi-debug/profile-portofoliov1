# 🤖 AGENTS.md — Project Knowledge & AI Assistant Directives

Welcome to **`4RK4N.DEV`** (Muhammad Arkan Mariadi's Developer Portfolio & Headless CMS). This document is the primary knowledge base and behavioral guide for AI coding assistants working in this repository.

---

## 📌 1. Project Overview & Identity

* **Brand Identifier:** `4RK4N.DEV`
* **Author / Profile:** **Muhammad Arkan Mariadi** — Full-Stack Developer & Software Engineering Student at SMK Telkom Malang.
* **Purpose:** High-performance, Awwwards-grade digital portfolio featuring 3D WebGL physics, smooth kinetic typography, bilingual internationalization (`en` / `id`), and an integrated Admin CMS dashboard with automated GitHub synchronization.
* **Core Philosophy:** Rich digital aesthetics, micro-interactions, 60/120fps hardware-accelerated animations, resilient caching, and production stability.

---

## 🛠 2. Technology Stack & Key Dependencies

| Domain | Technology / Library | Role & Notes |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.1.0** (Turbopack) | App Router, Server Components, Server Actions, API Route handlers. |
| **UI Library** | **React 19.2.3** | Component hierarchy with strict client/server boundaries. |
| **Styling** | **Tailwind CSS v4** (`@tailwindcss/postcss`) | CSS variables-based tokens, `@theme`, minimal utilities. |
| **Database & ORM** | **Prisma ORM 7.8.0** (`pg`, `@prisma/adapter-pg`) | Native connection pool with PostgreSQL 16. |
| **Caching Layer** | **Redis 7** (`ioredis`) | In-memory query caching with graceful fallback. |
| **Motion Engine** | **GSAP 3** (`gsap`, `@gsap/react`) | Timelines, ScrollTrigger, Flip, MatchMedia. |
| **Smooth Scroll** | **Lenis 1.3.26** (`lenis`) | Synchronized directly with GSAP ticker (`lagSmoothing(0)`). |
| **3D & Physics** | **Three.js**, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier` | Interactive 3D Torus Knot & dynamic physics lanyard badge. |
| **Authentication** | `jose` (JWT in HttpOnly cookie), `bcryptjs` | Admin dashboard authentication. |
| **Media & Assets** | Cloudinary (`cloudinary`) | Image uploads for projects, skills, credentials. |
| **Automation** | `node-cron`, GitHub REST API (`@octokit` / native fetch) | Periodic repo sync and sync logging. |

---

## 📂 3. Directory Map & Critical Files

```
├── app/
│   ├── page.tsx                           # Landing page (Server Component: Hero, About, Projects, Skills, Achievements, Contact)
│   ├── layout.tsx                         # Root layout (Fonts, SmoothScrollProvider, Custom Cursor, Language & Theme Providers)
│   ├── providers.tsx                      # Context providers (Theme, Language, CursorTarget)
│   ├── globals.css                        # Tailwind v4 theme variables, glassmorphism, typography
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx       # Lenis + GSAP Ticker & route change refresh bridge
│   ├── components/
│   │   ├── Hero.tsx                       # Hero typography + GSAP matchMedia parallax scrub
│   │   ├── Aboutme.tsx                    # Progressive word illumination + timeline scrub
│   │   ├── Projects.tsx                   # Work showcase section
│   │   ├── ProjectCard.tsx                # Sticky stacking card + internal browser screenshot parallax
│   │   ├── Skills.tsx                     # Tech stack ticker + GSAP Flip/stagger tab switches
│   │   ├── AchievementsStrip.tsx          # Credentials batch reveals & velocity skewing
│   │   ├── ContactCTA.tsx                 # Magnetic email CTA + watermark parallax
│   │   └── ProjectModal.tsx               # Quick-view modal with data-lenis-prevent
│   ├── projects/
│   │   ├── page.tsx                       # Projects archive Server Component (calls getProjects())
│   │   ├── ProjectsClient.tsx             # Interactive filter, search & pagination client component
│   │   └── [slug]/page.tsx                # Project case study detail page
│   ├── achievements/
│   │   ├── page.tsx                       # Credentials archive Server Component
│   │   └── AchievementsClient.tsx         # Verified credentials grid & lightbox
│   ├── admin/                             # Protected CMS dashboard routes (/admin/*)
│   └── api/
│       ├── admin/projects/                # Admin project CRUD (POST, PUT, DELETE with Redis invalidation)
│       ├── public/projects/               # Public projects API (cached)
│       └── sync/repos/                    # Manual and cron GitHub repo sync
├── components/
│   ├── ChromeTorus.tsx                    # Three.js Torus Knot linked to GSAP ScrollTrigger
│   └── ui/
│       ├── smooth-cursor.tsx              # Hardware-accelerated cursor follower via gsap.quickTo()
│       └── ThemeToggle.tsx                # Dark / Light theme toggle switch
├── lib/
│   ├── prisma.ts                          # Native PostgreSQL connection pool & PrismaClient singleton
│   ├── redis.ts                           # Singleton ioredis client with graceful fallback & helper methods
│   ├── services/
│   │   ├── project.service.ts             # Projects query cache (Redis) & invalidation methods
│   │   ├── skill.service.ts               # Skills database service
│   │   ├── achievement.service.ts         # Credentials database service
│   │   ├── profile.service.ts             # Bio & metadata service
│   │   └── github-sync.service.ts         # Ingestion from GitHub API with cache purge
│   └── validations/                       # Zod validation schemas for forms and API payloads
├── prisma/
│   ├── schema.prisma                      # Database models (Profile, Timeline, Skill, Project, Achievement, SyncLog)
│   └── seed.ts                            # Initial database seed script
├── docker-compose.yml                     # Multi-container setup (app, postgres:16, redis:7)
├── Dockerfile                             # Multi-stage standalone production build
└── .agents/
    ├── rules/                             # Specific domain rulebooks
    └── skills/                            # Official GSAP & Antigravity skills
```

---

## 🛡 4. Core Architecture Rules & Invariants

### A. GSAP & Motion Guidelines
1. **Always Use `@gsap/react` (`useGSAP`)**:
   - Scope every `useGSAP` hook with a container ref (`{ scope: containerRef }`).
   - Register plugins once at top-level (`gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)`).
   - Use `contextSafe` for event handlers created outside the hook lifecycle.
2. **Synchronize with Lenis**:
   - Never use native window scroll listeners or un-synced timers for scroll animations.
   - Lenis is wired in [SmoothScrollProvider.tsx](file:///e:/Project/OWN%20PROJECT/profile/app/providers/SmoothScrollProvider.tsx).
   - For internal scrollable containers (modals, lightboxes, code blocks), always attach the `data-lenis-prevent` attribute.
3. **Hardware Acceleration**:
   - Only animate `transform` properties (`x`, `y`, `scale`, `rotation`, `skewY`, `xPercent`, `yPercent`) and `opacity`/`autoAlpha`.
   - Never animate `top`, `left`, `width`, or `height` for scroll/interactive animations.
   - For mouse tracking / magnetics, always use `gsap.quickTo()` to avoid layout thrashing.
4. **Responsive & Reduced-Motion**:
   - Use `gsap.matchMedia()` for responsive animations (`isDesktop`, `isMobile`, `reduceMotion`).

### B. Redis Caching & Invalidation Guidelines
1. **Graceful Fallback**:
   - The Redis client in [lib/redis.ts](file:///e:/Project/OWN%20PROJECT/profile/lib/redis.ts) is resilient. If `REDIS_URL` is missing or Redis is offline, queries must seamlessly fall back to PostgreSQL without crashing or throwing errors.
2. **Cache Key Convention**:
   - Projects list: `projects:list:${limit ?? 'all'}`
   - Project detail: `projects:detail:${slugOrId}`
3. **Automated Mutation Invalidation**:
   - Whenever projects are created, updated, deleted, or synced from GitHub, always call `await invalidateProjectsCache(idOrSlug)` and invoke Next.js `revalidatePath('/')`, `revalidatePath('/projects')`, and `revalidatePath('/projects/[slug]')`.

### C. Client vs Server Components (Next.js 16)
1. Any file using `useRef`, `useState`, `useEffect`, `useGSAP`, or browser APIs MUST begin with `'use client'` at the very first line.
2. Keep data fetching in Server Components (`app/page.tsx`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`) and pass data as props to interactive Client Components.

---

## ⚡ 5. Standard Commands

```bash
# Run local dev server (Turbopack)
npm run dev

# Run production build (TypeScript + Next.js build)
npm run build

# Run database migration / schema push
npx prisma db push

# Run database seed
npx prisma db seed

# Run Docker Compose (PostgreSQL + Redis + Next.js App)
docker compose up -d --build
```
