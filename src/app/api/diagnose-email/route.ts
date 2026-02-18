import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Check user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        bookings: true,
        accounts: true
      }
    })

    // Check unlinked bookings
    const unlinkedBookings = await prisma.booking.findMany({
      where: {
        participantEmail: email,
        userId: null
      },
      include: {
        event: {
          select: {
            title: true,
            startDate: true
          }
        }
      }
    })

    // Check all bookings with this email
    const allBookings = await prisma.booking.findMany({
      where: {
        participantEmail: email
      },
      include: {
        event: {
          select: {
            title: true,
            startDate: true
          }
        }
      }
    })

    return NextResponse.json({
      email: email,
      user: user ? {
        id: user.id,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password,
        accountsCount: user.accounts.length,
        linkedBookingsCount: user.bookings.length
      } : null,
      unlinkedBookingsCount: unlinkedBookings.length,
      totalBookingsCount: allBookings.length,
      unlinkedBookings: unlinkedBookings.map(b => ({
        id: b.id,
        eventTitle: b.event.title,
        eventDate: b.event.startDate,
        createdAt: b.createdAt
      })),
      diagnosis: {
        userExists: !!user,
        hasRole: !!user?.role,
        hasUnlinkedBookings: unlinkedBookings.length > 0,
        recommendation: user 
          ? user.role 
            ? 'User account is properly set up'
            : 'User exists but needs role assignment'
          : unlinkedBookings.length > 0
            ? 'Create user account to link existing bookings'
            : 'No issues found'
      }
    })

  } catch (error) {
    console.error('❌ Diagnose email error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}