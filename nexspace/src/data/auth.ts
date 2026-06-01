import 'server-only'
import { auth } from '@/auth'
import { cache } from 'react'
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