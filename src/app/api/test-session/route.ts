import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    console.log('🧪 Testing manual session creation for userId:', userId)

    // Create a manual session
    const session = await prisma.session.create({
      data: {
        userId: userId,
        sessionToken: `manual_test_${Date.now()}`,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        user: true
      }
    })

    console.log('✅ Manual session created:', session)

    // Try to find the session
    const foundSession = await prisma.session.findUnique({
      where: { id: session.id },
      include: { user: true }
    })

    console.log('✅ Session found:', foundSession)

    return NextResponse.json({
      success: true,
      session: session,
      foundSession: foundSession,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Manual session creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}