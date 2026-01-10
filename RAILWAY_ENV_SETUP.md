# Railway Environment Variables Setup

## Important Notes

1. **Railway Postgres** automatically provides these variables:
   - `PGHOST` - Database host
   - `PGPORT` - Database port (usually 5432)
   - `PGUSER` - Database user
   - `PGPASSWORD` - Database password
   - `PGDATABASE` - Database name
   - `DATABASE_URL` - Complete connection string (automatically generated)

2. **DO NOT manually set DATABASE_URL** if you're using Railway's Postgres plugin - it's automatically provided!

## Environment Variables for Railway

Set these variables in your Railway service settings:

### Application Variables

```env
# JWT Configuration
JWT_SECRET=Kgan34oEDYZ8EdBoXdCDezLNMeKdPBeggnUTVujYtl4Fbz9hCNP8mwZ9hseXOoee
JWT_REFRESH_SECRET=QfZItxTnxHP0iFxoFXTgioVNYTBewVGHJdnTskhTmaGH3NdNlUF578e4qIhluTOw
JWT_EXPIRES_IN=120m
JWT_REFRESH_EXPIRES_IN=7d

# Application Settings
NODE_ENV=production
PORT=3001

# CORS Configuration - Single origin
CORS_ORIGIN=https://cis-load-board.netlify.app

# OR Multiple origins (comma-separated, no spaces around commas recommended)
# CORS_ORIGIN=https://cis-load-board.netlify.app,https://staging.cis-load-board.netlify.app,http://localhost:3000

# MinIO Configuration (if using external MinIO)
MINIO_ENDPOINT=your-minio-host.com
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_BUCKET=sng-loadboard
```

### Database Configuration

**Option 1: Using Railway Postgres Plugin (RECOMMENDED)**

1. Add the Postgres plugin to your Railway project
2. Railway will automatically inject `DATABASE_URL`
3. **DO NOT** manually set `DATABASE_URL` - Railway handles this

The format will be:
```
postgresql://${{ Postgres.PGUSER }}:${{ Postgres.PGPASSWORD }}@${{ Postgres.PGHOST }}:${{ Postgres.PGPORT }}/${{ Postgres.PGDATABASE }}
```

**Option 2: Using External Database**

If you're using an external database (not Railway's Postgres plugin), set:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name?schema=public
```

Replace with your actual database credentials.

## Common Issues & Solutions

### Issue: Authentication Failed

**Error:**
```
P1000: Authentication failed against database server
```

**Solutions:**

1. **If using Railway Postgres:**
   - Remove any manual `DATABASE_URL` variable
   - Ensure Postgres plugin is connected to your service
   - Check Railway dashboard → Variables to confirm `DATABASE_URL` exists

2. **If using external database:**
   - Verify credentials are correct
   - Check if database allows connections from Railway's IP
   - Ensure connection string format is correct

### Issue: Database Variable References Not Working

Railway uses this syntax for referencing other service variables:
```
${{ Postgres.VARIABLE_NAME }}
```

However, this ONLY works in Railway's dashboard when linking services. You cannot use this in environment variable values you set manually.

**Wrong:**
```env
DATABASE_URL=postgresql://${PGUSER}:${POSTGRES_PASSWORD}@${RAILWAY_PRIVATE_DOMAIN}:5432/${PGDATABASE}
```

**Correct approach:**
- Let Railway's Postgres plugin auto-generate `DATABASE_URL`, OR
- Use the full hardcoded connection string

### Issue: CORS Errors

Make sure `CORS_ORIGIN` matches your frontend URL exactly:
```env
CORS_ORIGIN=https://cis-load-board.netlify.app
```

Note: No trailing slash!

## Deployment Steps

1. **Connect Railway to your GitHub repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Railway deployment setup"
   git push
   ```

2. **Create Railway project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add Postgres plugin**
   - In your Railway project
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically connect it

4. **Set environment variables**
   - Go to your service settings
   - Click "Variables" tab
   - Add all the variables listed above (except DATABASE_URL if using Railway Postgres)

5. **Run migrations**

   After first deployment, run migrations:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login
   railway login

   # Link to your project
   railway link

   # Run migrations
   railway run npx prisma migrate deploy
   ```

6. **Verify deployment**
   - Check Railway logs for any errors
   - Test your API endpoint: `https://your-service.railway.app/api/v1/health`

## MinIO Storage Options for Railway

Since Railway doesn't have a built-in MinIO service, you have these options:

### Option 1: Use Railway Volumes (Simple but limited)

Store files directly on Railway's volume storage. Update your app to use local file storage instead of MinIO.

### Option 2: External MinIO/S3 Service (Recommended)

Use a cloud storage service:
- **AWS S3** - Most popular, reliable
- **Cloudflare R2** - S3-compatible, cheaper
- **DigitalOcean Spaces** - S3-compatible
- **Backblaze B2** - Very affordable

Update environment variables with your chosen service:
```env
MINIO_ENDPOINT=s3.amazonaws.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-aws-access-key
MINIO_SECRET_KEY=your-aws-secret-key
MINIO_BUCKET=your-bucket-name
```

### Option 3: Self-hosted MinIO

Deploy MinIO on another platform (Railway, Heroku, DigitalOcean) and connect to it.

## Checking Your Configuration

After deployment, verify your environment variables:

```bash
# View all environment variables
railway run env

# Check specific variable
railway run env | grep DATABASE_URL
railway run env | grep JWT_SECRET
```

## Railway-Specific Settings

### Build Command
Railway auto-detects from `package.json`, but you can override in `railway.toml`:

```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build && npx prisma generate"

[deploy]
startCommand = "npx prisma migrate deploy && npm run start:prod"
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 10
```

### Health Checks

Railway will automatically health check your service on the `PORT` you specify.

## Troubleshooting

### View Logs
```bash
railway logs
```

### Connect to Database
```bash
railway connect postgres
```

### Run Commands
```bash
railway run npx prisma studio  # Open Prisma Studio
railway run npx prisma migrate status  # Check migration status
```

## Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] CORS_ORIGIN is set to your frontend URL only
- [ ] Database credentials are secure (Railway Postgres handles this)
- [ ] MinIO/S3 credentials are secure
- [ ] NODE_ENV is set to "production"
- [ ] No sensitive data in git repository
- [ ] Environment variables set in Railway dashboard (not in code)
