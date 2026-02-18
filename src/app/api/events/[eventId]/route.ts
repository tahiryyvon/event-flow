import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await params

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizerId: session.user.id, // Only allow access to own events
      },
      include: {
        bookings: {
          orderBy: {
            createdAt: "desc",
          },
        },
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Get event error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await params
    const body = await request.json()

    const {
      title,
      description,
      type,
      isMultiDay,
      startDate,
      endDate,
      startTime,
      endTime,
      maxCapacity,
      registrationDeadline,
      banner,
    } = body

    // Validate required fields
    if (!title || !startDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if event exists and belongs to user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizerId: session.user.id,
      },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      title,
      description: description || null,
      type,
      isMultiDay,
      startDate: new Date(startDate),
      endDate: new Date(endDate || startDate),
      startTime: new Date(`${startDate}T${startTime}:00`),
      endTime: new Date(`${startDate}T${endTime}:00`),
      maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
      registrationDeadline: registrationDeadline 
        ? new Date(registrationDeadline) 
        : null,
      banner: banner || null,
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: updateData,
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Update event error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}