"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signIn, getSession } from "next-auth/react"
import { signInWithGoogle } from '@/hooks/useGoogleAuth'
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error parameters in URL
    const urlError = searchParams.get('error')
    if (urlError) {
      switch (urlError) {
        case 'no_role':
          setError('Your account exists but has no role assigned. Please contact support.')
          break
        case 'auth_check_failed':
          setError('Authentication check failed. Please try logging in again.')
          break
        case 'session_role_missing':
          setError('Session is missing role information. Please try logging in again.')
          break
        default:
          setError('An authentication error occurred.')
      }
    }
    
    // Check for success message
    const message = searchParams.get('message')
    if (message) {
      // Could show success message here if needed
      console.log('Login page message:', message)
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")
    
    try {
      // Use unified Google OAuth flow
      await signInWithGoogle('login')
      // NextAuth handles redirect automatically
    } catch (err) {
      console.error('❌ Google sign-in error:', err)
      setError(err instanceof Error ? err.message : "An error occurred during Google sign-in. Please try again.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log('🔐 Starting login process...', { email })

    try {
      // Use NextAuth with redirect: false to capture the result
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't redirect automatically so we can see the result
      })

      console.log('🔐 NextAuth signIn result:', result)

      if (result?.ok) {
        console.log('✅ Login successful, redirecting to dashboard...')
        // Manual redirect after successful login
        router.push("/dashboard")
      } else {
        console.error('❌ Login failed:', result?.error)
        setError(result?.error || "Invalid email or password")
        setLoading(false)
      }
      
    } catch (err) {
      console.error('❌ Login error:', err)
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Please try again.'}`)
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

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {googleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Signing in with Google...
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
          </div>
        </div>
      </div>
    </div>
  )
}