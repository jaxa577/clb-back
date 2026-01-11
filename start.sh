#!/bin/sh
set -e

echo "=== Starting application ==="
echo "Node version: $(node --version)"
echo "Current directory: $(pwd)"
echo "Checking dist folder..."
ls -la dist/
ls -la dist/src/ | head -10

echo "=== Running Prisma migrations ==="
npx prisma migrate deploy

echo "=== Starting Node.js application ==="
exec node dist/src/main.js
