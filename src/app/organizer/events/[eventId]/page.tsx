import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import CopyLinkButton from "@/components/CopyLinkButton"

async function getEventWithBookings(eventId: string, organizerId: string) {
  return await prisma.event.findFirst({
    where: {
      id: eventId,
      organizerId,
    },
    include: {
      bookings: {
        orderBy: {
          createdAt: "desc",
        },
      },
      organizer: true,
    },
  })
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const event = await getEventWithBookings(eventId, session.user.id)

  if (!event) {
    notFound()
  }

  const bookingUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/book/${event.id}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                EventFlow
              </Link>
              <nav className="ml-10">
                <Link
                  href="/organizer/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/organizer/dashboard"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {event.title}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Event Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Event Type</h3>
                    <div className="mt-1 flex items-center">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        event.type === 'PRIVATE' 
                          ? 'bg-gray-100 text-gray-800 border border-gray-300' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {event.type === 'PRIVATE' ? '🔒 Private Event' : '🌐 Public Event'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.type === 'PRIVATE' 
                        ? 'Only you can see this event and manually add participants'
                        : 'Anyone with the link can view and book this event'
                      }
                    </p>
                  </div>
                  
                  {event.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Description</h3>
                      <p className="mt-1 text-gray-900">{event.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      {event.isMultiDay ? "Dates & Daily Hours" : "Date & Time"}
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {event.isMultiDay ? (
                        <>
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                          <br />
                          Daily: {new Date(event.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          to{" "}
                          {new Date(event.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      ) : (
                        <>
                          {new Date(event.startDate).toLocaleDateString()} from{" "}
                          {new Date(event.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          to{" "}
                          {new Date(event.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </>
                      )}
                    </p>
                  </div>

                  {event.maxCapacity && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Capacity</h3>
                      <p className="mt-1 text-gray-900">
                        {event.bookings.length} / {event.maxCapacity} participants
                        {event.bookings.length >= event.maxCapacity && (
                          <span className="ml-2 text-red-600 text-sm font-medium">
                            (Full)
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {event.registrationDeadline && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Registration Deadline</h3>
                      <p className="mt-1 text-gray-900">
                        {new Date(event.registrationDeadline).toLocaleString()}
                        {new Date() > new Date(event.registrationDeadline) && (
                          <span className="ml-2 text-red-600 text-sm font-medium">
                            (Expired)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Participants ({event.bookings.length}
                  {event.maxCapacity && ` / ${event.maxCapacity}`})
                </h2>
                
                {event.bookings.length === 0 ? (
                  <p className="text-gray-500">No participants yet.</p>
                ) : (
                  <div className="space-y-3">
                    {event.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.participantName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.participantEmail}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Booked {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking Link
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Share this link with people you want to attend your event:
                </p>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <code className="text-sm text-gray-800 break-all">
                    {bookingUrl}
                  </code>
                </div>
                <CopyLinkButton
                  url={bookingUrl}
                  className="mt-3 w-full text-white px-4 py-2 rounded-lg text-sm font-medium"
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <Link
                    href={bookingUrl}
                    target="_blank"
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Preview Booking Page
                  </Link>
                  <button className="block w-full text-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Cancel Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}