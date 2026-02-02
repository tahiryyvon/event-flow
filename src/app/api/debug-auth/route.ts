import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const url = new URL(request.url)
    
    return NextResponse.json({
      status: "debug",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      debug: {
        // Environment Variables (safe to show in debug)
        nextauth_url: process.env.NEXTAUTH_URL || "❌ Not set",
        nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
        nextauth_secret_is_fallback: process.env.NEXTAUTH_SECRET === 'fallback-secret-for-build-only-do-not-use-in-production',
        database_url_exists: !!process.env.DATABASE_URL,
        
        // Request Info
        request_url: url.toString(),
        request_host: request.headers.get('host'),
        request_origin: request.headers.get('origin'),
        
        // Session Info
        session_exists: !!session,
        user_id: session?.user?.id || "No session",
        user_email: session?.user?.email || "No session",
        user_role: session?.user?.role || "No session",
        
        // Headers
        headers: {
          'x-forwarded-host': request.headers.get('x-forwarded-host'),
          'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
          'x-vercel-forwarded-for': request.headers.get('x-vercel-forwarded-for'),
        },
        
        // Cookies
        cookies: {
          'next-auth.session-token': !!request.cookies.get('next-auth.session-token'),
          '__Secure-next-auth.session-token': !!request.cookies.get('__Secure-next-auth.session-token'),
        }
      },
      recommendations: session ? [
        "✅ Authentication is working",
        "User is signed in successfully",
        "Check client-side redirect logic"
      ] : [
        "❌ No active session found",
        "Check NEXTAUTH_URL matches your Vercel domain",
        "Verify NEXTAUTH_SECRET is set in Vercel",
        "Check if cookies are being set properly",
        "Verify database connectivity"
      ]
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      recommendations: [
        "❌ Debug endpoint failed",
        "Check server logs for detailed error",
        "Verify all environment variables are set",
        "Check database connectivity"
      ]
    })
  }
}