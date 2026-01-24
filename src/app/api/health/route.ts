import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    nextauth_secret: !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET !== 'fallback-secret-for-build-only-do-not-use-in-production',
    nextauth_url: !!process.env.NEXTAUTH_URL,
    database_url: !!process.env.DATABASE_URL,
    resend_api_key: !!process.env.RESEND_API_KEY,
  }

  const allRequired = checks.nextauth_secret && checks.nextauth_url && checks.database_url
  
  return NextResponse.json({
    status: allRequired ? "healthy" : "configuration_needed",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      "NEXTAUTH_SECRET": checks.nextauth_secret ? "✅ Set" : "❌ Missing or using fallback",
      "NEXTAUTH_URL": checks.nextauth_url ? "✅ Set" : "❌ Missing", 
      "DATABASE_URL": checks.database_url ? "✅ Set" : "❌ Missing",
      "RESEND_API_KEY": checks.resend_api_key ? "✅ Set" : "⚠️ Optional - Not set"
    },
    message: allRequired 
      ? "All required environment variables are configured!" 
      : "Some required environment variables are missing. Check Vercel project settings."
  })
}