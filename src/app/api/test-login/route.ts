import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🧪 Test login API called with:', { email })

    // Try to sign in using NextAuth directly
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    console.log('🧪 Direct signIn result:', result)

    return NextResponse.json({
      success: !!result,
      result: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Test login error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}