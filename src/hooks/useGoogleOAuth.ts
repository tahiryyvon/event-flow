'use client'

import { useEffect, useState } from 'react'

export default function useGoogleOAuthEnabled() {
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Google OAuth is configured
    fetch('/api/auth/providers')
      .then(res => res.json())
      .then(providers => {
        setIsGoogleEnabled('google' in providers)
        setLoading(false)
      })
      .catch(() => {
        setIsGoogleEnabled(false)
        setLoading(false)
      })
  }, [])

  return { isGoogleEnabled, loading }
}