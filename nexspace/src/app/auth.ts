// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/credentials"
import Credentials from "next-auth/providers/credentials"

export const { signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            async authorize({ request: NextRequest }) {
                const response = await fetch(request)
                if (!response.ok) return null
                return (await response.json()) ?? null
            },
        }),
    ],
})