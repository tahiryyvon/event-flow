"use client""use client"



import { useState } from "react"import { useState } from "react"

import { signIn } from "next-auth/react"import { signIn } from "next-auth/react"

import { useRouter } from "next/navigation"import { useRouter } from "next/navigation"



export default function LoginFixPage() {export default function LoginFixPage() {

  const [email, setEmail] = useState("tahiry.yvon@gmail.com")  const [email, setEmail] = useState("tahiry.yvon@gmail.com")

  const [password, setPassword] = useState("")  const [password, setPassword] = useState("")

  const [result, setResult] = useState<any>(null)  const [result, setResult] = useState<any>(null)

  const [loading, setLoading] = useState(false)  const [loading, setLoading] = useState(false)

  const router = useRouter()  const router = useRouter()



  const testNextAuthLogin = async (e: React.FormEvent) => {  const testNextAuthLogin = async (e: React.FormEvent) => {

    e.preventDefault()    e.preventDefault()

    setLoading(true)    setLoading(true)

    setResult(null)    setResult(null)



    try {    try {

      console.log('🔐 Attempting NextAuth signIn...')      console.log('🔐 Attempting NextAuth signIn...')

            

      // Use NextAuth signIn with redirect: false to capture the result      // Use NextAuth signIn with redirect: false to capture the result

      const nextAuthResult = await signIn("credentials", {      const nextAuthResult = await signIn("credentials", {

        email,        email,

        password,        password,

        redirect: false, // Don't redirect automatically        redirect: false, // Don't redirect automatically

      })      })



      console.log('🔐 NextAuth result:', nextAuthResult)      console.log('🔐 NextAuth result:', nextAuthResult)



      if (nextAuthResult?.ok) {      if (nextAuthResult?.ok) {

        setResult({        setResult({

          success: true,          success: true,

          message: "Login successful! Redirecting to dashboard...",          message: "Login successful! Redirecting to dashboard...",

          nextAuthResult,          nextAuthResult,

          timestamp: new Date().toISOString()          timestamp: new Date().toISOString()

        })        })

                

        // Manual redirect after successful login        // Manual redirect after successful login

        setTimeout(() => {        setTimeout(() => {

          router.push('/dashboard')          router.push('/dashboard')

        }, 2000)        }, 2000)

      } else {      } else {

        setResult({        setResult({

          success: false,          success: false,

          error: nextAuthResult?.error || "Login failed",          error: nextAuthResult?.error || "Login failed",

          nextAuthResult,          nextAuthResult,

          timestamp: new Date().toISOString()          timestamp: new Date().toISOString()

        })        })

      }      }

    } catch (error) {    } catch (error) {

      console.error('❌ Login error:', error)      console.error('❌ Login error:', error)

      setResult({      setResult({

        success: false,        success: false,

        error: error instanceof Error ? error.message : 'Unknown error',        error: error instanceof Error ? error.message : 'Unknown error',

        timestamp: new Date().toISOString()        timestamp: new Date().toISOString()

      })      })

    } finally {    } finally {

      setLoading(false)      setLoading(false)

    }    }

  }  }



  const testAuthStatus = async () => {  const testAuthStatus = async () => {

    try {    try {

      const response = await fetch("/api/auth-status")      const response = await fetch("/api/auth-status")

      const data = await response.json()      const data = await response.json()

      setResult({      setResult({

        authStatus: data,        authStatus: data,

        timestamp: new Date().toISOString()        timestamp: new Date().toISOString()

      })      })

    } catch (error) {    } catch (error) {

      setResult({      setResult({

        error: "Failed to check auth status",        error: "Failed to check auth status",

        timestamp: new Date().toISOString()        timestamp: new Date().toISOString()

      })      })

    }    }

  }  }



  return (  return (

    <div className="min-h-screen bg-gray-50 p-8">    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-2xl mx-auto">      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Login Fix Test</h1>        <h1 className="text-3xl font-bold text-gray-900 mb-8">Login Fix Test</h1>

                

        <div className="bg-white p-6 rounded-lg shadow mb-6">        <div className="bg-white p-6 rounded-lg shadow mb-6">

          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Actual Login</h2>          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Actual Login</h2>

          <form onSubmit={testNextAuthLogin} className="space-y-4">          <form onSubmit={testNextAuthLogin} className="space-y-4">

            <div>            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">              <label className="block text-sm font-medium text-gray-700 mb-1">

                Email                Email

              </label>              </label>

              <input              <input

                type="email"                type="email"

                value={email}                value={email}

                onChange={(e) => setEmail(e.target.value)}                onChange={(e) => setEmail(e.target.value)}

                className="w-full border border-gray-300 rounded-md px-3 py-2"                className="w-full border border-gray-300 rounded-md px-3 py-2"

                required                required

              />              />

            </div>            </div>

                        

            <div>            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">              <label className="block text-sm font-medium text-gray-700 mb-1">

                Password                Password

              </label>              </label>

              <input              <input

                type="password"                type="password"

                value={password}                value={password}

                onChange={(e) => setPassword(e.target.value)}                onChange={(e) => setPassword(e.target.value)}

                className="w-full border border-gray-300 rounded-md px-3 py-2"                className="w-full border border-gray-300 rounded-md px-3 py-2"

                required                required

              />              />

            </div>            </div>

                        

            <button            <button

              type="submit"              type="submit"

              disabled={loading}              disabled={loading}

              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"

            >            >

              {loading ? "Logging in..." : "Test NextAuth Login"}              {loading ? "Logging in..." : "Test NextAuth Login"}

            </button>            </button>

          </form>          </form>

        </div>        </div>



        <div className="bg-white p-6 rounded-lg shadow mb-6">        <div className="bg-white p-6 rounded-lg shadow mb-6">

          <button          <button

            onClick={testAuthStatus}            onClick={testAuthStatus}

            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"

          >          >

            Check Current Auth Status            Check Current Auth Status

          </button>          </button>

        </div>        </div>



        {result && (        {result && (

          <div className="bg-white p-6 rounded-lg shadow">          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-bold text-gray-900 mb-4">Results</h2>            <h2 className="text-xl font-bold text-gray-900 mb-4">Results</h2>

            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">

              {JSON.stringify(result, null, 2)}              {JSON.stringify(result, null, 2)}

            </pre>            </pre>

          </div>          </div>

        )}        )}

      </div>      </div>

    </div>    </div>

  )  )

}}

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                ❌ Previous Issue:
              </h3>
              <div className="text-sm text-red-700 space-y-1">
                <p>1. Login successful → URL changes to /dashboard ✅</p>
                <p>2. Shows loading screen ✅</p>
                <p>3. Redirects back to login ❌</p>
                <p className="font-semibold mt-2">Root Cause: useSession() hook not working properly with database sessions</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                ✅ Fix Applied:
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Replaced useSession() with Direct API Call:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>DashboardRedirect now uses /api/auth-status endpoint</li>
                  <li>Server-side session checking is more reliable</li>
                  <li>Added proper error handling and debug info</li>
                  <li>Includes retry logic and better timing</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🔄 New Flow:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>1. Login successful → URL changes to /dashboard ✅</p>
                <p>2. DashboardRedirect component loads ✅</p>
                <p>3. Calls /api/auth-status to verify session ✅</p>
                <p>4. Gets user role from database ✅</p>
                <p>5. Redirects to role-specific dashboard ✅</p>
                <p className="font-semibold mt-2 text-blue-800">Result: No more redirect loop!</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">🛠️ Enhanced Features:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li><strong>Better Error Handling:</strong> Specific error messages for different failure modes</li>
                <li><strong>Debug Information:</strong> Shows what&apos;s happening during the redirect process</li>
                <li><strong>Improved Timing:</strong> Waits for session to establish before checking</li>
                <li><strong>Fallback Logic:</strong> Multiple attempts to verify authentication</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <Link 
                href="/login" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🔐 Test Login Now (Should Work!)
              </Link>
              
              <Link 
                href="/signup" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                📝 Create New Account
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/api/auth-status" 
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  🔍 Check Auth Status
                </Link>
                
                <Link 
                  href="/redirect-debug" 
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  🛠️ Debug Tools
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">📋 What&apos;s Different Now:</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Before:</strong> DashboardRedirect used useSession() hook → unreliable with database sessions</p>
                <p><strong>After:</strong> DashboardRedirect uses direct API call → reliable server-side session check</p>
                <p className="mt-2 font-medium text-gray-700">
                  The login → dashboard flow should now work seamlessly without redirect loops!
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              Ready to test on: <strong>http://localhost:3001</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}