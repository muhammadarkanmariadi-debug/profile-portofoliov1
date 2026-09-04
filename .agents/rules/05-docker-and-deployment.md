# Docker & Deployment Rules

## 1. Multi-Stage Dockerfile Architecture (`Dockerfile`)

* **Stage 1 (base)**: `node:22-alpine` with `libc6-compat` and `openssl`.
* **Stage 2 (deps)**: Installs npm packages (`npm ci`) and Prisma schema generation.
* **Stage 3 (builder)**: Runs `npx prisma generate` and `npm run build` (Turbopack standalone output in `.next/standalone`).
* **Stage 4 (runner)**: Minimal non-root production container running under user `nextjs:nodejs` (UID 1001) executing `docker-entrypoint.sh`.

## 2. Docker Compose Service Topology (`docker-compose.yml`)

* **Services**:
  1. **`postgres`** (`postgres:16-alpine`):
     * Container: `profile_postgres`
     * Port: `127.0.0.1:5432:5432`
     * Volume: `postgres_data:/var/lib/postgresql/data`
     * Healthcheck: `pg_isready`
  2. **`redis`** (`redis:7-alpine`):
     * Container: `profile_redis`
     * Port: `127.0.0.1:6379:6379`
     * Volume: `redis_data:/data`
     * Command: `redis-server --appendonly yes --requirepass "${REDIS_PASSWORD}"`
     * Healthcheck: `redis-cli ping`
  3. **`app`** (Next.js Application):
     * Container: `profile_web_app`
     * Port: `5000:5000`
     * Depends on: `postgres` (healthy), `redis` (healthy)
     * Network: `profile_network` (bridge network)

## 3. Deployment & Environment Workflow

* **Template**: `.env.docker.example` provides the baseline for EC2 production deployment.
* **Database Migration on Boot**: `docker-entrypoint.sh` automatically executes `npx prisma db push` before launching the Next.js server (`server.js`).
* **Zero Downtime Updates**:
  ```bash
  git pull origin main
  docker compose up -d --build app
  ```
