# Railway 500 Error Troubleshooting Guide

## Quick Diagnosis Steps

### 1. Check Railway Logs

```bash
# Install Railway CLI if not installed
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# View logs
railway logs
```

Or view logs in Railway Dashboard:
1. Go to https://railway.app
2. Select your project
3. Click on your backend service
4. Go to "Deployments" tab
5. Click on the latest deployment
6. View the logs

### 2. Common Causes of 500 Errors

#### Cause 1: Database Connection Issues

**Error in logs:**
```
PrismaClientInitializationError: Can't reach database server
```

**Solution:**
- Ensure Postgres plugin is added and connected
- Verify `DATABASE_URL` is automatically set by Railway
- DO NOT manually set `DATABASE_URL` if using Railway Postgres

**Check:**
```bash
railway run env | grep DATABASE_URL
```

#### Cause 2: Missing Environment Variables

**Error in logs:**
```
JwtStrategy requires a secret or key
```

**Solution:**
Set all required environment variables in Railway dashboard:
```
JWT_SECRET=Kgan34oEDYZ8EdBoXdCDezLNMeKdPBeggnUTVujYtl4Fbz9hCNP8mwZ9hseXOoee
JWT_REFRESH_SECRET=QfZItxTnxHP0iFxoFXTgioVNYTBewVGHJdnTskhTmaGH3NdNlUF578e4qIhluTOw
JWT_EXPIRES_IN=120m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://cis-load-board.netlify.app,http://localhost:3000
```

#### Cause 3: Prisma Migration Not Run

**Error in logs:**
```
Invalid `prisma.user.create()` invocation
Table 'User' does not exist
```

**Solution:**
Run migrations on Railway:
```bash
railway run npx prisma migrate deploy
```

Or add to start command in `railway.toml`:
```toml
[deploy]
startCommand = "npx prisma migrate deploy && npm run start:prod"
```

#### Cause 4: OpenSSL Missing (Less likely with our Debian image)

**Error in logs:**
```
Error loading shared library libssl.so
```

**Solution:**
Already fixed in our Dockerfile (using node:20-slim with OpenSSL).

#### Cause 5: Build Failure

**Error in logs:**
```
npm ERR! code ELIFECYCLE
```

**Solution:**
Check if build completed successfully. Verify `railway.toml` build command.

#### Cause 6: Port Configuration

**Error:**
App starts but Railway can't connect to it.

**Solution:**
Railway automatically sets `PORT` environment variable. Make sure your app listens on it:

In `src/main.ts`:
```typescript
await app.listen(configService.get('PORT') ?? 3000);
```

This is already correct in your code.

## Step-by-Step Troubleshooting

### Step 1: View Current Logs

In Railway dashboard, check the latest logs for error messages. Look for:
- Red error messages
- Stack traces
- "Error:", "Failed:", "Cannot", etc.

### Step 2: Check Environment Variables

In Railway dashboard → Your Service → Variables tab:

