"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CalendarDays,
  Clock,
  Users,
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react'

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
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const processImageFile = (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file")
      return
    }

    setBannerFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setBannerImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setError("")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processImageFile(file)
    }
  }

  const removeBannerImage = () => {
    setBannerImage(null)
    setBannerFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const eventData = {
        ...formData,
        banner: bannerImage // Include the banner image as base64
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        router.push("/dashboard")
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
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600 mt-2">
              Set up your event details and start accepting bookings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Banner Image */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Banner Image Upload Area */}
                  <div className="aspect-[16/10] relative overflow-hidden">
                    {bannerImage ? (
                      // Show uploaded image
                      <div className="relative w-full h-full">
                        <Image 
                          src={bannerImage} 
                          alt="Event banner" 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute top-4 right-4">
                          <button
                            type="button"
                            onClick={removeBannerImage}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all backdrop-blur-sm"
                            title="Remove image"
                          >
                            <X className="h-5 w-5 text-white" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <input
                            type="file"
                            id="banner-upload-overlay"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="banner-upload-overlay"
                            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all backdrop-blur-sm cursor-pointer"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Image
                          </label>
                        </div>
                      </div>
                    ) : (
                      // Show upload area
                      <div 
                        className={`bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative overflow-hidden w-full h-full transition-all ${
                          isDragging ? 'ring-4 ring-white/50 scale-105' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                          <div className="text-center space-y-4">
                            <div className="relative">
                              <ImageIcon className={`h-16 w-16 mx-auto opacity-80 transition-transform ${
                                isDragging ? 'scale-110' : ''
                              }`} />
                              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                <Upload className="h-4 w-4 text-indigo-600" />
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold">
                              {isDragging ? 'Drop your image here!' : 'Add Event Banner'}
                            </h3>
                            <p className="text-lg opacity-90">
                              {isDragging 
                                ? 'Release to upload your banner image' 
                                : 'Upload an eye-catching image to make your event stand out'
                              }
                            </p>
                            <p className="text-sm opacity-75">
                              Supports JPG, PNG, GIF • Max 5MB • Recommended: 1600x900px
                            </p>
                            {!isDragging && (
                              <div className="pt-4">
                                <input
                                  type="file"
                                  id="banner-upload"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="banner-upload"
                                  className="inline-flex items-center px-6 py-3 border-2 border-white/30 rounded-lg text-white hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer"
                                >
                                  <Upload className="h-5 w-5 mr-2" />
                                  Choose Image
                                </label>
                                <p className="text-xs mt-2 opacity-60">
                                  or drag and drop an image here
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Event Preview */}
                  <div className="p-6 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={formData.type === 'PUBLIC' ? 'default' : 'secondary'}>
                          {formData.type} EVENT
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          {bannerImage && (
                            <div className="flex items-center text-green-600">
                              <ImageIcon className="h-4 w-4 mr-1" />
                              <span>Banner added</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Live Preview
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                          {formData.title || 'Your Event Title'}
                        </h2>
                        <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                          {formData.description || 'Your event description will appear here. Add details about what attendees can expect.'}
                        </p>
                      </div>

                      {(formData.startDate || formData.startTime) && (
                        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          <CalendarDays className="h-4 w-4 mr-2 text-indigo-600" />
                          <div>
                            {formData.startDate && (
                              <div className="font-medium">
                                {new Date(formData.startDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                                {formData.isMultiDay && formData.endDate && formData.endDate !== formData.startDate && (
                                  <span> - {new Date(formData.endDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}</span>
                                )}
                              </div>
                            )}
                            {formData.startTime && formData.endTime && (
                              <div className="text-xs text-gray-500 mt-1">
                                {formData.startTime} - {formData.endTime}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {formData.maxCapacity && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-indigo-600" />
                          <span>Limited to {formData.maxCapacity} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center text-red-600">
                      <div className="font-medium">{error}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell people what your event is about
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter a catchy title for your event"
                />
              </div>

              {/* Event Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  rows={4}
                  placeholder="Describe what attendees can expect from your event"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide details about the event, agenda, speakers, or activities
                </p>
              </div>

              {/* Event Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Visibility
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                    formData.type === "PUBLIC" 
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="PUBLIC"
                      checked={formData.type === "PUBLIC"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "PUBLIC" })}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <Eye className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          Public Event
                          <Badge variant="default" className="text-xs">Recommended</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Anyone can discover and join your event
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                    formData.type === "PRIVATE" 
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="PRIVATE"
                      checked={formData.type === "PRIVATE"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "PRIVATE" })}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <EyeOff className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Private Event</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Only people with the link can join
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date and Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Date and Time
              </CardTitle>
              <CardDescription>
                When will your event take place?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Multi-day Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isMultiDay"
                  checked={formData.isMultiDay}
                  onChange={(e) => setFormData({ ...formData, isMultiDay: e.target.checked, endDate: e.target.checked ? formData.endDate : formData.startDate })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isMultiDay" className="text-sm font-medium text-gray-700">
                  This event spans multiple days
                </label>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value, endDate: formData.isMultiDay ? formData.endDate : e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                {formData.isMultiDay && (
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Additional Settings
              </CardTitle>
              <CardDescription>
                Optional settings to customize your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Capacity */}
              <div>
                <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Capacity
                </label>
                <input
                  type="number"
                  id="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  min="1"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Leave empty for unlimited capacity"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set a limit on how many people can attend your event
                </p>
              </div>

              {/* Registration Deadline */}
              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  id="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  After this date and time, people won&apos;t be able to register
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-end space-x-3">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.startDate || !formData.startTime || !formData.endTime}
                  className="min-w-[140px]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Create Event
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
          </div>
        </div>
      </div>
    </div>
  )
}