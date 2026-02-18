import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  console.log('🚪 Force signout requested')
  
  // Clear all auth-related cookies
  const cookieStore = await cookies()
  const authCookies = [
    'authjs.session-token',
    'authjs.csrf-token',
    'authjs.pkce.code_verifier',
    '__Secure-authjs.session-token',
    '__Host-authjs.csrf-token'
  ]
  
  const response = NextResponse.json({ success: true, message: 'Signed out successfully' })
  
  // Clear each cookie
  authCookies.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      secure: false,
      httpOnly: true
    })
  })
  
  console.log('✅ Cleared all auth cookies')
  
  return response
}