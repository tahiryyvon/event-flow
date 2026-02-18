"use client"

import { useState } from "react"

export default function LoginTestPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Test with debug API first
      const debugResponse = await fetch("/api/debug-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      const debugResult = await debugResponse.json()
      
      setResult({
        debug: debugResult,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Login Debug Test</h1>
        
        <form onSubmit={testLogin} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Login"}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Debug Results</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}