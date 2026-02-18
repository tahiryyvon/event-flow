"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Navigation() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Welcome, {session.user.name}
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link 
        href="/login" 
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        Log In
      </Link>
      <Link 
        href="/signup" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Sign Up
      </Link>
    </div>
  )
}