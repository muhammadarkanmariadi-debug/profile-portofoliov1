# 💻 Local Development & Setup Guide

This document covers the local development environment setup, environment configuration, database seeding, and development workflow for **`4RK4N.DEV`**.

---

## 🚀 1. Quick Start

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10+ (or compatible package manager)
- **PostgreSQL**: Local instance or Docker container (optional if using mock data)
- **Redis**: Local instance or Docker container (optional, system will gracefully fall back if absent)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/muhammadarkanmariadi-debug/profile-portofoliov1.git
cd profile

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Generate Prisma Client
npx prisma generate

# 5. Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 2. Environment Variables Checklist

Configure the following in your `.env.local` (local development) or `.env` (production):

| Variable | Default / Example | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/profile_db?schema=public` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis in-memory cache connection URL |
| `REDIS_CACHE_TTL` | `3600` | Redis cache TTL in seconds (1 hour) |
| `ADMIN_EMAIL` | `arkan@gmail.com` | Administrator login email |
| `ADMIN_PASSWORD_HASH` | `$2a$12$...` | Bcrypt hash for admin password |
| `JWT_SECRET` | `your_jwt_secret_key` | Secret for signing JWT authentication tokens |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary asset uploads |
| `CLOUDINARY_API_KEY` | `your_api_key` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary API Secret |
| `EMAIL_USER` | `your_email@gmail.com` | Nodemailer sender email |
| `EMAIL_PASS` | `your_gmail_app_password` | Nodemailer sender app password |
| `GITHUB_USERNAME` | `your_github_username` | Target GitHub username for repo ingestion |
| `GITHUB_TOKEN` | `ghp_...` | GitHub Personal Access Token |
| `CRON_SECRET` | `your_cron_secret` | Security token for cron API triggers |

---

## 📜 3. Available npm Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Launches local development server with Turbopack |
| `npm run build` | `prisma generate && next build` | Compiles Prisma client and generates optimized Next.js production build |
| `npm run start` | `next start` | Runs the production Next.js server |
| `npm run lint` | `eslint` | Runs ESLint syntax and code quality checks |

---

## 🗄 4. Database Setup & Seeding

```bash
# Push Prisma schema to your PostgreSQL database
npx prisma db push

# Seed sample data (Projects, Skills, Profile, Credentials)
npx prisma db seed
```

---

## 🐳 5. Running with Docker Compose Locally

If you want to run the full stack (PostgreSQL + Redis + Next.js) inside Docker:

```bash
# Copy Docker environment template
cp .env.docker.example .env

# Build and start all 3 containers
docker compose up -d --build

# View container logs
docker compose logs -f
```

The web application will be accessible at [http://localhost:5000](http://localhost:5000).
