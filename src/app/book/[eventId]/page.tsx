import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import BookingForm from "./BookingForm"
import type { Metadata } from "next"

async function getEvent(eventId: string) {
  return await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>
}): Promise<Metadata> {
  const { eventId } = await params
  const event = await getEvent(eventId)

  if (!event) {
    return {
      title: "Event Not Found - EventFlow",
      description: "The requested event could not be found.",
    }
  }

  const eventDate = new Date(event.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const title = `Book: ${event.title} - EventFlow`
  const description = `${event.description || 'Join us for this event'} • ${eventDate} • Organized by ${event.organizer.name || 'EventFlow'}`
  
  const organizerName = event.organizer.name || 'EventFlow'
  const ogImageUrl = `/api/og?title=${encodeURIComponent(event.title)}&subtitle=${encodeURIComponent(eventDate)}&description=${encodeURIComponent(organizerName)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Book ${event.title} - EventFlow`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function BookEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const event = await getEvent(eventId)

  if (!event) {
    notFound()
  }

  // Check if event is in the past
  const now = new Date()
  const eventDate = new Date(event.startTime)
  const isPastEvent = eventDate < now

  // Check if registration deadline has passed
  const isRegistrationClosed = event.registrationDeadline && now > new Date(event.registrationDeadline)

  // Check current booking count for capacity limits
  const currentBookings = await prisma.booking.count({
    where: { eventId }
  })
  const isAtCapacity = event.maxCapacity && currentBookings >= event.maxCapacity

  const canBook = !isPastEvent && !isRegistrationClosed && !isAtCapacity

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">EventFlow</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {!canBook ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isPastEvent && "Event Has Passed"}
                {isRegistrationClosed && !isPastEvent && "Registration Closed"}
                {isAtCapacity && !isPastEvent && !isRegistrationClosed && "Event is Full"}
              </h2>
              <p className="text-gray-600">
                {isPastEvent && "This event has already occurred and is no longer available for booking."}
                {isRegistrationClosed && !isPastEvent && "The registration deadline for this event has passed."}
                {isAtCapacity && !isPastEvent && !isRegistrationClosed && "This event has reached its maximum capacity."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  with {event.organizer.name}
                </p>
                
                {event.description && (
                  <p className="text-gray-700 mb-4">{event.description}</p>
                )}
                
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {event.isMultiDay ? (
                      <>
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })} - {new Date(event.endDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Multi-day
                        </span>
                      </>
                    ) : (
                      new Date(event.startDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {event.isMultiDay ? "Daily: " : ""}
                  {new Date(event.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(event.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* Capacity Information */}
                {event.maxCapacity && (
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {currentBookings} / {event.maxCapacity} participants registered
                  </div>
                )}

                {/* Registration Deadline */}
                {event.registrationDeadline && (
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 0l3 3m5-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Register by {new Date(event.registrationDeadline).toLocaleString()}
                  </div>
                )}

                <div className="mb-8"></div>
              </div>

              <BookingForm eventId={event.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}