# Deployment Guide

## Overview

This guide explains how to deploy the SNG LoadBoard backend in production using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- PostgreSQL (handled by Docker)
- MinIO (handled by Docker)

## Environment Configuration

### 1. Create Production Environment File

Copy the example environment file and update with production values:

```bash
cp .env.example .env.production
```

### 2. Update Environment Variables

Edit `.env.production` and change the following **CRITICAL** values:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:STRONG_PASSWORD@postgres:5432/sng_loadboard?schema=public"

# JWT Configuration - MUST CHANGE IN PRODUCTION
JWT_SECRET="generate-a-strong-random-secret-here"
JWT_REFRESH_SECRET="generate-another-strong-random-secret-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="production"
PORT=3001
CORS_ORIGIN="https://your-production-domain.com"

# MinIO Configuration
MINIO_ENDPOINT="minio"
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY="generate-random-access-key"
MINIO_SECRET_KEY="generate-random-secret-key"
MINIO_BUCKET="sng-loadboard"
```

**Security Notes:**
- Generate strong random secrets for JWT_SECRET and JWT_REFRESH_SECRET
- Use a strong database password
- Change MinIO credentials from defaults
- Update CORS_ORIGIN to your actual frontend domain

## Deployment Methods

### Method 1: Docker Compose (Recommended)

This method runs the entire stack (database, MinIO, and backend) using Docker Compose.

#### Step 1: Build and Start Services

```bash
# Using the production docker-compose file
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Step 2: Run Database Migrations

```bash
docker exec sng-loadboard-backend npx prisma migrate deploy
```

#### Step 3: Verify Services

```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker logs sng-loadboard-backend

# Test API health endpoint
curl http://localhost:3001/api/v1/health
```

### Method 2: Development with Docker Compose

For development, use the standard docker-compose.yml (only database and MinIO):

```bash
# Start database and MinIO only
docker-compose up -d

# Run backend locally
npm run start:dev
```

### Method 3: Manual Docker Build

If you want to build and run the Docker image manually:

```bash
# Build the image
docker build -t sng-loadboard-backend:latest .

# Run with environment variables
docker run -d \
  --name sng-loadboard-backend \
  --env-file .env.production \
  -p 3001:3001 \
  sng-loadboard-backend:latest
```

## Common Issues and Solutions

### Issue: JWT Strategy Error - "JwtStrategy requires a secret or key"

**Cause:** Environment variables not passed to the container.

**Solution:** Ensure you're using `.env.production` file or passing environment variables correctly:

```bash
# Check if environment variables are set in container
docker exec sng-loadboard-backend env | grep JWT_SECRET
```

If empty, the container isn't receiving the environment variables. Make sure:
1. `.env.production` file exists
2. Using `docker-compose -f docker-compose.prod.yml` (not just `docker-compose`)
3. Environment variables are properly formatted (no extra spaces)

### Issue: OpenSSL Library Missing (Alpine Linux)

**Cause:** Prisma requires OpenSSL, which isn't included in Alpine base images.

**Solution:** The Dockerfile now uses `node:20-slim` (Debian-based) instead of Alpine. If you need Alpine, install OpenSSL:
```dockerfile
RUN apk add --no-cache openssl
```

Note: Prisma requires OpenSSL 1.1.x or 3.x. Alpine 3.17+ includes OpenSSL 3.

### Issue: Database Connection Failed

**Cause:** Database not ready or wrong connection string.

**Solution:**
1. Check if PostgreSQL container is running and healthy:
   ```bash
   docker ps | grep postgres
   ```

2. Verify DATABASE_URL in container:
   ```bash
   docker exec sng-loadboard-backend env | grep DATABASE_URL
   ```

3. When running backend in Docker, use `postgres` as hostname (not `localhost`):
   ```env
   DATABASE_URL="postgresql://postgres:password@postgres:5432/sng_loadboard"
   ```

### Issue: CORS Errors in Production

**Cause:** CORS_ORIGIN not set to frontend domain.

**Solution:** Update CORS_ORIGIN in `.env.production`:
```env
CORS_ORIGIN="https://your-frontend-domain.com"
```

## Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Backend only
docker logs -f sng-loadboard-backend

# Last 100 lines
docker logs --tail 100 sng-loadboard-backend
```

### Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run new migrations if any
docker exec sng-loadboard-backend npx prisma migrate deploy
```

### Database Backup

```bash
# Create backup
docker exec sng-loadboard-postgres pg_dump -U postgres sng_loadboard > backup.sql

# Restore backup
docker exec -i sng-loadboard-postgres psql -U postgres sng_loadboard < backup.sql
```

## Monitoring

### Health Checks

The application includes health check endpoints:

- **API Health:** `http://localhost:3001/api/v1/health`
- **Swagger Docs:** `http://localhost:3001/api/docs`

### Container Health Status

```bash
# Check container health
docker inspect sng-loadboard-backend | grep -A 10 Health
```

## Security Recommendations

1. **Never commit `.env.production` to version control**
   - Add it to `.gitignore`

2. **Use strong secrets**
   - Generate with: `openssl rand -base64 32`

3. **Enable HTTPS in production**
   - Use a reverse proxy (nginx, Caddy, Traefik)

4. **Regular updates**
   - Keep Docker images updated
   - Update dependencies regularly

5. **Database security**
   - Use strong passwords
   - Don't expose PostgreSQL port externally in production

6. **MinIO security**
   - Change default credentials
   - Consider using SSL in production

## Production Checklist

- [ ] Created `.env.production` with production values
- [ ] Changed all default passwords and secrets
- [ ] Updated CORS_ORIGIN to production domain
- [ ] Set NODE_ENV to "production"
- [ ] Configured HTTPS/SSL
- [ ] Set up database backups
- [ ] Configured monitoring/logging
- [ ] Tested all API endpoints
- [ ] Verified health checks are working
- [ ] Documented any custom configuration

## Support

For issues related to:
- **Build errors:** Check the build logs with `docker-compose logs backend`
- **Runtime errors:** Check application logs with `docker logs sng-loadboard-backend`
- **Database issues:** Check PostgreSQL logs with `docker logs sng-loadboard-postgres`
