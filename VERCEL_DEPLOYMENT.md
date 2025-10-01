# Vercel Deployment Guide for DB Vekariya

## 🚨 Current Issues:

- **Land API**: 401 Unauthorized (JWT secret not configured)
- **Location API**: 500 Internal Server Error (Supabase connection issue)

## ✅ Required Environment Variables in Vercel

### 1. Database Configuration

```bash
DATABASE_URL="postgresql://[username]:[password]@[host]:[port]/[database]?pgbouncer=true&connection_limit=1"
```

**Important for Supabase:**

- Use the **connection pooling** URL from Supabase (not the direct connection)
- Add `?pgbouncer=true&connection_limit=1` to prevent connection issues
- Get this from: Supabase Dashboard → Settings → Database → Connection Pooling

### 2. JWT Secret

```bash
NEXTAUTH_SECRET="your-production-jwt-secret-here-make-it-long-and-random"
```

**Generate a secure secret:**

```bash
openssl rand -base64 32
```

### 3. Next.js Configuration

```bash
NODE_ENV="production"
NEXT_PUBLIC_API_URL="/api"
```

## 🔧 How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables**
4. Add each variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection pooling URL
   - **Environment**: Production, Preview, Development (select all)

## 🗄️ Supabase Database Setup

### 1. Get the Correct Connection String

- Go to Supabase Dashboard
- Navigate to **Settings** → **Database**
- Use **Connection Pooling** URL (not Direct Connection)
- Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### 2. Run Database Migrations

```bash
# In your local environment
npx prisma migrate deploy
npx prisma db seed
```

### 3. Alternative: Use Supabase SQL Editor

Copy and paste the migration SQL directly in Supabase SQL Editor:

```sql
-- From prisma/migrations/[timestamp]_init/migration.sql
-- Copy the entire content and run in Supabase
```

## 🚀 Deployment Steps

### 1. Update Your Code (Already Done)

- ✅ Fixed Prisma configuration for production
- ✅ Added better error handling for Supabase
- ✅ Enhanced health check endpoint
- ✅ Fixed JWT secret configuration

### 2. Set Environment Variables in Vercel

```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
NEXTAUTH_SECRET=your-generated-secret-here
NODE_ENV=production
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Fix production deployment issues"
git push origin main
```

### 4. Test Your Deployment

After deployment, test these endpoints:

**Health Check:**

```
https://your-app.vercel.app/api/health
```

**Login:**

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dbvekariya.com","password":"admin123"}'
```

**Protected APIs (use token from login):**

```bash
curl -X GET https://your-app.vercel.app/api/locations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔍 Troubleshooting

### If Location API still gives 500:

1. Check Vercel function logs
2. Verify DATABASE_URL is correctly set
3. Ensure Supabase database is accessible
4. Check `/api/health` endpoint for detailed error info

### If Land API still gives 401:

1. Verify NEXTAUTH_SECRET is set in Vercel
2. Check browser localStorage has valid token after login
3. Verify token is being sent in Authorization header

### Common Supabase Issues:

- **Connection limit exceeded**: Use connection pooling URL
- **SSL required**: Supabase URLs include SSL by default
- **Wrong port**: Use 6543 for pooling, 5432 for direct

## 📝 Quick Checklist

- [ ] Set `DATABASE_URL` in Vercel (use connection pooling URL)
- [ ] Set `NEXTAUTH_SECRET` in Vercel (generate secure random string)
- [ ] Set `NODE_ENV=production` in Vercel
- [ ] Run database migrations on Supabase
- [ ] Deploy updated code to Vercel
- [ ] Test `/api/health` endpoint
- [ ] Test login and protected APIs

## 🆘 Still Having Issues?

Check the Vercel function logs:

1. Go to Vercel Dashboard → Functions
2. Click on your API functions
3. Check the logs for detailed error messages

The enhanced error logging will show exactly what's failing.
