// auth.ts
import NextAuth, { NextAuthConfig } from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    callbacks: {
        async jwt({ token, user }) {
            // When the user logs in, pass the user ID from the database/provider to the token
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            // Append the token ID onto the session user object
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
