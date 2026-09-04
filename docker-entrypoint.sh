#!/bin/sh
set -e

echo "==> Waiting for database to be ready..."

# Sync Prisma schema to PostgreSQL
echo "==> Applying database schema migrations..."
npx prisma db push --skip-generate

echo "==> Starting Next.js server on port ${PORT:-5000}..."
exec node server.js
