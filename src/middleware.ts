import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (pathname.startsWith("/_next/") || 
      pathname.startsWith("/api/") ||
      pathname === "/favicon.ico" ||
      pathname.includes(".")) {
    return NextResponse.next()
  }

  // Public routes
  if (pathname === "/" || 
      pathname === "/login" || 
      pathname === "/signup" || 
      pathname.startsWith("/book/")) {
    return NextResponse.next()
  }

  // Check for session token (Edge Runtime compatible)
  const sessionToken = request.cookies.get("next-auth.session-token") || 
                      request.cookies.get("__Secure-next-auth.session-token")

  if (!sessionToken?.value) {
    return NextResponse.redirect(new URL("/login", request.url))
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