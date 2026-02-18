'use client'

import { signIn } from 'next-auth/react'

/**
 * Unified Google OAuth handler for both signup and login
 * This ensures consistent behavior regardless of entry point
 */
export const useGoogleAuth = () => {
  const handleGoogleAuth = async (context: 'signup' | 'login' = 'login') => {
    try {
      console.log(`🔐 Starting Google OAuth (${context})...`)
      
      // Use NextAuth's built-in redirect handling
      // This works consistently for both signup and login
      await signIn('google', {
        callbackUrl: '/dashboard', // Will redirect to role-appropriate dashboard
      })
      
      // NextAuth handles the redirect, so we don't need manual session checking
      
    } catch (error) {
      console.error(`❌ Google ${context} error:`, error)
      throw new Error(`Google ${context} failed. Please try again.`)
    }
  }

  return { handleGoogleAuth }
}

// Utility function for direct use in components
export const signInWithGoogle = (context: 'signup' | 'login' = 'login') => {
  console.log(`🔐 Starting Google OAuth (${context})...`)
  
  return signIn('google', {
    callbackUrl: '/dashboard',
  })
}