Required variables:
- [ ] `JWT_SECRET` - Set manually
- [ ] `JWT_REFRESH_SECRET` - Set manually
- [ ] `JWT_EXPIRES_IN` - Set manually
- [ ] `JWT_REFRESH_EXPIRES_IN` - Set manually
- [ ] `NODE_ENV=production` - Set manually
- [ ] `CORS_ORIGIN` - Set manually
- [ ] `DATABASE_URL` - Should be auto-set by Postgres plugin
- [ ] `PORT` - Auto-set by Railway (don't manually set)

### Step 3: Verify Database Connection

```bash
# Connect to database
railway run npx prisma studio

# Or check if tables exist
railway run npx prisma db pull
```

### Step 4: Run Migrations

```bash
railway run npx prisma migrate deploy
```

### Step 5: Check Build Logs

In Railway dashboard → Deployments → Click latest deployment → Build logs

Look for:
- ✅ "npm ci --legacy-peer-deps" - Should succeed
- ✅ "npx prisma generate" - Should succeed
- ✅ "npm run build" - Should succeed
- ❌ Any errors in build process

### Step 6: Test Specific Endpoint

After fixing, test the health endpoint first:

```bash
curl https://clb-back-production.up.railway.app/api/v1/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","service":"SNG LoadBoard Backend","version":"1.0.0"}
```

## Common Error Patterns

### Pattern 1: Immediate 500 on All Endpoints

**Cause:** App failed to start or middleware crash

**Check:**
1. View deployment logs
2. Look for startup errors
3. Check if "Nest application successfully started" appears in logs

### Pattern 2: 500 Only on Database Operations

**Cause:** Database connection or Prisma issues

**Check:**
1. Verify `DATABASE_URL` is set
2. Run migrations
3. Check Postgres service is running

### Pattern 3: 500 on Auth Endpoints

**Cause:** JWT configuration missing

**Check:**
1. Verify `JWT_SECRET` is set
2. Verify `JWT_REFRESH_SECRET` is set
3. Check if bcrypt is working (might need native dependencies)

## Debugging Commands

### View Full Environment
```bash
railway run env
```

### Test Database Connection
```bash
railway run npx prisma db execute --stdin <<< "SELECT 1;"
```

### View Recent Logs
```bash
railway logs --last 100
```

### Restart Service
```bash
railway up --detach
```

## Emergency Fixes

### Fix 1: Redeploy with Logs

1. Go to Railway dashboard
2. Go to your service
3. Click "Deployments"
4. Click "View Logs" on latest deployment
5. Share the error message for specific diagnosis

### Fix 2: Check Health Endpoint First

Before testing complex endpoints, ensure basic health check works:

```bash
curl https://clb-back-production.up.railway.app/api/v1/health
```

If this fails, the entire app is down.

### Fix 3: Verify Railway.toml

Ensure `railway.toml` exists and has:

```toml
[build]
builder = "nixpacks"
buildCommand = "npm ci --legacy-peer-deps && npx prisma generate && npm run build"

[deploy]
startCommand = "npx prisma migrate deploy && npm run start:prod"
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 10
healthcheckPath = "/api/v1/health"
healthcheckTimeout = 100
```

### Fix 4: Check Nixpacks Detection

Railway uses Nixpacks. Check if it detected Node.js correctly:

In build logs, look for:
```
Using Nixpacks
Detected: Node
```

## Get Specific Error Details

To help diagnose your exact issue, we need the Railway logs. Please:

1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Copy the **last 50-100 lines** of logs
6. Look for lines containing:
   - "ERROR"
   - "Error:"
   - Stack traces (lines starting with "at")
   - "Failed"
   - Any red text

## Quick Test Script

Save this as `test-railway.sh`:

```bash
#!/bin/bash

API_URL="https://clb-back-production.up.railway.app"

echo "Testing Railway Backend..."
echo ""

echo "1. Health Check:"
curl -s "$API_URL/api/v1/health" | jq .
echo ""

echo "2. API Root:"
curl -s "$API_URL/api/v1" | jq .
echo ""

echo "3. Swagger Docs (should return HTML):"
curl -s "$API_URL/api/docs" | head -n 5
echo ""

echo "4. Test Registration (will show error details):"
curl -s "$API_URL/api/v1/auth/register" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@test.com","password":"123123","role":"DRIVER","phone":"+1234567890"}' \
  | jq .
```

Run: `bash test-railway.sh`

## Most Likely Issue (Based on Your Error)

Given that you're getting 500 on register endpoint, the most likely causes are:

1. **Migrations not run** - Database tables don't exist
2. **Database not connected** - `DATABASE_URL` missing or wrong
3. **Prisma client not generated** - Build didn't generate Prisma client

## Immediate Action Items

**Do this NOW:**

```bash
# 1. Check if migrations ran
railway logs | grep "prisma migrate"

# 2. Run migrations manually
railway run npx prisma migrate deploy

# 3. Restart the service
railway up --detach

# 4. Test health endpoint
curl https://clb-back-production.up.railway.app/api/v1/health

# 5. View latest logs for errors
railway logs --last 50
```

After running these, share the output and we can pinpoint the exact issue!
