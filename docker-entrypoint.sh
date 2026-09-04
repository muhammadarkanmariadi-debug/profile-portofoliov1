#!/bin/sh
set -e

echo "==> Checking database connection and schema..."

# Direct invocation of Prisma CLI bundled in node_modules
if [ -f "./node_modules/prisma/build/index.js" ]; then
  echo "==> Applying database schema migrations via Prisma CLI..."
  node ./node_modules/prisma/build/index.js db push --skip-generate || echo "==> [Warning] Prisma db push failed or DB unavailable, continuing startup..."
elif command -v prisma >/dev/null 2>&1; then
  echo "==> Applying database schema migrations via binary..."
  prisma db push --skip-generate || echo "==> [Warning] Prisma db push failed, continuing startup..."
else
  echo "==> Prisma CLI not found in local modules, skipping initial db push."
fi


echo "==> Starting Next.js server on port ${PORT:-5000}..."
exec node server.js
