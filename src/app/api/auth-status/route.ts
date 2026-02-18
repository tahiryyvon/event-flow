import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    console.log('🔍 Auth-status API called')
    
    const session = await auth()
    
    console.log('🔍 Auth-status session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      email: session?.user?.email,
      role: session?.user?.role
    })
    
    const result = {
      authenticated: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      } : null,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      debug: {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasRole: !!session?.user?.role
      }
    }
    
    console.log('🔍 Auth-status returning:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Auth-status API error:', error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}