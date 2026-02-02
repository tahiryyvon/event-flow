import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      } : null,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextauth_url: process.env.NEXTAUTH_URL,
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}