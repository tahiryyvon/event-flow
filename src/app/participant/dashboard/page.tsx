"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string | null
  isMultiDay: boolean
  maxCapacity: number | null
  registrationDeadline: Date | null
  organizer: {
    name: string
  }
  _count: {
    bookings: number
  }
}

interface Booking {
  id: string
  participantName: string
  participantEmail: string
  createdAt: Date
  event: Event
}

export default function ParticipantDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"bookings" | "available">("bookings")

  useEffect(() => {
    if (status === "loading") return // Still loading
    
    if (!session) {
      router.push("/login")
      return
    }
    
    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      // Fetch user's bookings
      const bookingsResponse = await fetch("/api/participant/bookings")
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
      }

      // Fetch available events
      const eventsResponse = await fetch("/api/events")
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatEventDate = (event: Event) => {
    if (event.isMultiDay) {
      return `${new Date(event.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${new Date(event.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    } else {
      return new Date(event.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                EventFlow
              </Link>
              <div className="ml-10 flex space-x-8">
                <span className="text-gray-900 px-3 py-2 text-sm font-medium">
                  Participant Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{session?.user?.name}</div>
                  <div className="text-gray-500">{session?.user?.email}</div>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}</h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("available")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "available"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Available Events ({events.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "bookings" ? (
            <div>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven&apos;t booked any events yet. Browse available events to get started.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab("available")}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Events
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {booking.event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Organized by {booking.event.organizer.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          <strong>Date:</strong> {formatEventDate(booking.event)}
                        </p>
                        {!booking.event.isMultiDay && (
                          <p className="text-sm text-gray-500 mb-2">
                            <strong>Time:</strong> {booking.event.startTime}
                            {booking.event.endTime && ` - ${booking.event.endTime}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mb-4">
                          <strong>Booked on:</strong>{" "}
                          {new Date(booking.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                          <Link
                            href={`/book/${booking.event.id}`}
                            className="text-sm text-blue-600 hover:text-blue-900"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no events available for booking.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {events.map((event) => {
                    const isEventFull = event.maxCapacity && event._count.bookings >= event.maxCapacity
                    const isRegistrationClosed = event.registrationDeadline && 
                      new Date(event.registrationDeadline) < new Date()
                    const canBook = !isEventFull && !isRegistrationClosed

                    return (
                      <div
                        key={event.id}
                        className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            by {event.organizer.name}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mb-2">
                            <strong>Date:</strong> {formatEventDate(event)}
                          </p>
                          {!event.isMultiDay && (
                            <p className="text-sm text-gray-500 mb-2">
                              <strong>Time:</strong> {event.startTime}
                              {event.endTime && ` - ${event.endTime}`}
                            </p>
                          )}
                          {event.maxCapacity && (
                            <p className="text-sm text-gray-500 mb-3">
                              <strong>Capacity:</strong> {event._count.bookings}/{event.maxCapacity}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            <div>
                              {event.isMultiDay && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                  Multi-day
                                </span>
                              )}
                              {isEventFull && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Full
                                </span>
                              )}
                              {isRegistrationClosed && !isEventFull && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Registration Closed
                                </span>
                              )}
                            </div>
                            <Link
                              href={`/book/${event.id}`}
                              className={`text-sm ${
                                canBook
                                  ? "text-blue-600 hover:text-blue-900"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {canBook ? "Book Now →" : "View Details →"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}