import Link from 'next/link'

export default function SessionDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🔧 Session Role Fix Applied</h1>
            <p className="mt-2 text-sm text-gray-600">
              Fixed the &quot;No role found in session&quot; error after account creation
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    ❌ Previous Issue:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>After creating account, login failed with &quot;No role found in session&quot;</li>
                      <li>Session callback wasn&apos;t properly receiving user data with database sessions</li>
                      <li>Role information wasn&apos;t being included in the session object</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    ✅ Fixes Applied:
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Enhanced Session Callback:</strong> Added fallback database query for role</li>
                      <li><strong>Better Error Handling:</strong> Login page now handles missing role gracefully</li>
                      <li><strong>Database Fallback:</strong> Fetches role from database if session missing it</li>
                      <li><strong>Improved Logging:</strong> Better debugging information for session issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🧪 Test the Fix:</h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="border-l-4 border-blue-200 pl-4">
                  <p><strong>Step 1:</strong> Create a new account</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Go to signup page</li>
                    <li>Fill out all fields including password confirmation</li>
                    <li>Select ORGANIZER or PARTICIPANT role</li>
                    <li>Submit the form</li>
                  </ol>
                </div>
                <div className="border-l-4 border-blue-200 pl-4">
                  <p><strong>Step 2:</strong> Login with new account</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Go to login page</li>
                    <li>Enter the credentials you just created</li>
                    <li>Should redirect to appropriate dashboard without errors</li>
                    <li>No more &quot;No role found in session&quot; error!</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">🔍 How It Works Now:</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>Enhanced Session Callback:</strong></p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>First tries to get role from database user object</li>
                  <li>If not available, queries database directly using email</li>
                  <li>Ensures role is always included in session</li>
                  <li>Provides detailed logging for debugging</li>
                </ol>
                
                <p className="mt-3"><strong>Login Fallback:</strong></p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>If session lacks role, fetches from /api/auth-status</li>
                  <li>Uses database query as backup</li>
                  <li>Provides clear error messages</li>
                  <li>Ensures users always reach the correct dashboard</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/signup" 
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  📝 Test Account Creation
                </Link>
                
                <Link 
                  href="/login" 
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  🔐 Test Login
                </Link>
              </div>
              
              <Link 
                href="/api/auth-status" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🔍 Check Current Auth Status
              </Link>

              <Link 
                href="/api/debug-google-auth" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🛠️ Full Auth Debug Info
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              Server running on: <strong>http://localhost:3001</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}