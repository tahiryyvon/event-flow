import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Count all records in each table
    const counts = {
      users: await prisma.user.count(),
      accounts: await prisma.account.count(),
      sessions: await prisma.session.count(),
      events: await prisma.event.count(),
      bookings: await prisma.booking.count(),
    }

    const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0)
    const isEmpty = totalRecords === 0

    return NextResponse.json({
      status: isEmpty ? 'clean' : 'has_data',
      message: isEmpty ? 'Database is clean and ready for testing!' : 'Database contains existing data',
      counts,
      totalRecords,
      testingFlow: [
        '🔹 Step 1: Register as Organizer with email/password',
        '🔹 Step 2: Create an event in organizer dashboard',
        '🔹 Step 3: Copy the public booking link',
        '🔹 Step 4: Register as Participant (different email)',
        '🔹 Step 5: Book the event using the public link',
        '🔹 Step 6: Test Google OAuth with both roles',
        '🔹 Step 7: Test account linking (Google + credentials)',
        '🔹 Step 8: Verify email notifications work'
      ],
      urls: {
        home: 'http://localhost:3001',
        signup: 'http://localhost:3001/signup',
        login: 'http://localhost:3001/login',
        organizerDashboard: 'http://localhost:3001/organizer/dashboard',
        participantDashboard: 'http://localhost:3001/participant/dashboard',
        createEvent: 'http://localhost:3001/organizer/events/create',
        testEmail: 'http://localhost:3001/api/test-email'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check database status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}