"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PUBLIC" as "PRIVATE" | "PUBLIC",
    isMultiDay: false,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    maxCapacity: "",
    registrationDeadline: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/organizer/dashboard")
      } else {
        const data = await response.json()
        setError(data.error || "An error occurred")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/organizer/dashboard"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              Create New Event
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white placeholder-gray-500 transition-colors"
                  placeholder="e.g., Team Meeting, Client Call"
                  style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white placeholder-gray-500 transition-colors resize-vertical"
                  placeholder="Optional description of the event..."
                  style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Visibility *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventVisibility"
                      value="PUBLIC"
                      checked={formData.type === "PUBLIC"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as "PUBLIC" | "PRIVATE" })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Public Event</strong> - Anyone can view and book this event with a shareable link
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventVisibility"
                      value="PRIVATE"
                      checked={formData.type === "PRIVATE"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as "PUBLIC" | "PRIVATE" })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Private Event</strong> - Only you can see this event and manually add participants
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Duration *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      checked={!formData.isMultiDay}
                      onChange={() =>
                        setFormData({ ...formData, isMultiDay: false, endDate: formData.startDate })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Single Day Event</strong> - Event happens on one day only
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="eventType"
                      checked={formData.isMultiDay}
                      onChange={() =>
                        setFormData({ ...formData, isMultiDay: true })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      <strong>Multi-Day Event</strong> - Event spans multiple days
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    {formData.isMultiDay ? "Start Date *" : "Event Date *"}
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ 
                        ...formData, 
                        startDate: e.target.value,
                        endDate: formData.isMultiDay ? formData.endDate : e.target.value
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white transition-colors"
                    style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                  />
                </div>

                {formData.isMultiDay && (
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                      className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white transition-colors"
                      style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    {formData.isMultiDay ? "Daily Start Time *" : "Start Time *"}
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white transition-colors"
                    style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                  />
                  {formData.isMultiDay && (
                    <p className="mt-1 text-sm text-gray-500">
                      Time when the event starts each day
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    {formData.isMultiDay ? "Daily End Time *" : "End Time *"}
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white transition-colors"
                    style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                  />
                  {formData.isMultiDay && (
                    <p className="mt-1 text-sm text-gray-500">
                      Time when the event ends each day
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    id="maxCapacity"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, maxCapacity: e.target.value })
                    }
                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white placeholder-gray-500 transition-colors"
                    placeholder="Leave empty for unlimited"
                    style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum number of participants (optional)
                  </p>
                </div>

                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationDeadline: e.target.value })
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-white transition-colors"
                    style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Last date/time for registration (optional)
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/organizer/dashboard"
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}