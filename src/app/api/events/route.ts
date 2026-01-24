import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isMultiDay: z.boolean(),
  startDate: z.string(),
  endDate: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  maxCapacity: z.string().optional(),
  registrationDeadline: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, isMultiDay, startDate, endDate, startTime, endTime, maxCapacity, registrationDeadline } = createEventSchema.parse(body)

    // Handle single-day vs multi-day events
    const eventStartDate = new Date(startDate)
    const eventEndDate = isMultiDay && endDate ? new Date(endDate) : eventStartDate
    
    // Combine date and time into proper DateTime objects for validation
    const startDateTime = new Date(`${startDate}T${startTime}:00`)
    const endDateTime = new Date(`${startDate}T${endTime}:00`)

    // Parse optional fields
    const maxCapacityNumber = maxCapacity && maxCapacity.trim() ? parseInt(maxCapacity) : null
    const registrationDeadlineDate = registrationDeadline && registrationDeadline.trim() 
      ? new Date(registrationDeadline) 
      : null

    // Validate that end time is after start time (for daily schedule)
    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { error: "Daily end time must be after start time" },
        { status: 400 }
      )
    }

    // Validate multi-day event dates
    if (isMultiDay && eventEndDate <= eventStartDate) {
      return NextResponse.json(
        { error: "End date must be after start date for multi-day events" },
        { status: 400 }
      )
    }

    // Validate max capacity
    if (maxCapacityNumber !== null && maxCapacityNumber < 1) {
      return NextResponse.json(
        { error: "Maximum capacity must be at least 1" },
        { status: 400 }
      )
    }

    // Validate registration deadline
    if (registrationDeadlineDate && registrationDeadlineDate >= startDateTime) {
      return NextResponse.json(
        { error: "Registration deadline must be before the event start time" },
        { status: 400 }
      )
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: eventStartDate,
        endDate: eventEndDate,
        startTime: startDateTime,
        endTime: endDateTime,
        isMultiDay,
        maxCapacity: maxCapacityNumber,
        registrationDeadline: registrationDeadlineDate,
        organizerId: session.user.id,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Create event error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: session.user.id,
      },
      include: {
        bookings: true,
      },
      orderBy: {
        startDate: "asc",
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Get events error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}