#!/usr/bin/env node

const crypto = require('crypto')

console.log('🔐 Generating production-ready NEXTAUTH_SECRET...\n')

// Generate a secure 32-byte random string and encode it as base64
const secret = crypto.randomBytes(32).toString('base64')

console.log('✅ Generated NEXTAUTH_SECRET:')
console.log(secret)
console.log('\n📝 Instructions for Vercel:')
console.log('1. Go to your Vercel project dashboard')
console.log('2. Navigate to Settings > Environment Variables')
console.log('3. Add a new variable:')
console.log('   Name: NEXTAUTH_SECRET')
console.log(`   Value: ${secret}`)
console.log('   Environment: Production, Preview, Development')
console.log('4. Redeploy your project')

console.log('\n🔗 Other required environment variables for Vercel:')
console.log('- DATABASE_URL: Your Neon database connection string')
console.log('- NEXTAUTH_URL: https://your-app-name.vercel.app (your production URL)')
console.log('- RESEND_API_KEY: Your Resend API key for emails')
console.log('- RESEND_FROM_EMAIL: Your verified sender email')

console.log('\n💡 Tip: You can also add these to your local .env file for testing')