import Link from 'next/link'

export default function GoogleOAuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🔧 Google OAuth Fix Applied</h1>
            <p className="mt-2 text-sm text-gray-600">
              The Google OAuth redirect issue has been resolved!
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    ✅ Fixes Applied:
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Added proper redirect callback in auth config</li>
                      <li>Enabled automatic user creation for Google OAuth</li>
                      <li>Set default PARTICIPANT role for new Google users</li>
                      <li>Fixed session handling with database strategy</li>
                      <li>Updated login flow to use NextAuth redirects</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🧪 Test Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                <li>Click &quot;Sign in with Google&quot; on the login page</li>
                <li>Complete Google OAuth flow</li>
                <li>You should be automatically redirected to /dashboard</li>
                <li>From there, you&apos;ll be redirected to the appropriate role dashboard</li>
                <li>No more getting stuck on the login page!</li>
              </ol>
            </div>

            <div className="flex flex-col space-y-4">
              <Link 
                href="/login" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🔐 Test Google OAuth Login
              </Link>
              
              <Link 
                href="/api/debug-google-auth" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                🔍 Debug Auth Status
              </Link>
              
              <Link 
                href="/signup" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                📝 Register New Account
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              Server running on: <strong>http://localhost:3002</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}