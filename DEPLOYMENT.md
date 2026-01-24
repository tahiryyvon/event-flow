# Vercel Deployment Guide

## 🚨 Required Environment Variables

**IMPORTANT**: You must set these environment variables in Vercel before deployment works.

### Step-by-Step Setup

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `event-flow` project

2. **Navigate to Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add each variable below

### Required Variables

#### Database (Required)
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```
- Get from [Neon](https://neon.tech), [Supabase](https://supabase.com), or any PostgreSQL provider

#### Authentication (Required)
```
NEXTAUTH_SECRET=your-random-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**To generate NEXTAUTH_SECRET:**
```bash
# Run this command and copy the output
openssl rand -base64 32
```

#### Email (Optional)
```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```
- Get API key from [Resend](https://resend.com/api-keys)

## Environment Variable Setup in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Access Settings**
   ```
   Vercel Dashboard → Your Project → Settings → Environment Variables
   ```

2. **Add Each Variable**
   - Click "Add New" for each environment variable
   - Set environment to "Production, Preview, and Development"

3. **Example Setup**
   ```
   Name: DATABASE_URL
   Value: postgresql://user:pass@host:5432/db?sslmode=require
   Environment: Production, Preview, Development

   Name: NEXTAUTH_SECRET  
   Value: [your-32-character-secret]
   Environment: Production, Preview, Development

   Name: NEXTAUTH_URL
   Value: https://your-app.vercel.app
   Environment: Production, Preview, Development
   ```

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET  
vercel env add NEXTAUTH_URL
```

## Deployment Steps

### 1. Connect Repository
- Import project from GitHub: `tahiryyvon/event-flow`
- Choose "Next.js" framework preset

### 2. Configure Variables
- Add all required environment variables (see above)
- **Verify** each variable is set correctly

### 3. Deploy
- Click "Deploy" or push to trigger deployment
- Check build logs for any errors
- Visit `https://your-app.vercel.app/api/health` to verify environment variables

## 🔍 Environment Variable Health Check

After deployment, check your configuration:
```
https://your-app.vercel.app/api/health
```

This will show you which environment variables are properly configured:
- ✅ All required variables set = Ready to use  
- ❌ Missing variables = Check Vercel settings

## Database Setup

### Option 1: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npx prisma db push`

### Option 2: Vercel PostgreSQL
1. In Vercel dashboard, go to Storage tab
2. Create PostgreSQL database
3. Copy connection string to environment variables

## Post-Deployment

1. **Run Database Migrations**
   ```bash
   # Local or use Vercel CLI
   npx prisma db push
   ```

2. **Create Test Users** (Optional)
   ```bash
   # Run locally then sync to production DB
   node scripts/create-test-user.js
   ```

3. **Test Authentication**
   - Visit your deployed app
   - Create account or use test credentials
   - Verify role-based redirects work

## Troubleshooting

### Build Errors
- Check environment variables are set correctly
- Ensure DATABASE_URL is accessible from Vercel
- Verify all required dependencies are in package.json

### Runtime Errors  
- Check Vercel function logs in dashboard
- Ensure database connection string has `?sslmode=require`
- Verify NextAuth URL matches deployment URL

### Email Issues
- Resend API key must be valid
- From email domain must be verified in Resend
- Check Vercel function logs for email errors