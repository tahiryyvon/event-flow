# Vercel Authentication Issue Debug Guide

## 🔍 Issue: Sign In Not Working on Vercel

**Symptoms**: 
- Login works locally
- No console errors
- No server log errors
- Not redirecting to dashboard after sign-in

## 🎯 Most Likely Causes

### 1. **NEXTAUTH_URL Mismatch** (Most Common)
**Problem**: Your `.env` has `NEXTAUTH_URL="http://localhost:3000"` but Vercel needs your production URL.

**Solution**:
```bash
# In Vercel Environment Variables, set:
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 2. **Missing Production Secret**
**Problem**: Using development secret in production.

**Solution**:
```bash
# Generate new secret:
openssl rand -base64 32

# Set in Vercel:
NEXTAUTH_SECRET=your-generated-secret
```

### 3. **Cookie Issues**
**Problem**: Secure cookies not working properly on Vercel.

## 🛠️ Debug Steps

### Step 1: Check Environment Variables
Visit: `https://your-app.vercel.app/api/health`

Should show all ✅ for required variables.

### Step 2: Check Authentication Status  
Visit: `https://your-app.vercel.app/api/debug-auth`

This will show:
- Environment variables status
- Session information  
- Cookie status
- Request headers
- Specific recommendations

### Step 3: Test Session API
After attempting login, visit: `https://your-app.vercel.app/api/auth/session`

Should return user session data if authentication worked.

## 🚀 Quick Fix Checklist

### In Vercel Dashboard → Your Project → Settings → Environment Variables:

1. **Set NEXTAUTH_URL**:
   ```
   Name: NEXTAUTH_URL
   Value: https://your-actual-vercel-url.vercel.app
   Environment: Production, Preview, Development
   ```

2. **Set NEXTAUTH_SECRET**:
   ```bash
   # Generate with:
   openssl rand -base64 32
   
   # Then set:
   Name: NEXTAUTH_SECRET  
   Value: [your-generated-secret]
   Environment: Production, Preview, Development
   ```

3. **Set DATABASE_URL**:
   ```
   Name: DATABASE_URL
   Value: [your-neon-database-url]  
   Environment: Production, Preview, Development
   ```

4. **Deploy Again**:
   After setting variables, trigger a new deployment.

## 🔧 Enhanced Debug Login

I've created `/api/debug-auth` endpoint that will tell you exactly what's wrong.

### Usage:
1. Deploy the updated code
2. Visit `https://your-app.vercel.app/api/debug-auth`
3. Follow the recommendations provided

## 📱 Client-Side Debug

Add this temporarily to your login page to debug:

```javascript
// Add after signIn call
console.log('Sign in result:', result)
console.log('Current URL:', window.location.href)

// Check session immediately
const sessionResponse = await fetch('/api/auth/session')
const sessionData = await sessionResponse.json()
console.log('Session data:', sessionData)
```

## ⚡ Expected Results

**Working Authentication**:
- `/api/health` → All ✅
- `/api/debug-auth` → Shows active session  
- `/api/auth/session` → Returns user data
- Login redirects to appropriate dashboard

**Common Issues**:
- NEXTAUTH_URL wrong → Cookie domain mismatch
- NEXTAUTH_SECRET missing → Authentication fails silently  
- Database connection → User lookup fails

## 🎯 Most Likely Fix

95% chance your issue is NEXTAUTH_URL. Set it to your actual Vercel domain and redeploy.