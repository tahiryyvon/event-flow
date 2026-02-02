import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import ConsoleFilter from "@/components/ConsoleFilter"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "EventFlow - Simple Event Scheduling",
  description: "Schedule meetings and events with ease. A clean, professional event management platform.",
  keywords: ["event scheduling", "meeting booking", "calendar management", "event management"],
  authors: [{ name: "EventFlow Team" }],
  
  // Open Graph tags for social sharing
  openGraph: {
    title: "EventFlow - Simple Event Scheduling",
    description: "Schedule meetings and events with ease. A clean, professional event management platform.",
    type: "website",
    url: "/",
    siteName: "EventFlow",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "EventFlow - Simple Event Scheduling Platform",
        type: "image/svg+xml",
      },
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "EventFlow - Simple Event Scheduling Platform",
        type: "image/svg+xml",
      }
    ],
    locale: "en_US",
  },

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    site: "@eventflow",
    creator: "@eventflow", 
    title: "EventFlow - Simple Event Scheduling",
    description: "Schedule meetings and events with ease. Professional event management platform.",
    images: ["/api/og"],
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConsoleFilter />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}