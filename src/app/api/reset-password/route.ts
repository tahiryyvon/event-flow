import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword } = body

    console.log('🔧 Password reset for:', email)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log('✅ Password updated for:', email)

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}