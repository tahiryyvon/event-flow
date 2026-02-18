import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({
        status: 'user_not_found',
        message: 'No user found with this email',
        email: email
      })
    }

    // Check password
    const isValidPassword = user.password ? await compare(password, user.password) : false

    return NextResponse.json({
      status: 'user_found',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password,
        passwordValid: isValidPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accounts: await prisma.account.findMany({
        where: { userId: user.id },
        select: {
          provider: true,
          type: true,
          providerAccountId: true
        }
      }),
      sessions: await prisma.session.findMany({
        where: { userId: user.id },
        select: {
          expires: true,
          sessionToken: true
        }
      })
    })

  } catch (error) {
    console.error('Debug login error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}