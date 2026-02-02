#!/usr/bin/env node

const crypto = require('crypto')

console.log('🚀 Vercel Environment Variables Generator')
console.log('=========================================\n')

// Generate a new secret
const secret = crypto.randomBytes(32).toString('base64')

console.log('📋 Copy these to your Vercel Environment Variables:')
console.log('   (Go to: Vercel Dashboard → Your Project → Settings → Environment Variables)\n')

console.log('1️⃣  NEXTAUTH_SECRET')
console.log(`   Value: ${secret}`)
console.log('   Environment: Production, Preview, Development\n')

console.log('2️⃣  NEXTAUTH_URL')
console.log('   Value: https://your-app-name.vercel.app')
console.log('   ⚠️  REPLACE "your-app-name" with your actual Vercel domain!')
console.log('   Environment: Production, Preview\n')

console.log('3️⃣  NEXTAUTH_URL (for development)')
console.log('   Value: http://localhost:3000')
console.log('   Environment: Development only\n')

console.log('4️⃣  DATABASE_URL')
console.log('   Value: postgresql://neondb_owner:npg_dri4vuHAn0aw@ep-broad-cell-ahk1lgpm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require')
console.log('   Environment: Production, Preview, Development\n')

console.log('5️⃣  RESEND_API_KEY (Optional)')
console.log('   Value: your-resend-api-key')
console.log('   Environment: Production, Preview, Development\n')

console.log('6️⃣  RESEND_FROM_EMAIL (Optional)')
console.log('   Value: noreply@yourdomain.com')
console.log('   Environment: Production, Preview, Development\n')

console.log('🔧 After setting variables:')
console.log('   1. Go to Vercel Deployments tab')
console.log('   2. Click "Redeploy" on the latest deployment')
console.log('   3. Test with: https://your-app.vercel.app/api/health')
console.log('   4. Debug with: https://your-app.vercel.app/api/debug-auth\n')

console.log('🎯 Common Issues:')
console.log('   • Wrong NEXTAUTH_URL (most common)')
console.log('   • NEXTAUTH_SECRET not set or using fallback')
console.log('   • Environment variables not applied to all environments')
console.log('   • Not redeploying after setting variables\n')

console.log('✅ Success Check:')
console.log('   /api/health should show all ✅')
console.log('   /api/debug-auth should show active session after login')
console.log('   Login should redirect to dashboard\n')