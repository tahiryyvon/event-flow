import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
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
  adapter: PrismaAdapter(prisma) as any,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
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
          console.log('Auth attempt for:', credentials?.email)
          
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            console.log('User not found:', email)
            return null
          }

          if (!user.password) {
            console.log('User has no password:', email)
            return null
          }

          const isValidPassword = await compare(password, user.password)

          if (!isValidPassword) {
            console.log('Invalid password for:', email)
            return null
          }

          console.log('Auth successful for:', email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  // Optimize for Edge Runtime
  trustHost: true,
  secret: secret,
})