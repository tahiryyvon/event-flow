import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

async function getEventWithBooking(eventId: string) {
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

function generateICSFile(event: any) {
  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventFlow//EventFlow//EN
BEGIN:VEVENT
UID:${event.id}@eventflow
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
ORGANIZER;CN=${event.organizer.name}:mailto:${event.organizer.email}
END:VEVENT
END:VCALENDAR`

  return icsContent
}

export default async function BookingConfirmedPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const event = await getEventWithBooking(eventId)

  if (!event) {
    notFound()
  }

  const icsFile = generateICSFile(event)
  const icsBlob = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsFile)}`

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
          <div className="bg-white rounded-lg shadow p-8 text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h2>

            <p className="text-gray-600 mb-8">
              Your booking for <strong>{event.title}</strong> has been confirmed.
            </p>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Event Details:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Organizer:</span> {event.organizer.name}
                </div>
                <div>
                  <span className="font-medium">
                    {event.isMultiDay ? "Dates:" : "Date:"}
                  </span>{" "}
                  {event.isMultiDay ? (
                    `${new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })} - ${new Date(event.endDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  ) : (
                    new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  )}
                </div>
                <div>
                  <span className="font-medium">
                    {event.isMultiDay ? "Daily Hours:" : "Time:"}
                  </span>{" "}
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
                {event.description && (
                  <div>
                    <span className="font-medium">Description:</span> {event.description}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <a
                href={icsBlob}
                download={`${event.title.replace(/\s+/g, '_')}.ics`}
                className="block w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add to Calendar
              </a>
              
              <p className="text-xs text-gray-500">
                A confirmation email will be sent to you shortly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}