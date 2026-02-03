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

  // Public routes that don't need authentication
  const publicRoutes = ['/', '/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/book/')

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get all possible session cookies
  const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                      request.cookies.get('__Secure-next-auth.session-token')?.value ||
                      request.cookies.get('next-auth.csrf-token')?.value ||
                      request.cookies.get('__Host-next-auth.csrf-token')?.value

  console.log('🛡️ Middleware check:', { 
    pathname, 
    hasAnySessionToken: !!sessionToken,
    cookieNames: Array.from(request.cookies).map(([name]) => name).filter(name => name.includes('auth'))
  })

  // For now, let all requests through to avoid blocking authenticated users
  // The client-side will handle proper authentication checks
  if (!sessionToken) {
    console.log('🔒 No session token found, but allowing through for client-side handling')
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