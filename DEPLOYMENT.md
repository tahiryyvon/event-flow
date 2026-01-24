# Vercel Deployment Guide

## Environment Variables

Set these in your Vercel project dashboard:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### Authentication
```
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Email (Optional)
```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Quick Deploy Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project" 
   - Connect your GitHub repository: `tahiryyvon/event-flow`

2. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add all the variables listed above

3. **Deploy**
   - Vercel will automatically deploy on every push to master branch
   - First deployment will take 2-3 minutes

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