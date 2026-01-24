import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/api/"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Booking pages are public
  if (pathname.startsWith("/book/")) {
    return NextResponse.next()
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for session cookie (lightweight check)
  const sessionToken = request.cookies.get("next-auth.session-token") || 
                      request.cookies.get("__Secure-next-auth.session-token")

  // If no session token, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For role-based protection, we'll handle redirects on the client side
  // This keeps the middleware lightweight and Edge Runtime compatible

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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}