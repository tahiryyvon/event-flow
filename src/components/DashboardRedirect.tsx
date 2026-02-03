'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'authenticated' && session?.user?.role) {
      const dashboardPath = session.user.role === 'ORGANIZER' 
        ? '/organizer/dashboard' 
        : '/participant/dashboard'
      
      console.log('🔀 DashboardRedirect: Navigating to', dashboardPath)
      router.push(dashboardPath)
    } else if (status === 'unauthenticated') {
      console.log('🔀 DashboardRedirect: User not authenticated, going to login')
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-700"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}