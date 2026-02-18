import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const session = await auth()
    const cookieStore = await cookies()
    
    // Get all cookies
    const allCookies = cookieStore.getAll()
    const authCookies = allCookies.filter((cookie: any) => 
      cookie.name.includes('auth') || 
      cookie.name.includes('session') ||
      cookie.name.includes('next-auth')
    )
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          role: session.user?.role
        },
        expires: session.expires
      } : null,
      authenticated: !!session,
      cookies: {
        total: allCookies.length,
        authRelated: authCookies.map((c: any) => ({
          name: c.name,
          value: c.value.substring(0, 20) + '...',
          hasValue: !!c.value
        }))
      },
      middleware_check: {
        expected_cookie_names: [
          'authjs.session-token',
          'next-auth.session-token',
          '__Secure-authjs.session-token',
          '__Host-authjs.session-token',
          'session-token'
        ],
        found_cookies: allCookies.map((c: any) => c.name)
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}