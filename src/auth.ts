import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { z } from "zod"

// Provide a fallback secret for build time to prevent build failures
// This will be overridden by the real secret at runtime
const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-only-do-not-use-in-production'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { 
    strategy: "jwt", // Using JWT for better reliability
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(error: Error) {
      console.error('❌ NextAuth Error:', error)
    },
    warn(code: string) {
      console.warn('⚠️ NextAuth Warning:', code)
    },
    debug(code: string, metadata?: any) {
      console.log('🔍 NextAuth Debug:', code, metadata)
    }
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Runtime validation for production environment
        if (process.env.NODE_ENV === 'production' && secret === 'fallback-secret-for-build-only-do-not-use-in-production') {
          console.error('❌ NEXTAUTH_SECRET environment variable is required in production.')
          console.error('💡 Generate one with: openssl rand -base64 32')
          return null
        }

        try {
          console.log('🔐 Authorize function called for:', credentials?.email)
        console.log('🔐 Raw credentials received:', {
          email: credentials?.email,
          hasPassword: !!(credentials as any)?.password,
          passwordLength: (credentials as any)?.password?.length || 0
        })
        console.log('🔐 Schema validation passed for:', credentials?.email)
        
        const { email, password } = loginSchema.parse(credentials)
          console.log('🔐 Schema validation passed for:', email)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          console.log('🔐 Database query result:', {
            userFound: !!user,
            userId: user?.id,
            userEmail: user?.email,
            userRole: user?.role,
            hasStoredPassword: !!user?.password,
            storedPasswordLength: user?.password?.length || 0
          })

          if (!user) {
            console.log('❌ User not found:', email)
            return null
          }

          if (!user.password) {
            console.log('❌ User has no password (OAuth user?):', email)
            return null
          }

          console.log('🔐 Comparing passwords...')
          const isValidPassword = await compare(password, user.password)
          console.log('🔐 Password comparison result:', {
            isValidPassword,
            providedLength: password.length,
            storedLength: user.password.length
          })

          if (!isValidPassword) {
            console.log('❌ Invalid password for:', email)
            return null
          }

          console.log('✅ Authentication successful for:', email)
          
          // Return user object that will be used to create the session
          const returnUser = {
            id: user.id,
            email: user.email,
            name: user.name,
          }
          console.log('✅ Returning user object:', returnUser)
          return returnUser
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔑 Sign-in callback:', { 
        email: user.email, 
        provider: account?.provider,
        userId: user.id,
        hasProfile: !!profile 
      })
      
      // For OAuth providers, ensure user exists in database
      if (account?.provider === 'google' && user.email && user.name) {
        try {
          // Check if user already exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true }
          })
          
          if (existingUser) {
            console.log('✅ Existing user found:', user.email)
          } else {
            // Create new user in database manually (since no adapter is used)
            console.log('🔑 Creating new OAuth user in database:', user.email)
            const newUser = await prisma.user.create({
              data: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              }
            })
            console.log('✅ Created new OAuth user:', newUser.id)
            
            // Link existing bookings to the new user
            const existingBookings = await prisma.booking.findMany({
              where: {
                participantEmail: user.email,
                userId: null
              }
            })
            
            if (existingBookings.length > 0) {
              await prisma.booking.updateMany({
                where: {
                  participantEmail: user.email,
                  userId: null
                },
                data: {
                  userId: newUser.id
                }
              })
              console.log(`✅ Linked ${existingBookings.length} existing bookings to new user`)
            }
          }
        } catch (error) {
          console.error('❌ Error handling OAuth user creation:', error)
          // Don't block sign-in if database operations fail
        }
      }
      
      console.log('✅ Sign-in callback returning true')
      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after sign-in
      console.log('🔀 Redirect callback triggered:', { url, baseUrl })
      
      // Always redirect to dashboard after successful authentication
      if (url.includes('/api/auth/callback/') || url === `${baseUrl}/api/auth/signin`) {
        console.log('🔀 Redirecting from callback to dashboard')
        return `${baseUrl}/dashboard`
      }
      
      // If user is going to sign-in page, redirect to dashboard
      if (url === `${baseUrl}/api/auth/signin`) {
        console.log('🔀 Redirecting from signin to dashboard')
        return `${baseUrl}/dashboard`
      }
      
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        const absoluteUrl = `${baseUrl}${url}`
        console.log('🔀 Converting relative URL to absolute:', absoluteUrl)
        return absoluteUrl
      }
      
      // Allow same-origin redirects
      if (url.startsWith(baseUrl)) {
        console.log('🔀 Allowing same-origin redirect:', url)
        return url
      }
      
      // Default redirect to dashboard (will be handled by DashboardRedirect)
      const defaultUrl = `${baseUrl}/dashboard`
      console.log('🔀 Using default redirect to dashboard:', defaultUrl)
      return defaultUrl
    },
    async session({ session, user, token }) {
      // For JWT sessions, we need to use the token
      console.log('📝 Session callback called (JWT mode):', { 
        hasSession: !!session, 
        hasUser: !!user, 
        hasToken: !!token,
        sessionEmail: session?.user?.email,
        tokenSub: token?.sub 
      })
      
      if (session?.user && token?.sub) {
        session.user.id = token.sub
        console.log('✅ JWT Session updated with user ID:', { 
          email: session.user.email, 
          id: session.user.id 
        })
      }
      
      return session
    },
    async jwt({ token, user }) {
      // Add user info to JWT token when user signs in
      if (user) {
        token.sub = user.id
        console.log('✅ JWT token updated:', { sub: token.sub })
      }
      return token
    },
  },
  // Optimize for Edge Runtime
  trustHost: true,
  secret: secret,
})