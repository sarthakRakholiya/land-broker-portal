# 🚨 Production Deployment Fix Guide

## Current Issues:

- **Login API**: 500 Internal Server Error
- **Location API**: 503 Service Unavailable
- **Land API**: 401 Unauthorized
- **Service Worker**: Still trying to register (cached)

## 🔧 Step-by-Step Fix

### 1. Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables:**

```bash
# Database URL (CRITICAL - Use Supabase Connection Pooling)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# JWT Secret (CRITICAL)
NEXTAUTH_SECRET=your-super-secure-random-jwt-secret-here

# Environment
NODE_ENV=production
```

**How to get Supabase Connection Pooling URL:**

1. Go to Supabase Dashboard
2. Settings → Database
3. Copy **Connection Pooling** URL (NOT Direct Connection)
4. Should look like: `postgresql://postgres.abc123:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres`

### 2. Generate Secure JWT Secret

```bash
# Run this command to generate a secure secret:
openssl rand -base64 32
```

### 3. Deploy Updated Code

```bash
git add .
git commit -m "Fix production deployment issues"
git push origin main
```

### 4. Seed Database in Production

After deployment, call the seed API:

```bash
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"seed-db-vekariya-2024"}'
```

This will create:

- Admin user: `admin@dbvekariya.com` / `admin123`
- Default locations: Gondal, Rajkot

### 5. Test Your Deployment

**A. Health Check:**

```bash
curl https://your-app.vercel.app/api/health
```

Should return `"status": "healthy"`

**B. Login Test:**

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dbvekariya.com","password":"admin123"}'
```

Should return user data and JWT token

**C. Protected API Test:**

```bash
# Use token from login response
curl -X GET https://your-app.vercel.app/api/locations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Clear Service Worker Cache

The service worker issue is browser-side caching. Users need to:

1. Open browser DevTools (F12)
2. Go to Application tab → Service Workers
3. Click "Unregister" on any registered service workers
4. Go to Storage tab → Clear storage → Clear site data
5. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

Or just wait - the unregister script will clear it automatically.

## 🔍 Troubleshooting

### If Login still gives 500:

1. Check Vercel function logs
2. Verify `DATABASE_URL` is set correctly
3. Make sure database is seeded
4. Check `/api/health` for detailed error

### If Location API gives 503:

1. Database connection issue
2. Check Supabase is accessible
3. Verify connection pooling URL format
4. Check Vercel function logs

### If Land API gives 401:

1. JWT secret not set in Vercel
2. Token not being sent from frontend
3. Check browser localStorage has token after login

## 📋 Quick Verification Checklist

- [ ] `DATABASE_URL` set in Vercel (connection pooling format)
- [ ] `NEXTAUTH_SECRET` set in Vercel (secure random string)
- [ ] Code deployed to Vercel
- [ ] Database seeded via `/api/seed`
- [ ] `/api/health` returns healthy status
- [ ] Login works and returns JWT token
- [ ] Protected APIs work with token

## 🆘 Still Having Issues?

1. Check Vercel function logs in dashboard
2. Use browser DevTools Network tab to see exact error responses
3. Clear all browser data and try again
4. Verify Supabase database is accessible and has data

The enhanced error logging will show exactly what's failing in the Vercel function logs.
