# Architecture & Technology Stack Rules

## 1. Framework & Runtime Architecture

* **Next.js 16 (Turbopack)**:
  * Uses the **App Router** (`app/` directory).
  * Server Components are the default for page-level data fetching.
  * Interactive UI components (GSAP animations, state, event listeners, forms) must be marked with `'use client'`.
  * Dynamic parameters in Next.js 16 are Promises: `props: { params: Promise<{ slug: string }> }` — always await `params` before accessing fields.

## 2. Database & Connection Pooling

* **Prisma ORM 7.8 with PostgreSQL**:
  * Native PostgreSQL driver `pg` with `PrismaPg` adapter configured in `lib/prisma.ts`.
  * Connection pool limit is managed via `DATABASE_POOL_MAX` (default 10).
  * Global singleton pattern (`globalForPrisma`) is strictly maintained to prevent connection exhaustion during development hot module reloads.
  * In production Docker containers, database schema synchronization is handled via `npx prisma db push` inside `docker-entrypoint.sh`.

## 3. Data Flow & Service Layer

* **Service Encapsulation (`lib/services/`)**:
  * All database queries and external integrations must live in service files (`project.service.ts`, `skill.service.ts`, `achievement.service.ts`, `profile.service.ts`, `timeline.service.ts`, `github-sync.service.ts`).
  * API routes and Server Components should call service functions rather than directly calling `prisma.*` whenever caching or business logic applies.
  * Mock data fallbacks exist in services to ensure graceful rendering even during empty database states.

## 4. API & Validation Architecture

* **Validation with Zod (`lib/validations/`)**:
  * All incoming admin payloads must be parsed and validated with Zod schemas (`projectSchema`, `skillSchema`, `achievementSchema`, `profileSchema`).
  * API routes return consistent JSON response formats with appropriate HTTP status codes (200, 201, 400 for validation errors, 404 for missing entities, 500 for server errors).
