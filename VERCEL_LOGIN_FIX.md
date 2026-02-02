# 🚀 Vercel Deployment Guide

## The Issue
Your EventFlow app works locally but login fails on Vercel because environment variables are not properly configured in production.

## 🔧 Step-by-Step Fix

### 1. Generate Production Secret
A new production-ready secret has been generated: `pAQyrCYDWq8rdD9MFJ4UvGMZV3/tnWniEsSJcqqYDrQ=`

### 2. Configure Vercel Environment Variables

Go to your Vercel project dashboard and set these environment variables:

#### Required Variables:
```
NEXTAUTH_SECRET=pAQyrCYDWq8rdD9MFJ4UvGMZV3/tnWniEsSJcqqYDrQ=
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=postgresql://neondb_owner:npg_dri4vuHAn0aw@ep-broad-cell-ahk1lgpm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Optional but Recommended:
```
RESEND_API_KEY=your-actual-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 3. How to Set Environment Variables in Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your EventFlow project**
3. **Navigate to**: Settings → Environment Variables
4. **Add each variable**:
   - Click "Add New"
   - Enter the Name (e.g., `NEXTAUTH_SECRET`)
   - Enter the Value
   - Select environments: `Production`, `Preview`, `Development`
   - Click "Save"

### 4. Update NEXTAUTH_URL
⚠️ **Important**: Replace `your-app-name` with your actual Vercel app URL:
- If your Vercel URL is `https://eventflow-xyz.vercel.app`
- Set `NEXTAUTH_URL=https://eventflow-xyz.vercel.app`

### 5. Redeploy
After setting all environment variables:
1. Go to your project's Deployments tab
2. Click on the latest deployment
3. Click "Redeploy" 
4. Or push a new commit to trigger automatic deployment

### 6. Verify Configuration
After redeployment, visit: `https://your-app-name.vercel.app/api/health`

You should see:
```json
{
  "status": "healthy",
  "checks": {
    "NEXTAUTH_SECRET": "✅ Set",
    "NEXTAUTH_URL": "✅ Set",
    "DATABASE_URL": "✅ Set",
    "RESEND_API_KEY": "✅ Set"
  }
}
```

## 🐛 Common Issues

### "Configuration object is invalid"
- Make sure `NEXTAUTH_SECRET` is set in Vercel
- Verify it's not using the fallback value

### "Invalid redirect URI"
- Ensure `NEXTAUTH_URL` matches your actual Vercel domain
- No trailing slash in the URL

### Login still not working
1. Check browser console for errors
2. Visit `/api/health` to verify env vars
3. Check Vercel function logs for authentication errors

## 📝 Quick Checklist
- [ ] Set NEXTAUTH_SECRET in Vercel
- [ ] Set NEXTAUTH_URL to correct domain
- [ ] Set DATABASE_URL (same as local)
- [ ] Redeploy the project
- [ ] Test `/api/health` endpoint
- [ ] Test login functionality

## 🆘 Need Help?
If login still fails after following these steps:
1. Check Vercel function logs
2. Verify the health endpoint shows all variables as "✅ Set"
3. Ensure your database is accessible from Vercel (Neon should work out of the box)