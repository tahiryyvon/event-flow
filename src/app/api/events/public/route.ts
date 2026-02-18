import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50) // Max 50 results

    // Build where conditions
    const whereConditions: any = {
      type: 'PUBLIC', // Only public events
      startDate: {
        gte: new Date(), // Only future events
      },
    }

    // Add search query if provided
    if (query.trim()) {
      whereConditions.OR = [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ]
    }

    const events = await prisma.event.findMany({
      where: whereConditions,
      select: {
        id: true,
        title: true,
        description: true,
        banner: true,
        type: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
        isMultiDay: true,
        maxCapacity: true,
        registrationDeadline: true,
        organizer: {
          select: {
            name: true,
            email: false, // Don't expose organizer email publicly
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: [
        {
          startDate: 'asc',
        },
        {
          startTime: 'asc',
        },
      ],
      take: limit,
    })

    // Transform the results to include booking count
    const transformedEvents = events.map(event => ({
      ...event,
      bookingCount: event._count.bookings,
      _count: undefined, // Remove the _count field
    }))

    return NextResponse.json({
      events: transformedEvents,
      total: transformedEvents.length,
      hasMore: transformedEvents.length === limit,
    })
  } catch (error) {
    console.error("Search public events error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}