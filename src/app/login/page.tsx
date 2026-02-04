"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log('🔐 Starting login process...', { email })

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Handle redirect manually
      })

      console.log('🔐 SignIn result:', result)

      if (result?.error) {
        console.error('❌ Login failed:', result.error)
        setError("Invalid email or password")
        return
      }

      if (result?.ok) {
        console.log('✅ Login successful, getting session...')
        
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Get fresh session data using getSession
        const session = await getSession()
        console.log('👤 Session data:', session)

        if (session?.user?.role) {
          const redirectPath = session.user.role === 'ORGANIZER' 
            ? '/organizer/dashboard' 
            : '/participant/dashboard'
          
          console.log(`🔀 Redirecting to: ${redirectPath}`)
          
          // Use router.push with replace to ensure navigation
          router.push(redirectPath)
          router.refresh() // Force refresh to ensure session is recognized
        } else {
          console.error('❌ No role found in session')
          setError('Authentication failed. Please try again.')
        }
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`)
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/signup"
              className="font-medium text-primary-700 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              create a new account
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
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Email address"
                style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Password"
                style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}