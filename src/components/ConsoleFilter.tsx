'use client'

import { useEffect } from 'react'

export default function ConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Store original console methods
      const originalWarn = console.warn
      const originalError = console.error

      // Filter console warnings from external sources
      console.warn = (...args) => {
        const message = args[0]
        
        // Suppress external Zustand deprecation warnings
        if (
          typeof message === 'string' && 
          message.includes('DEPRECATED') && 
          message.includes('zustand')
        ) {
          return // Skip this warning
        }
        
        // Allow all other warnings
        originalWarn.apply(console, args)
      }

      // Filter console errors from extensions
      console.error = (...args) => {
        const message = args[0]
        
        // Suppress browser extension errors
        if (
          typeof message === 'string' && 
          (message.includes('Extension') || message.includes('injected.js'))
        ) {
          return // Skip extension errors
        }
        
        // Allow all other errors
        originalError.apply(console, args)
      }

      // Cleanup on unmount
      return () => {
        console.warn = originalWarn
        console.error = originalError
      }
    }
  }, [])

  return null // This component doesn't render anything
}