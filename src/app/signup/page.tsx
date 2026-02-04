"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ORGANIZER" as "ORGANIZER" | "PARTICIPANT",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError("")
    
    try {
      console.log('🔐 Starting Google sign-up...')
      const result = await signIn("google", {
        redirect: false,
      })
      
      if (result?.error) {
        console.error('❌ Google sign-up failed:', result.error)
        setError("Google sign-up failed. Please try again.")
        return
      }
      
      if (result?.ok) {
        console.log('✅ Google sign-up successful')
        // Wait for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const session = await getSession()
        console.log('👤 Google session data:', session)
        
        if (session?.user?.role) {
          // New Google users get PARTICIPANT role by default
          const redirectPath = '/participant/dashboard'
          
          console.log(`🔀 Redirecting to: ${redirectPath}`)
          router.push(redirectPath)
        }
      }
    } catch (err) {
      console.error('❌ Google sign-up error:', err)
      setError("An error occurred during Google sign-up. Please try again.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/login?message=Account created successfully")
      } else {
        setError(data.error || "An error occurred")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">EventFlow</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-primary-700 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Your full name"
                style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
                style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="At least 6 characters"
                style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="ORGANIZER"
                    checked={formData.role === "ORGANIZER"}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "ORGANIZER" })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    <strong>Organizer</strong> - I want to create and manage events
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="PARTICIPANT"
                    checked={formData.role === "PARTICIPANT"}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "PARTICIPANT" })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    <strong>Participant</strong> - I want to book events created by others
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {googleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Signing up with Google...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                  </svg>
                  Continue with Google
                </div>
              )}
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Google sign-ups automatically get Participant access. You can upgrade to Organizer later.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}