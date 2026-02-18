'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardRedirect() {
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    if (hasRedirected) return

    const checkAuthAndRedirect = async () => {
      try {
        setDebugInfo('Checking authentication status...')
        
        // Use our auth-status API instead of useSession
        const response = await fetch('/api/auth-status', {
          credentials: 'include' // Important for cookies
        })
        
        if (!response.ok) {
          throw new Error(`API response: ${response.status}`)
        }
        
        const authData = await response.json()
        
        console.log('🔍 DashboardRedirect: Auth API response', authData)
        setDebugInfo(`Auth check result: ${authData.authenticated}`)
        
        if (authData.authenticated) {
          const dashboardPath = '/dashboard'
          
          console.log('🔀 DashboardRedirect: Navigating to', dashboardPath)
          setDebugInfo(`Redirecting to ${dashboardPath}...`)
          setHasRedirected(true)
          
          // Add a small delay to ensure session is fully established
          setTimeout(() => {
            router.replace(dashboardPath)
          }, 500)
          router.replace('/login?error=no_role')
          
        } else {
          console.log('🔀 DashboardRedirect: User not authenticated, going to login')
          setDebugInfo('User not authenticated')
          setHasRedirected(true)
          router.replace('/login')
        }
        
      } catch (error) {
        console.error('❌ DashboardRedirect: Auth check failed', error)
        setDebugInfo(`Auth check failed: ${error}`)
        
        // Wait a bit and try again, or redirect to login
        setTimeout(() => {
          setHasRedirected(true)
          router.replace('/login?error=auth_check_failed')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    // Add a small initial delay to let the session establish
    setTimeout(checkAuthAndRedirect, 1000)
    
  }, [router, hasRedirected])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {loading ? 'Checking your session...' : 'Redirecting to your dashboard...'}
        </p>
        <p className="text-xs text-gray-400 mt-2">{debugInfo}</p>
      </div>
    </div>
  )
}