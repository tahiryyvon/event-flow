'use client'

import { useState } from 'react'

export default function LoginTroubleshootPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [debugResult, setDebugResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/debug-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const result = await response.json()
      setDebugResult(result)
    } catch (error) {
      setDebugResult({ status: 'error', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Login Troubleshoot</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Your Login Credentials</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the email you used to create the account"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login Credentials'}
            </button>
          </div>
        </div>

        {debugResult && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Results</h2>
            
            {debugResult.status === 'user_not_found' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h3 className="font-semibold text-red-800">❌ User Not Found</h3>
                <p className="text-red-700">No account exists with email: <strong>{debugResult.email}</strong></p>
                <p className="text-sm text-red-600 mt-2">
                  Make sure you&apos;re using the exact email address you used during signup.
                </p>
              </div>
            )}

            {debugResult.status === 'user_found' && (
              <div className="space-y-4">
                <div className={`border p-4 rounded ${debugResult.user.passwordValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <h3 className={`font-semibold ${debugResult.user.passwordValid ? 'text-green-800' : 'text-red-800'}`}>
                    {debugResult.user.passwordValid ? '✅ Credentials Valid' : '❌ Password Invalid'}
                  </h3>
                  <p className={debugResult.user.passwordValid ? 'text-green-700' : 'text-red-700'}>
                    {debugResult.user.passwordValid 
                      ? 'Your email and password are correct!' 
                      : 'The password you entered is incorrect.'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">👤 Account Details:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Email:</strong> {debugResult.user.email}</li>
                    <li><strong>Name:</strong> {debugResult.user.name}</li>
                    <li><strong>Role:</strong> <span className="font-semibold text-blue-600">{debugResult.user.role}</span></li>
                    <li><strong>Account Created:</strong> {new Date(debugResult.user.createdAt).toLocaleString()}</li>
                    <li><strong>Has Password:</strong> {debugResult.user.hasPassword ? '✅ Yes' : '❌ No'}</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">🔗 OAuth Accounts:</h4>
                  {debugResult.accounts.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {debugResult.accounts.map((account: any, index: number) => (
                        <li key={index}>
                          <strong>{account.provider}</strong> ({account.type})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No OAuth accounts linked</p>
                  )}
                </div>

                <div className="bg-yellow-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">🔐 Active Sessions:</h4>
                  {debugResult.sessions.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {debugResult.sessions.map((session: any, index: number) => (
                        <li key={index}>
                          Session expires: {new Date(session.expires).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No active sessions</p>
                  )}
                </div>

                {debugResult.user.passwordValid && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Next Steps:</h4>
                    <p className="text-green-700 text-sm mb-2">
                      Your credentials are valid! If you&apos;re still having trouble logging in:
                    </p>
                    <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
                      <li>Try the <a href="/login" className="underline font-semibold">regular login page</a></li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Try in an incognito/private window</li>
                      <li>The session fixes should now work properly</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {debugResult.status === 'error' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h3 className="font-semibold text-red-800">❌ Error</h3>
                <p className="text-red-700">{debugResult.error}</p>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Show Raw Debug Data
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}