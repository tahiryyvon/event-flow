import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    nextauth_secret: !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET !== 'fallback-secret-for-build-only-do-not-use-in-production',
    nextauth_url: !!process.env.NEXTAUTH_URL,
    database_url: !!process.env.DATABASE_URL,
    resend_api_key: !!process.env.RESEND_API_KEY,
  }

  const allRequired = checks.nextauth_secret && checks.nextauth_url && checks.database_url
  
  const healthCheck = {
    status: allRequired ? "healthy" : "configuration_needed",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    checks: {
      "NEXTAUTH_SECRET": {
        status: checks.nextauth_secret ? "✅ Set" : "❌ Missing or using fallback",
        length: process.env.NEXTAUTH_SECRET?.length || 0,
        isProduction: process.env.NEXTAUTH_SECRET !== 'fallback-secret-for-build-only-do-not-use-in-production'
      },
      "NEXTAUTH_URL": {
        status: checks.nextauth_url ? "✅ Set" : "❌ Missing",
        value: process.env.NEXTAUTH_URL,
        isLocalhost: process.env.NEXTAUTH_URL?.includes('localhost')
      },
      "DATABASE_URL": {
        status: checks.database_url ? "✅ Set" : "❌ Missing",
        length: process.env.DATABASE_URL?.length || 0
      },
      "RESEND_API_KEY": {
        status: checks.resend_api_key ? "✅ Set" : "⚠️ Optional - Not set",
        length: process.env.RESEND_API_KEY?.length || 0
      }
    },
    recommendations: [] as string[]
  }

  // Add recommendations based on environment
  if (process.env.NODE_ENV === 'production') {
    if (!checks.nextauth_secret) {
      healthCheck.recommendations.push('❌ Set a proper NEXTAUTH_SECRET for production')
    }
    
    if (process.env.NEXTAUTH_URL?.includes('localhost')) {
      healthCheck.recommendations.push('❌ NEXTAUTH_URL should be your Vercel domain in production')
    }
    
    if (!checks.database_url) {
      healthCheck.recommendations.push('❌ DATABASE_URL is required for database connection')
    }
  }

  if (healthCheck.recommendations.length === 0) {
    healthCheck.recommendations.push('✅ All environment variables are properly configured!')
  }

  return NextResponse.json(healthCheck, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  })
}