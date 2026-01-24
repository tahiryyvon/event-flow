import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createBookingSchema = z.object({
  eventId: z.string(),
  participantName: z.string().min(1, "Name is required"),
  participantEmail: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, participantName, participantEmail } = createBookingSchema.parse(body)

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if event is in the past
    const now = new Date()
    const eventStartDate = new Date(event.startDate)
    const eventStartTime = new Date(event.startTime)
    
    // For single-day events, check the full start time
    // For multi-day events, check if we're before the start date
    const isPastEvent = event.isMultiDay 
      ? eventStartDate < new Date(now.toDateString())
      : eventStartTime < now
      
    if (isPastEvent) {
      return NextResponse.json({ error: "Cannot book past events" }, { status: 400 })
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && now > new Date(event.registrationDeadline)) {
      return NextResponse.json({ 
        error: "Registration deadline has passed" 
      }, { status: 400 })
    }

    // Check if event is at maximum capacity
    if (event.maxCapacity) {
      const currentBookings = await prisma.booking.count({
        where: { eventId }
      })
      
      if (currentBookings >= event.maxCapacity) {
        return NextResponse.json({ 
          error: "Event is at maximum capacity" 
        }, { status: 400 })
      }
    }

    // Check if user has already booked
    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventId,
        participantEmail,
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked this event" },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        eventId,
        participantName,
        participantEmail,
      },
      include: {
        event: {
          include: {
            organizer: true,
          },
        },
      },
    })

    // TODO: Send confirmation email using Resend
    // await sendBookingConfirmation(booking)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Create booking error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}