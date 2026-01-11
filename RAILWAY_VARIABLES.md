# Railway Environment Variables Configuration

## Your Railway Database Info

Railway Postgres provides:
```
Host: postgres.railway.internal
Port: 5432
User: postgres
Password: ooLDQrKOlJGyNtTEVkjHjGpbYQIQhCIW
Database: railway
```

## Complete Environment Variables for Railway

Copy these **EXACT** values to your Railway service → Variables:

### 1. Database (Already set by Railway Postgres plugin)
```
DATABASE_URL=postgresql://postgres:ooLDQrKOlJGyNtTEVkjHjGpbYQIQhCIW@postgres.railway.internal:5432/railway
```

**Note:** Railway should auto-set this. If not, add it manually.

### 2. JWT Configuration
```
JWT_SECRET=061fc5c8e5e95423df305da9f309cf11c8a566c6
JWT_REFRESH_SECRET=QfZItxTnxHP0iFxoFXTgioVNYTBewVGHJdnTskhTmaGH3NdNlUF578e4qIhluTOw
JWT_EXPIRES_IN=120m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Application Settings
```
NODE_ENV=production
CORS_ORIGIN=https://cis-load-board.netlify.app,http://localhost:3000
```

**Note:** Don't set `PORT` - Railway automatically sets it.

### 4. MinIO/Storage (Optional - if you need file uploads)

For now, you can use temporary MinIO settings or skip if not using file uploads yet:

```
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=sng-loadboard
```

**Better option:** Use AWS S3, Cloudflare R2, or other cloud storage for production.

## Step-by-Step Setup in Railway Dashboard

### Step 1: Go to Variables
1. Open Railway dashboard
2. Click on your backend service
3. Click "Variables" tab

### Step 2: Add/Update Variables

Click "New Variable" and add each of these:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `postgresql://postgres:ooLDQrKOlJGyNtTEVkjHjGpbYQIQhCIW@postgres.railway.internal:5432/railway` |
| `JWT_SECRET` | `061fc5c8e5e95423df305da9f309cf11c8a566c6` |
| `JWT_REFRESH_SECRET` | `QfZItxTnxHP0iFxoFXTgioVNYTBewVGHJdnTskhTmaGH3NdNlUF578e4qIhluTOw` |
| `JWT_EXPIRES_IN` | `120m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://cis-load-board.netlify.app,http://localhost:3000` |

### Step 3: Run Database Migrations

After setting variables, run migrations:

```bash
# Install Railway CLI if needed
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

Or use Railway dashboard:
1. Go to your service
2. Click "Settings" tab
3. Scroll to "Deploy Command"
4. Ensure it includes: `npx prisma migrate deploy && npm run start:prod`

### Step 4: Redeploy

Railway should auto-redeploy after changing variables. If not:

```bash
railway up
```

Or in dashboard:
1. Go to "Deployments" tab
2. Click "Deploy" button (top right)

### Step 5: Verify

After deployment completes, test:

```bash
# Test health endpoint
curl https://clb-back-production.up.railway.app/api/v1/health

# Should return:
# {"status":"ok","timestamp":"...","service":"SNG LoadBoard Backend","version":"1.0.0"}
```

## Quick Copy-Paste for Railway Variables

Use this format if Railway accepts bulk input:

```env
DATABASE_URL=postgresql://postgres:ooLDQrKOlJGyNtTEVkjHjGpbYQIQhCIW@postgres.railway.internal:5432/railway
JWT_SECRET=061fc5c8e5e95423df305da9f309cf11c8a566c6
JWT_REFRESH_SECRET=QfZItxTnxHP0iFxoFXTgioVNYTBewVGHJdnTskhTmaGH3NdNlUF578e4qIhluTOw
JWT_EXPIRES_IN=120m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://cis-load-board.netlify.app,http://localhost:3000
```

## Verification Checklist

After setting variables and redeploying:

- [ ] Variables tab shows all 7 variables
- [ ] Deployment completed successfully (green checkmark)
- [ ] Logs show "Nest application successfully started"
- [ ] Logs show "Application is running on: http://localhost:XXXX"
- [ ] Health endpoint returns 200 OK
- [ ] No errors in Railway logs
- [ ] Can register a user successfully

## If Still Getting 500 Errors

1. **Check Railway Logs:**
   ```bash
   railway logs --last 100
   ```
   Look for error messages.

2. **Verify Database Connection:**
   ```bash
   railway run npx prisma db execute --stdin <<< "SELECT 1;"
   ```

3. **Check Migration Status:**
   ```bash
   railway run npx prisma migrate status
   ```

4. **View Environment in Runtime:**
   ```bash
   railway run env | grep -E "(DATABASE_URL|JWT_SECRET|NODE_ENV)"
   ```

## Common Issues After Setup

### Issue: "Table does not exist"

**Solution:**
```bash
railway run npx prisma migrate deploy
```

### Issue: Still 500 after setting variables

**Cause:** Old deployment is still running

**Solution:**
1. Go to Railway dashboard
2. Click "Deployments" tab
3. Cancel old deployment
4. Deploy again

### Issue: DATABASE_URL not connecting

**Cause:** Using external hostname instead of internal

**Solution:** Make sure DATABASE_URL uses:
- ✅ `postgres.railway.internal` (internal network)
- ❌ NOT `postgres-production.railway.app` (external)

## Next Steps After Success

Once your backend is working:

1. **Test all endpoints:**
   - Health: `/api/v1/health`
   - Register: `/api/v1/auth/register`
   - Login: `/api/v1/auth/login`

2. **Update frontend:**
   Update your frontend API URL to:
   ```
   https://clb-back-production.up.railway.app
   ```

3. **Monitor logs:**
   Keep Railway logs open during testing:
   ```bash
   railway logs
   ```

4. **Set up MinIO/S3:**
   If you need file uploads, set up cloud storage.

## Security Notes

⚠️ **IMPORTANT:** The credentials shown here are for demonstration. For production:

1. ✅ Keep these secure (don't commit to git)
2. ✅ Use strong, random secrets
3. ✅ Rotate secrets periodically
4. ✅ Use Railway's secret management
5. ✅ Enable Railway's automatic SSL
6. ❌ Never expose these in client-side code
