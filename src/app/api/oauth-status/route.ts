import { NextResponse } from "next/server"

export async function GET() {
  const hasGoogleCredentials = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  
  return NextResponse.json({
    googleOAuthEnabled: hasGoogleCredentials,
    environment: process.env.NODE_ENV,
    clientIdExists: !!process.env.GOOGLE_CLIENT_ID,
    clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  })
}