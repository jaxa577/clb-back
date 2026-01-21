#!/bin/sh
set -e

echo "=== Starting application ==="
echo "Node version: $(node --version)"
echo "Current directory: $(pwd)"
echo "Checking dist folder..."
ls -la dist/
ls -la dist/src/ | head -10

echo "=== Running Prisma migrations ==="
echo "Attempting migrate deploy..."
npx prisma migrate deploy || echo "Migrate deploy failed, trying db push..."

echo "=== Pushing schema to database ==="
npx prisma db push --accept-data-loss || echo "DB push completed with warnings"

echo "=== Seeding database ==="
node dist-seed.js || echo "Seeding failed or already seeded, continuing..."

echo "=== Starting Node.js application ==="
exec node dist/src/main.js
