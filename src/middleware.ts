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
    pathname === '/api/auth/signout'
  ) {
    return NextResponse.next()
  }

  // Get session token from cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value

  console.log('🛡️ Middleware check:', { 
    pathname, 
    hasSession: !!sessionToken,
    sessionTokenName: sessionToken ? 'found' : 'not found'
  })

  // Protected routes that require authentication
  const protectedRoutes = ['/organizer', '/participant', '/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !sessionToken) {
    console.log('🔒 Redirecting to login - no session token')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is authenticated and tries to access login/signup, redirect to dashboard
  if (sessionToken && (pathname === '/login' || pathname === '/signup')) {
    console.log('✅ User already authenticated, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and API routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).+)",
  ],
}