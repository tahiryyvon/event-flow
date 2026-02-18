'use client'

import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectDebugPage() {
  const { data: session, status } = useSession()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [testResult, setTestResult] = useState('')
  const router = useRouter()

  const checkSession = async () => {
    try {
      const response = await fetch('/api/session-debug')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const testLogin = async () => {
    setTestResult('Testing login...')
    try {
      const result = await signIn('credentials', {
        email: 'test@example.com',
        password: 'password',
        callbackUrl: '/dashboard',
        redirect: false
      })
      setTestResult(`Login result: ${JSON.stringify(result)}`)
    } catch (error) {
      setTestResult(`Login error: ${error}`)
    }
  }

  const manualRedirect = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Login Redirect Debug</h1>
        
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current Session Status</h2>
            
            <div className="space-y-2 mb-4">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Role:</strong> N/A</p>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={checkSession}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Check Session Details
              </button>
              
              <button
                onClick={manualRedirect}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Try Manual Redirect to Dashboard
              </button>
            </div>
          </div>

          {debugInfo && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Session Debug Info</h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded ${debugInfo.authenticated ? 'bg-green-50' : 'bg-red-50'}`}>
                  <h3 className="font-semibold">Authentication Status</h3>
                  <p>Authenticated: {debugInfo.authenticated ? '✅ Yes' : '❌ No'}</p>
                  {debugInfo.session && (
                    <div className="mt-2 text-sm">
                      <p>Email: {debugInfo.session.user.email}</p>
                      <p>Role: N/A</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Cookies Found</h3>
                  <p>Total cookies: {debugInfo.cookies?.total}</p>
                  <p>Auth-related cookies: {debugInfo.cookies?.authRelated?.length || 0}</p>
                  
                  {debugInfo.cookies?.authRelated?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Auth cookies:</p>
                      <ul className="text-sm list-disc list-inside">
                        {debugInfo.cookies.authRelated.map((cookie: any, index: number) => (
                          <li key={index}>{cookie.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <details>
                  <summary className="cursor-pointer font-semibold">Raw Debug Data</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debugging Steps:</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
              <li>First, try logging in normally at <a href="/login" className="underline">/login</a></li>
              <li>If redirected back to login, come back here and click &quot;Check Session Details&quot;</li>
              <li>Look at the authentication status and cookies</li>
              <li>Try &quot;Manual Redirect to Dashboard&quot; to see if the issue is with the redirect itself</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">🔧 Recent Fixes Applied:</h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Temporarily disabled middleware protection for /dashboard</li>
              <li>Enhanced cookie detection in middleware</li>
              <li>Improved redirect callback logic</li>
              <li>Added comprehensive session debugging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}