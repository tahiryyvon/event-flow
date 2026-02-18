import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname === '/api/auth/session' ||
    pathname === '/api/auth/signin' ||
    pathname === '/api/auth/signout' ||
    pathname === '/api/auth/callback'
  ) {
    return NextResponse.next()
  }

  // Public routes that don't need authentication
  const publicRoutes = ['/', '/login', '/signup', '/dashboard'] // Temporarily allow /dashboard
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/book/')

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for session tokens (NextAuth v5 with database sessions)
  const sessionCookies = [
    'authjs.session-token',      // NextAuth v5 default
    'next-auth.session-token',   // NextAuth v4 compatibility 
    '__Secure-authjs.session-token', // Secure contexts
    '__Host-authjs.session-token',   // Host-only secure
    'session-token'              // Fallback
  ]
  
  const hasSessionToken = sessionCookies.some(cookieName => {
    const cookie = request.cookies.get(cookieName)
    return cookie && cookie.value
  })
  
  // Also check for any NextAuth-related cookies
  const allCookieNames = Array.from(request.cookies.getAll().map(cookie => cookie.name))
  const hasAnyAuthCookie = allCookieNames.some(name => 
    name.includes('next-auth') || 
    name.includes('authjs') || 
    name.includes('session')
  )

  console.log('🛡️ Middleware check:', { 
    pathname, 
    hasSessionToken,
    hasAnyAuthCookie,
    allCookies: allCookieNames.filter(name => 
      name.includes('auth') || name.includes('session')
    )
  })

  // If user has session and tries to access auth pages or root page, redirect to dashboard
  if (hasSessionToken && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
    console.log('✅ User has session, redirecting to dashboard from:', pathname)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protected routes that require authentication - all authenticated users can access these
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !hasSessionToken && !hasAnyAuthCookie) {
    console.log('🔒 Redirecting to login - no session token found')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}