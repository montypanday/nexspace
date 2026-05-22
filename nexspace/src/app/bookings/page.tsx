"use server"

import Calendar from "@/components/calendar"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { EventInput } from "@fullcalendar/react";

async function getEvents(userId: string, orgId: string): Promise<EventInput[]> {
    try {

        const now = new Date();

        // Set to the first day of the current month (e.g., 2026-05-01 00:00:00)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Set to the last day of the current month (e.g., 2026-05-31 23:59:59)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);


        const bookings = await prisma.booking.findMany({
            where: {
                orgId: orgId,
                userId: userId,
                startTs: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                }
            }
        })
        const events: EventInput[] = bookings.map((booking) => ({
            id: booking.bookingId,
            title: booking.title,
            start: booking.startTs,
            end: booking.endTs,
            allDay: booking.allDay,
            url: booking.url ? booking.url : undefined
        }))
        return events
    } catch (error) {
        console.error(error)
        return [] // Return empty array as fallback
    }
}

export default async function ShowBookingsPage() {
    // Use `auth()` to access the `Auth` object
    // https://clerk.com/docs/reference/backend/types/auth-object
    const { isAuthenticated, orgId, orgRole, userId } = await auth()

    // Check if user is authenticated
    if (!isAuthenticated) return <p>You must be signed in to access this page.</p>

    // Check if there is an Active Organization
    if (!orgId) return <p>Set an Active Organization to access this page.</p>
    const organization = await prisma.organization.findFirstOrThrow({ where: { externalId: orgId } })
    const user = await prisma.user.findFirstOrThrow({ where: { externalId: userId } })
    const events = await getEvents(user.userId, organization.orgId)
    return <>
        <h1>Calendar</h1>
        {/* Pass events in the current calendar month only, rest are loaded on demand */}
        <Calendar events={events} initialView="dayGridMonth" />
    </>
}