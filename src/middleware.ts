import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/api/auth"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Booking pages are public
  if (pathname.startsWith("/book/")) {
    return NextResponse.next()
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to appropriate dashboard if accessing root while authenticated
  if (pathname === "/" && session.user) {
    if (session.user.role === "ORGANIZER") {
      return NextResponse.redirect(new URL("/organizer/dashboard", request.url))
    } else if (session.user.role === "PARTICIPANT") {
      return NextResponse.redirect(new URL("/participant/dashboard", request.url))
    }
  }

  // Protect organizer routes
  if (pathname.startsWith("/organizer")) {
    if (session.user.role !== "ORGANIZER") {
      if (session.user.role === "PARTICIPANT") {
        return NextResponse.redirect(new URL("/participant/dashboard", request.url))
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protect participant routes
  if (pathname.startsWith("/participant")) {
    if (session.user.role !== "PARTICIPANT") {
      if (session.user.role === "ORGANIZER") {
        return NextResponse.redirect(new URL("/organizer/dashboard", request.url))
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}