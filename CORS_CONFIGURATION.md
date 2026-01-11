# CORS Configuration Guide

## Overview

The backend supports multiple CORS (Cross-Origin Resource Sharing) origins to allow your frontend to access the API from different domains.

## How It Works

The `CORS_ORIGIN` environment variable accepts:
1. **Single origin** - One URL as a string
2. **Multiple origins** - Comma-separated list of URLs

The backend automatically detects and parses the format.

## Configuration Examples

### Single Origin

For production with one frontend domain:

```env
CORS_ORIGIN="https://cis-load-board.netlify.app"
```

### Multiple Origins

For development + production, or multiple deployments:

```env
CORS_ORIGIN="http://localhost:3000,https://cis-load-board.netlify.app,https://staging.cis-load-board.netlify.app"
```

**Important Notes:**
- Use commas (`,`) to separate origins
- No spaces around commas (recommended for clarity)
- Include the protocol (`http://` or `https://`)
- Do **NOT** include trailing slashes

## Examples for Different Scenarios

### Development Only
```env
CORS_ORIGIN="http://localhost:3000"
```

### Production Only
```env
CORS_ORIGIN="https://cis-load-board.netlify.app"
```

### Development + Production
```env
CORS_ORIGIN="http://localhost:3000,https://cis-load-board.netlify.app"
```

### Multiple Environments
```env
CORS_ORIGIN="http://localhost:3000,http://localhost:5173,https://cis-load-board.netlify.app,https://staging-app.netlify.app,https://preview-123.netlify.app"
```

### Custom Domains
```env
CORS_ORIGIN="http://localhost:3000,https://loadboard.example.com,https://www.loadboard.example.com"
```

## Railway/Production Setup

In Railway dashboard, set the `CORS_ORIGIN` variable:

**For production only:**
```
CORS_ORIGIN=https://cis-load-board.netlify.app
```

**For production + preview deployments:**
```
CORS_ORIGIN=https://cis-load-board.netlify.app,https://deploy-preview-*.netlify.app
```

Note: Wildcard domains (`*.netlify.app`) require additional configuration (see Advanced section below).

## Docker Compose

Update your `docker-compose.yml`:

```yaml
backend:
  environment:
    CORS_ORIGIN: "http://localhost:3000,https://cis-load-board.netlify.app"
```

## Testing CORS Configuration

### Method 1: Browser Console

Open your frontend app in a browser and check the Network tab:

1. Make an API request to your backend
2. Check the Response Headers
3. Look for `Access-Control-Allow-Origin`

It should match one of your configured origins.

### Method 2: cURL

Test from command line:

```bash
# Test with first origin
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     --verbose \
     http://localhost:3001/api/v1/health

# Test with second origin
curl -H "Origin: https://cis-load-board.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     --verbose \
     http://localhost:3001/api/v1/health
```

Look for `Access-Control-Allow-Origin` in the response headers.

### Method 3: Online CORS Tester

Use https://www.test-cors.org/ to test your CORS configuration.

## Common CORS Errors and Solutions

### Error: "No 'Access-Control-Allow-Origin' header"

**Cause:** The requesting origin is not in your `CORS_ORIGIN` list.

**Solution:** Add the origin to your `CORS_ORIGIN` environment variable:
```env
CORS_ORIGIN="http://localhost:3000,https://your-new-domain.com"
```

### Error: "The CORS protocol does not allow specifying a wildcard"

**Cause:** You tried to use `*` in credentials mode.

**Solution:** List specific origins instead of using wildcard. Our backend uses `credentials: true`, so wildcards are not allowed.

### Error: Trailing slash issues

**Wrong:**
```env
CORS_ORIGIN="https://cis-load-board.netlify.app/"
```

**Correct:**
```env
CORS_ORIGIN="https://cis-load-board.netlify.app"
```

### Error: Wrong protocol

**Wrong:**
```env
CORS_ORIGIN="cis-load-board.netlify.app"  # Missing protocol
```

**Correct:**
```env
CORS_ORIGIN="https://cis-load-board.netlify.app"
```

## Advanced Configuration

### Option 1: Wildcard Subdomains (Requires Code Change)

To allow all subdomains like `*.netlify.app`, modify `src/main.ts`:

```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = corsOrigin.split(',').map((o: string) => o.trim());

    // Check if origin matches any allowed origin or pattern
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed.includes('*')) {
        const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
        return pattern.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

Then use:
```env
CORS_ORIGIN="http://localhost:3000,https://*.netlify.app"
```

### Option 2: Dynamic CORS Based on Environment

For different origins per environment:

**.env.development:**
```env
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
```

**.env.production:**
```env
CORS_ORIGIN="https://cis-load-board.netlify.app"
```

**.env.staging:**
```env
CORS_ORIGIN="https://staging.cis-load-board.netlify.app"
```

## Security Best Practices

1. **Only list trusted domains** - Don't add origins you don't control
2. **Use HTTPS in production** - `https://` not `http://`
3. **No wildcards with credentials** - Our app uses `credentials: true`, so wildcards aren't allowed
4. **Remove localhost in production** - Don't include `http://localhost:3000` in production deployments
5. **Keep the list minimal** - Only add origins you actually need

## Verification Checklist

After updating CORS configuration:

- [ ] Backend rebuilt (`npm run build`)
- [ ] Backend restarted
- [ ] Environment variable updated in deployment platform
- [ ] No trailing slashes in URLs
- [ ] Protocol included (`http://` or `https://`)
- [ ] Tested with browser DevTools Network tab
- [ ] No CORS errors in browser console
- [ ] API requests succeed from all configured origins

## Example Configurations by Platform

### Netlify Frontend + Railway Backend

```env
# Railway environment variables
CORS_ORIGIN=https://your-app.netlify.app,https://deploy-preview-123.netlify.app
```

### Vercel Frontend + Railway Backend

```env
# Railway environment variables
CORS_ORIGIN=https://your-app.vercel.app,https://your-app-*.vercel.app
```

Note: Vercel uses `-` for preview deployments.

### Multiple Netlify Sites + Railway Backend

```env
CORS_ORIGIN=https://main-app.netlify.app,https://admin-panel.netlify.app,https://mobile-web.netlify.app
```

## Troubleshooting

### Check Current CORS Configuration

```bash
# In Docker
docker exec sng-loadboard-backend env | grep CORS_ORIGIN

# In Railway
railway run env | grep CORS_ORIGIN

# Locally
cat .env | grep CORS_ORIGIN
```

### Check Runtime Configuration

Add temporary logging to `src/main.ts`:

```typescript
const corsOrigin = configService.get('CORS_ORIGIN') || 'http://localhost:3000';
const allowedOrigins = corsOrigin.split(',').map((origin: string) => origin.trim());

console.log('CORS Origins:', allowedOrigins);

app.enableCors({
  origin: allowedOrigins.length > 1 ? allowedOrigins : corsOrigin,
  credentials: true,
});
```

Check logs to verify the origins are being parsed correctly.

## Need Help?

If you're still experiencing CORS issues:

1. Check browser DevTools Console for specific error messages
2. Verify the exact origin being sent (check Network tab → Request Headers → Origin)
3. Ensure the origin exactly matches one in your `CORS_ORIGIN` list
4. Remember: `http://localhost:3000` ≠ `http://localhost:3000/`
5. Check if your frontend is sending credentials (cookies, auth headers)
