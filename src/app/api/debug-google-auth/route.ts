import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({
        status: 'not_authenticated',
        message: 'No active session found'
      })
    }

    // Get full user data from database
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        accounts: true, // Include linked accounts
        organizedEvents: true,
        bookings: true
      }
    })

    return NextResponse.json({
      status: 'authenticated',
      session: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      },
      database_user: dbUser ? {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        created_at: dbUser.createdAt,
        accounts: dbUser.accounts.map(acc => ({
          provider: acc.provider,
          type: acc.type
        })),
        events_count: dbUser.organizedEvents.length,
        bookings_count: dbUser.bookings.length
      } : null,
      troubleshooting: {
        session_strategy: 'database',
        oauth_callback_url: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        environment: {
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Missing'
        }
      }
    })
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}