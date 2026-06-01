import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/prisma"
import { User } from "./app/generated/prisma/client"
import { z } from 'zod';
import { comparePasswords } from "@/lib/utils"

export default {
    debug: true,
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID ?? '',
            clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
        }),
        Credentials({
            // You can define what fields are expected in the login form
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials): Promise<User | null> => {

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {

                    const { email, password } = parsedCredentials.data;
                    // 1. Validate credentials with your DB or external API
                    console.log(email)
                    console.log(password)
                    const user = await prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    })
                    if (user && user.password) {
                        const passwordsMatch = await comparePasswords(password, user.password)
                        if (passwordsMatch) {
                            // 2. Return user object if successful
                            return user
                        } else {
                            console.log('Passwords do not match')
                        }
                    } else {
                        console.log(user)
                        console.log('User was not found')
                    }
                } else {
                    console.log('Credentials were not parsed')
                }
                // 3. Return null if authentication fails
                return null
            },
        }),
    ],
    session: { strategy: "jwt" }, // Mandatory for Credentials provider
} satisfies NextAuthConfig