#!/usr/bin/env node

console.log('🔍 Environment Variables Check\n')

const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET', 
  'NEXTAUTH_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL'
]

const optionalVars = [
  'VERCEL_URL',
  'NODE_ENV'
]

console.log('📋 Required Variables:')
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`)
  } else {
    console.log(`❌ ${varName}: MISSING`)
  }
})

console.log('\n📋 Optional Variables:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value}`)
  } else {
    console.log(`⚪ ${varName}: Not set`)
  }
})

console.log('\n🌍 Environment Info:')
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
console.log(`Platform: ${process.platform}`)

if (process.env.VERCEL) {
  console.log('🚀 Running on Vercel')
} else {
  console.log('💻 Running locally')
}