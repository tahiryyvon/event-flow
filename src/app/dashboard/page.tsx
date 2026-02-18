'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Calendar, 
  Users, 
  Search,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string | null
  banner: string | null // Add banner field
  type: 'PRIVATE' | 'PUBLIC'
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  isMultiDay: boolean
  maxCapacity: number | null
  registrationDeadline?: string | null
  bookingCount?: number // Add booking count for public events
  organizer: {
    name: string | null
    email: string
  }
  bookings: {
    id: string
    participantName: string
    participantEmail: string
  }[]
}

interface Booking {
  id: string
  participantName: string
  participantEmail: string
  createdAt: string
  event: {
    id: string
    title: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    type: 'PRIVATE' | 'PUBLIC'
    organizer: {
      name: string | null
      email: string
    }
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [publicEvents, setPublicEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'my-events' | 'my-bookings' | 'find-events'>('overview')

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('📊 Fetching dashboard data for user:', session?.user?.id)
      
      // Fetch events created by this user
      const eventsResponse = await fetch(`/api/events?organizerId=${session?.user?.id}`)
      console.log('📊 Events response status:', eventsResponse.status)
      
      if (eventsResponse.ok) {
        const events = await eventsResponse.json()
        console.log('📊 Fetched events:', events.length)
        setMyEvents(events)
      } else {
        console.error('📊 Failed to fetch events:', eventsResponse.status, eventsResponse.statusText)
      }

      // Fetch bookings made by this user
      const bookingsResponse = await fetch(`/api/bookings?userId=${session?.user?.id}`)
      console.log('📊 Bookings response status:', bookingsResponse.status)
      
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json()
        console.log('📊 Fetched bookings:', bookings.length)
        setMyBookings(bookings)
      } else {
        console.error('📊 Failed to fetch bookings:', bookingsResponse.status, bookingsResponse.statusText)
      }
    } catch (error) {
      console.error('📊 Error fetching dashboard data:', error)
    } finally {
      console.log('📊 Dashboard data fetch completed, setting loading to false')
      setLoading(false)
    }
  }, [session?.user?.id])

  // Search public events function
  const searchPublicEvents = useCallback(async (query: string) => {
    setSearchLoading(true)
    try {
      const response = await fetch(`/api/events/public?q=${encodeURIComponent(query)}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setPublicEvents(data.events)
      } else {
        console.error('Failed to search events:', response.status)
        setPublicEvents([])
      }
    } catch (error) {
      console.error('Error searching events:', error)
      setPublicEvents([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
  }

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      searchPublicEvents(searchQuery.trim())
    } else {
      // Load all public events if no query
      searchPublicEvents('')
    }
  }

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }

  // Load initial public events when find-events tab is active
  useEffect(() => {
    if (activeTab === 'find-events' && publicEvents.length === 0 && !searchLoading) {
      searchPublicEvents('')
    }
  }, [activeTab, publicEvents.length, searchLoading, searchPublicEvents])

  useEffect(() => {
    console.log('📊 Dashboard useEffect triggered:', { status, userId: session?.user?.id })
    
    if (status === 'loading') {
      console.log('📊 Auth status still loading, waiting...')
      return // Wait for auth status to be determined
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      console.log('📊 User authenticated, fetching dashboard data')
      fetchDashboardData()
    } else {
      console.log('📊 User not authenticated or no user ID, stopping loading')
      // If not authenticated or no user ID, stop loading
      setLoading(false)
    }
  }, [status, session?.user?.id, fetchDashboardData])

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(date)
    const timeDate = new Date(time)
    return {
      date: eventDate.toLocaleDateString(),
      time: timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to EventFlow!
              </h1>
              <p className="text-gray-600 mt-1">
                Thanks for being here. What can we help you with first?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Find an experience
              </button>
              <button
                onClick={() => setActiveTab('my-events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-events'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Organize an event
              </button>
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-bookings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-700 hover:border-gray-300'
                }`}
              >
                Find my tickets
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Search className="h-5 w-5 text-gray-700" />
                  Find an experience
                </CardTitle>
                <CardDescription>
                  Discover and join events happening around you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="Search for events..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyPress={handleSearchKeyPress}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button onClick={handleSearchClick} disabled={searchLoading}>
                      {searchLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Browse public events, workshops, and meetups
                  </p>

                  {/* Search Results */}
                  {activeTab === 'find-events' && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {searchQuery ? `Search results for "${searchQuery}"` : 'Available Public Events'}
                      </h3>
                      
                      {searchLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <span className="ml-2 text-gray-600">Searching events...</span>
                        </div>
                      ) : publicEvents.length > 0 ? (
                        <div className="space-y-4">
                          {publicEvents.map((event) => (
                            <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  {event.description && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      {new Date(event.startDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-gray-500" />
                                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {event.maxCapacity && (
                                      <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-gray-500" />
                                        {(event as any).bookingCount || 0}/{event.maxCapacity}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="default" className="text-xs">PUBLIC</Badge>
                                    {event.organizer.name && (
                                      <span className="text-xs text-gray-600">by {event.organizer.name}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Link
                                    href={`/book/${event.id}`}
                                    className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                                  >
                                    Join Event
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchQuery ? 'No events found' : 'No public events available'}
                          </h3>
                          <p className="text-gray-600">
                            {searchQuery 
                              ? 'Try different search terms or browse all events.'
                              : 'Check back later for new events or create your own!'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="h-5 w-5 text-gray-700" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Events Created</span>
                    <span className="font-semibold">{myEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Events Attended</span>
                    <span className="font-semibold">{myBookings.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'my-events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Organize an event</h2>
              <Link href="/events/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              </Link>
            </div>

            {myEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-600 mb-4">Create your first event to get started</p>
                  <Link href="/events/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map((event) => {
                  const startDateTime = formatDateTime(event.startDate, event.startTime)
                  const endDateTime = formatDateTime(event.endDate, event.endTime)

                  return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow overflow-hidden">
                      {/* Banner Image */}
                      {event.banner && (
                        <div className="relative aspect-[16/9] w-full">
                          <Image 
                            src={event.banner} 
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20"></div>
                          <Badge 
                            variant={event.type === 'PUBLIC' ? 'default' : 'secondary'}
                            className="absolute top-3 right-3 z-10"
                          >
                            {event.type}
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                          {!event.banner && (
                            <Badge variant={event.type === 'PUBLIC' ? 'default' : 'secondary'}>
                              {event.type}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {event.description || 'No description provided'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {startDateTime.date} at {startDateTime.time}
                              {event.isMultiDay && ` - ${endDateTime.date} at ${endDateTime.time}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.bookings.length} registered
                              {event.maxCapacity && ` / ${event.maxCapacity} max`}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Link href={`/events/${event.id}/manage`}>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </Link>
                          <Link href={`/book/${event.id}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find my tickets</h2>

            {myBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                  <p className="text-gray-600 mb-4">Book your first event to see your tickets here</p>
                  <Button onClick={() => setActiveTab('overview')}>
                    Find Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => {
                  const startDateTime = formatDateTime(booking.event.startDate, booking.event.startTime)

                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.event.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Organized by {booking.event.organizer.name || booking.event.organizer.email}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{startDateTime.date} at {startDateTime.time}</span>
                              </div>
                              <Badge variant={booking.event.type === 'PUBLIC' ? 'default' : 'secondary'}>
                                {booking.event.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Booked on {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {booking.participantName}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}