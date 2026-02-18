import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Debug event creation API called')
    
    const session = await auth()
    console.log('🧪 Session:', session ? { id: session.user.id } : null)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log('🧪 Request body:', body)

    // Test simple event creation
    const testEvent = {
      title: "Test Event",
      description: "A test event",
      type: "PUBLIC" as const,
      startDate: new Date('2026-02-20'),
      endDate: new Date('2026-02-20'),
      startTime: new Date('2026-02-20T10:00:00'),
      endTime: new Date('2026-02-20T11:00:00'),
      isMultiDay: false,
      maxCapacity: null,
      registrationDeadline: null,
      organizerId: session.user.id,
    }

    console.log('🧪 Creating event with data:', testEvent)

    const event = await prisma.event.create({
      data: testEvent
    })

    console.log('🧪 Event created successfully:', event)

    return NextResponse.json({
      success: true,
      event: event,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Debug event creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}