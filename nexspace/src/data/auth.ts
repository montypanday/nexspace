import 'server-only'
import { auth } from '@/auth'
import { cache } from 'react'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { redirect } from 'next/navigation'

export const getCurrentUser = cache(async () => {
    const session = await auth()
    if (!session) return null
    return session.user
})

export const requireAuth = cache(async () => {
    const user = await getCurrentUser()
    if (!user) redirect('/api/auth/signin')
    return user
})

export const verifyOrgMembership = cache(async (orgId: string) => {
    const user = await getCurrentUser()

    if (!user || !user.id) {
        throw new Error('Unauthenticated');
    }

    // Query your join table or organization table to confirm membership
    const membership = await prisma.userOrganization.findUnique({
        where: {
            userId_orgId: {
                userId: user.id,
                orgId: orgId,
            },
        },
    });

    if (!membership) {
        throw new Error('Not a member of this organization');
    }

    // Return membership context (e.g., if you need roles like 'admin' or 'member')
    return membership;
});