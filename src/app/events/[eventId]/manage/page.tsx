'use client'

import { useState, useEffect, useCallback, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CopyLinkButton from "@/components/CopyLinkButton"
import { 
  CalendarDays,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  Edit,
  Trash2,
  Download,
  Mail
} from "lucide-react"

interface EventData {
  id: string
  title: string
  description: string | null
  banner: string | null
  type: 'PRIVATE' | 'PUBLIC'
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  isMultiDay: boolean
  maxCapacity: number | null
  registrationDeadline: string | null
  organizer: {
    name: string | null
    email: string
  }
  bookings: {
    id: string
    participantName: string
    participantEmail: string
    createdAt: string
  }[]
}

export default function ManageEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && session) {
      fetchEventData()
    }
  }, [status, session, eventId, router])

  // Action handlers
  const handleEditEvent = () => {
    router.push(`/events/${eventId}/edit`)
  }

  const handleDownloadAttendees = () => {
    if (!event || event.bookings.length === 0) {
      alert('No attendees to download.')
      return
    }

    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Registration Date'],
      ...event.bookings.map(booking => [
        booking.participantName,
        booking.participantEmail,
        new Date(booking.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${event.title}-attendees.csv`
    link.click()
  }

  const handleEmailAttendees = () => {
    if (!event || event.bookings.length === 0) {
      alert('No attendees to email.')
      return
    }

    const emails = event.bookings.map(booking => booking.participantEmail).join(',')
    const subject = encodeURIComponent(`Update regarding: ${event.title}`)
    const body = encodeURIComponent(`Dear attendees,\n\nI hope this email finds you well.\n\nI wanted to provide you with an important update regarding the upcoming event "${event.title}" scheduled for ${new Date(event.startDate).toLocaleDateString()}.\n\n[Please add your update here]\n\nThank you for your attention.\n\nBest regards,\n${event.organizer.name || 'Event Organizer'}`)
    
    window.open(`mailto:${emails}?subject=${subject}&body=${body}`)
  }

  const handleCancelEvent = () => {
    if (window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      // TODO: Implement event cancellation
      alert('Event cancellation functionality will be implemented soon.')
    }
  }

  const fetchEventData = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (response.ok) {
        const eventData = await response.json()
        setEvent(eventData)
      } else if (response.status === 404) {
        setError('Event not found')
      } else if (response.status === 403) {
        setError('You do not have permission to manage this event')
      } else {
        setError('Failed to load event data')
      }
    } catch (err) {
      setError('Failed to load event data')
      console.error('Error fetching event:', err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Event not found'}
          </h1>
          <Link 
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const bookingUrl = `${window.location.origin}/book/${event.id}`

  // Calculate event statistics
  const totalBookings = event.bookings.length
  const availableSpots = event.maxCapacity ? event.maxCapacity - totalBookings : null
  const isEventFull = event.maxCapacity && totalBookings >= event.maxCapacity
  const isPastEvent = new Date(event.startTime) < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href={`/book/${event.id}`}
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600 mt-2">
              Manage your event and view registrations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Event Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Event Overview</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={event.type === 'PUBLIC' ? 'default' : 'secondary'}>
                      {event.type} EVENT
                    </Badge>
                    {isPastEvent && (
                      <Badge variant="outline" className="text-gray-500">
                        PAST EVENT
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Banner Image */}
                {(event as any).banner && (
                  <div className="relative w-full mb-6 rounded-lg overflow-hidden bg-gray-100">
                    <Image 
                      src={(event as any).banner} 
                      alt={event.title}
                      width={800}
                      height={450}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {event.description && (
                  <p className="text-gray-700 mb-6">{event.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarDays className="h-5 w-5 mr-3 text-indigo-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {event.isMultiDay ? (
                            <>
                              {new Date(event.startDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })} - {new Date(event.endDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
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
                        <div className="text-sm text-gray-500">
                          {new Date(event.startTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - {new Date(event.endTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3 text-indigo-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {totalBookings} registered
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.maxCapacity 
                            ? `${availableSpots} spots remaining` 
                            : "Unlimited capacity"
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {event.registrationDeadline && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-3 text-indigo-600" />
                        <div>
                          <div className="font-medium text-gray-900">Registration Deadline</div>
                          <div className="text-sm text-gray-500">
                            {new Date(event.registrationDeadline).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/events/${event.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Event
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => {
                    // Export attendees to CSV
                    const csvContent = [
                      ['Name', 'Email', 'Registration Date'],
                      ...event.bookings.map(booking => [
                        booking.participantName,
                        booking.participantEmail,
                        new Date(booking.createdAt).toLocaleDateString()
                      ])
                    ].map(row => row.join(',')).join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${event.title}-attendees.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Attendees
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const emails = event.bookings.map(b => b.participantEmail).join(';');
                    const subject = `Update regarding: ${event.title}`;
                    const body = `Hi everyone,\n\nI hope this message finds you well. I wanted to reach out regarding the upcoming event "${event.title}" scheduled for ${new Date(event.startDate).toLocaleDateString()}.\n\n[Your update message here]\n\nBest regards,\n${event.organizer.name}`;
                    window.open(`mailto:?bcc=${emails}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Attendees
                  </Button>
                  {!isPastEvent && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel "${event.title}"? This action cannot be undone and will notify all attendees.`)) {
                          // TODO: Implement event cancellation
                          alert('Event cancellation functionality will be implemented soon!');
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Event
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Registrations Card */}
            <Card>
              <CardHeader>
                <CardTitle>Registrations ({totalBookings})</CardTitle>
                <CardDescription>
                  People who have registered for your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {event.bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
                    <p className="text-gray-600 mb-4">
                      Share your event link to start getting registrations
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {event.bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{booking.participantName}</h4>
                          <p className="text-sm text-gray-600">{booking.participantEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Registered {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            
            {/* Share Event Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Event</CardTitle>
                <CardDescription>
                  Share your event link with others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Public Event URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={bookingUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-md text-sm"
                      />
                      <CopyLinkButton url={bookingUrl} />
                    </div>
                  </div>
                  <Link 
                    href={`/book/${event.id}`}
                    target="_blank"
                    className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 inline" />
                    Preview Public Page
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Event Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Registrations</span>
                    <span className="font-semibold text-gray-900">{totalBookings}</span>
                  </div>
                  {event.maxCapacity && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Available Spots</span>
                        <span className="font-semibold text-gray-900">{availableSpots}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Capacity Used</span>
                        <span className="font-semibold text-gray-900">
                          {Math.round((totalBookings / event.maxCapacity) * 100)}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            isEventFull ? 'bg-red-500' : 'bg-indigo-600'
                          }`}
                          style={{ 
                            width: `${Math.min((totalBookings / event.maxCapacity) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Event Status</span>
                    <Badge variant={isPastEvent ? 'outline' : 'default'}>
                      {isPastEvent ? 'Completed' : 'Active'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleEditEvent}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleDownloadAttendees}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Attendee List
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleEmailAttendees}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Update to Attendees
                  </Button>
                  {!isPastEvent && (
                    <Button 
                      variant="secondary" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleCancelEvent}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Event
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}