import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for customization
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'EventFlow'
    const subtitle = searchParams.get('subtitle') || 'Simple Event Scheduling'
    const description = searchParams.get('description') || 'Schedule meetings and events with ease.'

    // SVG template
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea"/>
            <stop offset="100%" style="stop-color:#764ba2"/>
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        
        <circle cx="160" cy="180" r="50" fill="white" fill-opacity="0.95"/>
        <text x="160" y="190" text-anchor="middle" fill="#667eea" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold">EF</text>
        
        <text x="80" y="280" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="bold">${title}</text>
        <text x="80" y="330" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill-opacity="0.9">${subtitle}</text>
        <text x="80" y="380" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill-opacity="0.8">${description}</text>
        
        <circle cx="900" cy="150" r="60" fill="white" fill-opacity="0.1"/>
        <circle cx="1000" cy="350" r="40" fill="white" fill-opacity="0.1"/>
        <circle cx="850" cy="480" r="30" fill="white" fill-opacity="0.1"/>
      </svg>
    `.trim()

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new NextResponse('Error generating image', { status: 500 })
  }
}