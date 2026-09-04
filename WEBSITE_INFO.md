# 🌐 Muhammad Arkan Mariadi — Portfolio Website Documentation (`4RK4N.DEV`)

Comprehensive technical overview, route directory, design system specification, tech stack, database schemas, and architectural breakdown of the portfolio web application.

---

## 📑 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [Tech Stack & Dependencies](#-tech-stack--dependencies)
3. [Design System & Aesthetics](#-design-system--aesthetics)
4. [Page Directory & Route Architecture](#-page-directory--route-architecture)
5. [Key Components & Visual Features](#-key-components--visual-features)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Database Schema (Prisma ORM)](#-database-schema-prisma-orm)
8. [Internationalization (i18n) & Theme System](#-internationalization-i18n--theme-system)
9. [Automation & Background Syncing](#-automation--background-syncing)
10. [Deployment & Environment Configuration](#-deployment--environment-configuration)

---

## 📌 Executive Summary

* **Project Title:** Personal Developer Portfolio & CMS Dashboard
* **Brand / Identifier:** `4RK4N.DEV`
* **Target Profile:** **Muhammad Arkan Mariadi** — Junior Full-Stack Developer & Software Engineering Student at SMK Telkom Malang.
* **Core Value Proposition:** High-impact modern digital portfolio featuring interactive 3D WebGL physics, bilingual internationalization (`en` / `id`), responsive design, and a full-featured admin CMS dashboard for live content management and automated GitHub repository synchronization.

---

## 🛠 Tech Stack & Dependencies

### Core Framework & Runtime
* **Framework:** [Next.js 16.1.0](https://nextjs.org/) (App Router, Server-Side Rendering & Server Actions)
* **UI Library:** [React 19.2.3](https://react.dev/)
* **Language:** [TypeScript 5](https://www.typescriptlang.org/)
* **Node Environment:** Node.js v20+ / Node-cron runner

### Styling & UI Design
* **CSS Engine:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
* **Typography:**
  * **Headings:** *Plus Jakarta Sans* (`--font-plus-jakarta`)
  * **Body / Interface:** *Inter* (`--font-inter`)
  * **Code / Badges / Accents:** *Geist Mono* (`--font-geist-mono`)
* **Animation & CSS Utilities:** `tw-animate-css`, `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
* **Iconography:** [Lucide React](https://lucide.dev/) (`lucide-react`)

### 3D Graphics, WebGL, Motion & Smooth Scroll
* **3D Engine:** [Three.js](https://threejs.org/) (`three`)
* **React 3D Bridge:** `@react-three/fiber` & `@react-three/drei`
* **Physics Engine:** `@react-three/rapier` (Simulates dynamic 3D lanyard ID card with rigid-body joints)
* **Motion Engine:** [GSAP 3](https://gsap.com/) (`gsap` v3.14.2, `@gsap/react` v2.1.2)
  * ScrollTrigger, Flip plugin, MatchMedia responsive / reduced-motion checks, sticky card stacking, and hardware-accelerated transforms.
* **Smooth Scrolling:** [Lenis](https://lenis.darkroom.engineering/) (`lenis` v1.3.26) synchronized directly with the GSAP ticker (`lagSmoothing(0)`).
* **Fluid Dynamics:** [OGL](https://github.com/oframe/ogl) (WebGL-based fluid cursor splash simulation)
* **Canvas Line Renderer:** `meshline`

### Database, ORM & In-Memory Caching
* **ORM:** [Prisma ORM 7.8.0](https://www.prisma.io/)
* **Database Drivers / Adapters:** PostgreSQL (`pg`, `@prisma/adapter-pg`) / MariaDB (`mariadb`, `@prisma/adapter-mariadb`)
* **In-Memory Cache:** [Redis 7](https://redis.io/) (`ioredis`) with resilient graceful fallback, query caching, and automated mutation invalidation (`invalidateProjectsCache`).
* **Data Seed & Migration:** TypeScript CLI Runner (`tsx`)

### Authentication & Forms
* **Auth & Security:** `jose` (JWT session tokens stored in HttpOnly cookies), `bcryptjs` (Password hashing)
* **Form Handling:** `react-hook-form`
* **Schema Validation:** `zod` (`@hookform/resolvers`)

### Cloud Services, Automation & Containerization
* **Cloud Asset Storage:** Cloudinary (`cloudinary`) for portfolio images and certificate uploads
* **Email Notification:** `nodemailer` for contact form dispatching
* **PDF Processing:** `@react-pdf/renderer` & `react-pdf` for live CV preview/download
* **Cron Scheduling:** `node-cron` for automated GitHub synchronization
* **Containerization:** Docker & Docker Compose (Multi-stage build with `postgres:16-alpine`, `redis:7-alpine`, and Next.js standalone runner)

---

## 🎨 Design System & Aesthetics

The design embraces a **Cyber-Minimalist / Modern Glassmorphic** aesthetic with glowing neon accents and responsive light/dark adaptations.

### Color Palette

| Token | Dark Mode (Default) | Light Mode | Description |
| :--- | :--- | :--- | :--- |
| **`--background`** | `#0B0B12` (Deep Void) | `#F8F9FA` (Soft Off-White) | Root canvas background |
| **`--surface`** | `#14141F` (Charcoal Slate) | `#FFFFFF` (Pure White) | Card & navigation surfaces |
| **`--primary`** | `#6C63FF` (Electric Indigo) | `#5B4FE8` (Deep Iris) | Primary action & brand highlight |
| **`--secondary`** | `#00D9C0` (Cyber Teal/Mint) | `#00A896` (Persian Green) | Status badges & accents |
| **`--text-primary`** | `#F5F5F7` (Bright Snow) | `#1F2937` (Dark Charcoal) | Headings & dominant text |
| **`--text-muted`** | `#9A9AB0` (Cool Grey) | `#6B7280` (Muted Slate) | Secondary descriptions & meta |
| **`--border`** | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.10)` | Subtle border separation |

### Visual Design Patterns
1. **Glassmorphism (`.glass-card`):** Translucent backdrop blur (`backdrop-filter: blur(12px)`) with glowing hover borders (`--glass-hover-border`).
2. **Radial Grid Texture (`.grid-texture`):** Minimalist dot grid backdrop overlay.
3. **Text Glow Effect (`.text-glow`):** Neon diffuse drop-shadow applied to key brand typography.
4. **Target Cursor (`TargetCursor.tsx`):** Custom high-precision crosshair that smoothly tracks and snaps to interactive targets.
5. **Interactive 3D Lanyard (`Lanyard.tsx`):** Realtime physics simulation where the user can grab, fling, and inspect a personalized ID badge.

---

## 📂 Page Directory & Route Architecture

```
app/
├── (public)
│   ├── page.tsx                    # Landing Page (Hero, About, Projects, Skills, Certificates)
│   ├── layout.tsx                  # Root Layout (Fonts, Global Nav, Custom Cursor, Footer, Providers)
│   ├── providers.tsx               # Context Providers (ThemeContext & LanguageContext)
│   ├── globals.css                 # Global CSS rules, theme variables & utility classes
│   ├── projects/
│   │   ├── page.tsx                # Projects Archive Server Page
│   │   └── ProjectsClient.tsx      # Filterable & searchable projects grid with detail modals
│   ├── achievements/
│   │   ├── page.tsx                # Certificates & Awards Archive Server Page
│   │   └── AchievementsClient.tsx  # Searchable certificate gallery with preview overlays
│   └── contact/
│       ├── page.tsx                # Contact Server Page
│       └── ContactClient.tsx       # Interactive contact form & social connection channels
├── admin/
│   ├── layout.tsx                  # Admin Layout (Sidebar navigation & auth wrapper)
│   ├── page.tsx                    # Admin Dashboard (Analytics summary & metrics)
│   ├── login/
│   │   └── page.tsx                # Admin Authentication Portal
│   ├── profile/
│   │   └── page.tsx                # Biography, social links & CV manager
│   ├── projects/
│   │   ├── page.tsx                # Project management & GitHub sync interface
│   │   ├── create/page.tsx         # New project creation form
│   │   └── edit/[id]/page.tsx      # Project edit form
│   ├── skills/
│   │   └── page.tsx                # Skills matrix CRUD manager
│   ├── achievements/
│   │   └── page.tsx                # Certificates and awards CRUD manager
│   ├── timeline/
│   │   └── page.tsx                # Education & Experience timeline manager
│   └── messages/
│       └── page.tsx                # Inbound visitor inquiries reader & manager
└── api/
    ├── auth/
    │   ├── login/route.ts          # POST /api/auth/login
    │   ├── logout/route.ts         # POST /api/auth/logout
    │   └── me/route.ts             # GET /api/auth/me
    ├── contact/
    │   └── route.ts                # POST /api/contact
    ├── admin/
    │   ├── stats/route.ts          # GET /api/admin/stats
    │   ├── profile/route.ts        # GET, PUT /api/admin/profile
    │   ├── projects/route.ts       # GET, POST, PUT, DELETE /api/admin/projects
    │   ├── skills/route.ts         # GET, POST, PUT, DELETE /api/admin/skills
    │   ├── achievements/route.ts   # GET, POST, PUT, DELETE /api/admin/achievements
    │   ├── timeline/route.ts       # GET, POST, PUT, DELETE /api/admin/timeline
    │   ├── messages/route.ts       # GET, PUT, DELETE /api/admin/messages
    │   └── upload/route.ts         # POST /api/admin/upload (Cloudinary gateway)
    └── sync/
        └── repos/route.ts          # POST /api/sync/repos (GitHub API sync)
```

---

## 🧩 Key Components & Visual Features

### Public UI Components (`app/components/` & `components/`)
* **`Navbar.tsx`**: Floating pill navigation bar with active route detection, language switcher (`EN`/`ID`), theme toggle (Dark/Light), and responsive slide-out mobile drawer.
* **`Hero.tsx`**: High-impact header section incorporating availability pulse indicator, bilingual biography teaser, CV download link, direct social hubs, and the 3D WebGL Lanyard.
* **`Aboutme.tsx`**: Interactive biography breakdown featuring career principles (*Precision, Scalability, Aesthetics*) and dual-column Education & Experience vertical timelines.
* **`Projects.tsx` & `ProjectCard.tsx`**: Showcases selected enterprise & open-source projects with hover effects and role indicators.
* **`ProjectModal.tsx`**: Detailed modal showcasing project screenshots, tech stack chips, direct live links, and full markdown README rendering.
* **`Skills.tsx` & `SkillsCard.tsx`**: Categorized technical skills matrix covering Frontend, Backend, Database/ORM, Cloud/DevOps, OS, and interpersonal competencies.
* **`Achievements.tsx` & `AchievementCard.tsx`**: Interactive credential carousel displaying certifications with issuance dates and verification preview.
* **`Footer.tsx`**: Global footer featuring quick links, contact channels, location details, and copyright information.

### Advanced Animation Components
* **`Lanyard.tsx`**: Three.js + Rapier physics simulation rendering a 3D cloth band and credential card that reacts to mouse dragging and physics gravity.
* **`SplashCursor.tsx`**: High-performance WebGL fluid canvas creating colorful fluid ripples behind user pointer motion.
* **`Particles.tsx` / `ThemeParticles.tsx`**: Dynamic particle mesh background responsive to mouse movement.
* **`TargetCursor.tsx`**: Custom canvas cursor tracking hover targets (`.cursor-target`, buttons, links).
* **`ScrambleText.tsx`**: Cyberpunk-style text decoding animation on page load.
* **`RotatingText.tsx` / `TrueFocus.tsx` / `TiltedCard.tsx`**: Micro-interaction motion components for cards and headlines.

### Admin Dashboard Components (`app/components/admin/`)
* **`Sidebar.tsx`**: Collapsible dashboard sidebar with route indicators and badge counts for unread messages.
* **`ProjectForm.tsx`**: Form supporting multi-language fields, dynamic skill selector, GitHub repository link, and Cloudinary media uploader.
* **`SkillForm.tsx`**: Skill entity creation with category assignment and icon picker.
* **`AchievementForm.tsx`**: Certificate creation form with date picker and image upload.
* **`TimelineForm.tsx`**: Experience and Education milestone editor with ordering controls.
* **`FileUpload.tsx`**: Drag-and-drop file uploader integrated with Cloudinary REST API.

---

## ⚡ API Endpoints Reference

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin credentials and returns HttpOnly JWT cookie |
| `POST` | `/api/auth/logout` | Admin | Clears session cookie |
| `GET` | `/api/auth/me` | Public/Admin | Validates active session token |
| `POST` | `/api/contact` | Public | Validates visitor inquiry, stores in DB, and dispatches email notification |
| `GET` | `/api/admin/stats` | Admin | Fetches counts of projects, skills, achievements, and unread messages |
| `GET / PUT` | `/api/admin/profile` | Admin | Retrieves or updates biography, contact details, social links, and CV URL |
| `GET / POST` | `/api/admin/projects` | Admin | Lists all projects or creates a new project |
| `PUT / DELETE`| `/api/admin/projects/[id]`| Admin | Updates or removes a project record |
| `GET / POST` | `/api/admin/skills` | Admin | Lists or creates skills |
| `PUT / DELETE`| `/api/admin/skills/[id]` | Admin | Modifies or deletes skill items |
| `GET / POST` | `/api/admin/achievements` | Admin | Lists or registers new certificates |
| `PUT / DELETE`| `/api/admin/achievements/[id]` | Admin | Updates or deletes certificates |
| `GET / POST` | `/api/admin/timeline` | Admin | Manages Education & Experience timeline milestones |
| `GET / PUT / DELETE`| `/api/admin/messages` | Admin | Fetches inquiries, marks as read, or deletes messages |
| `POST` | `/api/admin/upload` | Admin | Uploads image assets or documents to Cloudinary |
| `POST` | `/api/sync/repos` | Admin | Syncs public repositories and READMEs from GitHub API |

---

## 🗄 Database Schema (Prisma ORM)

### Key Models & Relationships

```mermaid
erDiagram
    Profile {
        String id PK
        String phone
        String email
        String address
        String linkedinUrl
        String instagramUrl
        String githubUrl
        String twitterUrl
        String lanyardImageUrl
        String shortDescriptionEn
        String shortDescriptionId
        String fullBiographyEn
        String fullBiographyId
        String cvFileUrl
    }
    TimelineEntry {
        String id PK
        TimelineType type
        String categoryEn
        String categoryId
        String titleEn
        String titleId
        String descriptionEn
        String descriptionId
        Int order
    }
    Skill {
        String id PK
        SkillCategory category
        String title
        String logoUrl
        Int order
    }
    Project {
        String id PK
        String categoryEn
        String categoryId
        String titleEn
        String titleId
        String descriptionEn
        String descriptionId
        String roleEn
        String roleId
        Boolean isDeploy
        String liveUrl
        String sourceCodeUrl
        String imageUrl
        Int order
        Int githubId
        String githubFullName
        String readmeContent
        String primaryLanguage
        Int starsCount
        Boolean isFork
        Boolean isArchived
        DateTime pushedAt
        DateTime lastSyncedAt
        String syncSource
    }
    Achievement {
        String id PK
        String titleEn
        String titleId
        String statusEn
        String statusId
        String descriptionEn
        String descriptionId
        DateTime date
        String imageUrl
        Int order
    }
    ContactMessage {
        String id PK
        String name
        String email
        String message
        Boolean isRead
        DateTime createdAt
    }
    SyncLog {
        String id PK
        DateTime startedAt
        DateTime finishedAt
        String status
        Int reposSynced
        String errorMessage
    }

    Project }|--|{ Skill : "ProjectSkills"
```

### Enumerations:
* **`TimelineType`**: `EDUCATION`, `EXPERIENCE`
* **`SkillCategory`**: `FRONTEND`, `BACKEND`, `DATABASE_ORM`, `BAHASA_LAINNYA`, `VERSION_CONTROL`, `CLOUD_DEPLOYMENT`, `DESIGN_PROTOTYPING`, `SISTEM_OPERASI`

---

## 🌐 Internationalization (i18n) & Theme System

### Multi-Language Implementation (`lib/i18n.ts` & `app/providers.tsx`)
* **Languages Supported:** English (`en`) & Indonesian (`id`).
* **Storage & Context:** Client state persists in localStorage, synchronized across components via `LanguageContext`.
* **Database Dual-Field Architecture:** Dynamic entities store localized copies:
  * Short Biography: `shortDescriptionEn` / `shortDescriptionId`
  * Full Biography: `fullBiographyEn` / `fullBiographyId`
  * Project Details: `titleEn` / `titleId`, `descriptionEn` / `descriptionId`, `roleEn` / `roleId`
  * Timeline & Milestones: `titleEn` / `titleId`, `categoryEn` / `categoryId`, `descriptionEn` / `descriptionId`
  * Certificates: `titleEn` / `titleId`, `statusEn` / `statusId`, `descriptionEn` / `descriptionId`

### Dark / Light Theme Engine
* Implemented using standard CSS class switching (`.dark` and `.light` root classes).
* Auto-adjusts background colors, typography contrast, glassmorphism translucency, and particle canvas visibility.

---

## 🤖 Automation & Background Syncing

1. **GitHub Repository Sync Engine (`lib/services/github-sync.service.ts` & `lib/github.ts`):**
   * Connects to GitHub REST API using personal access tokens.
   * Auto-fetches public repositories, star counts, primary languages, commit activity timestamps, and raw `README.md` contents.
   * Updates existing project records or provisions new entries with `syncSource: "github"`.
   * Logs execution status and error telemetry in `SyncLog`.
2. **Automated Scheduler (`scripts/scheduler.ts`):**
   * Uses `node-cron` to execute periodic repository syncing and keep portfolio projects updated with real-time GitHub stats.

---

## 🚀 Deployment & Environment Configuration

### Required Environment Variables (`.env.local` / `.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Admin Authentication
ADMIN_EMAIL="admin@4rk4n.dev"
ADMIN_PASSWORD="hashed_or_plain_password"
JWT_SECRET="super_secure_jwt_secret_key"

# GitHub API Integration
GITHUB_USERNAME="muhammadarkanmariadi"
GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Nodemailer Contact Dispatcher
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
NOTIFICATION_RECEIVER_EMAIL="your-destination-email@gmail.com"
```

### Build & Run Scripts
* `npm run dev`: Starts Next.js development server on `http://localhost:3000`.
* `npm run build`: Generates Prisma client bindings (`prisma generate`) and compiles the production bundle (`next build`).
* `npm run start`: Boots production HTTP server.
* `npm run lint`: Runs ESLint validation.
* `npx prisma db seed`: Executes `prisma/seed.ts` to populate default profile, projects, skills, and timeline records.

---
*Documentation compiled and generated for 4RK4N.DEV.*
