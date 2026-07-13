import 'server-only'

import { requireAuth, verifyOrgMembership } from '../../auth/server/queries'
import prisma from "@/lib/prisma"
import { BookingGetPayload, BookingSelect } from '@/generated/prisma/models'
import {BookingDto, CheckOverlapInput} from "@/features/bookings/types";
import {toBookingDto} from "@/features/bookings/mappers";

export const bookingFieldsSelect = {
    id: true,
    title: true,
    startTs: true,
    endTs: true,
    allDay: true,
    url: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true
        }
    },
    space: {
        select: {
            id: true,
            name: true,
            floor: {
                select: {
                    id: true,
                    name: true,
                    building: {
                        select: {
                            id: true,
                            name: true,
                            location: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            }
        }
    }
} satisfies BookingSelect;

export type BookingSelectPayload = BookingGetPayload<{
    select: typeof bookingFieldsSelect
}>;

export async function hasBookingOverlap({
    spaceId,
    startTs,
    endTs,
    allDay,
    ignoreBookingId,
}: CheckOverlapInput): Promise<boolean> {

    // 1. Normalise the incoming dates into JavaScript Date objects
    let start = new Date(startTs)
    let end = new Date(endTs)

    // 2. Enforce strict midnight boundaries if it's an all-day booking
    if (allDay) {
        // Force start to the very beginning of the day in UTC
        start = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0))
        // Force end to the very end of the day (or midnight of the next day)
        end = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999))
    }

    // 3. Simple chronological safety guard
    if (start >= end) {
        throw new Error("Start date must be strictly before the end date.")
    }

    // 4. Query Prisma for any overlapping records in the same space
    const conflictingBooking = await prisma.booking.findFirst({
        where: {
            spaceId: spaceId,
            // If we are editing a booking, don't let it conflict with itself
            ...(ignoreBookingId ? { id: { not: ignoreBookingId } } : {}),

            // Standard mathematical overlap formula: (StartA < EndB) AND (EndA > StartB)
            AND: [
                { startTs: { lt: end } },
                { endTs: { gt: start } }
            ]
        },
        select: { id: true } // Minimal selection for performance speed
    })

    // Returns true if a conflict exists, false if the slot is clear
    return conflictingBooking !== null
}


export async function getSpaceBookings(spaceId: string, startDate?: string, endDate?: string): Promise<BookingDto[]> {
    const viewer = await requireAuth()

    if (!viewer.id) {
        return []
    }

    const bookings = await prisma.booking.findMany({
        where: {
            spaceId: spaceId,
            // Checks if the booking overlaps with the provided range
            ...(startDate && endDate ? {
                AND: [
                    { startTs: { lt: new Date(endDate) } },
                    { endTs: { gt: new Date(startDate) } }
                ]
            } : {
                // Fallback to open-ended bounds if only one date is provided
                ...(startDate ? { endTs: { gt: new Date(startDate) } } : {}),
                ...(endDate ? { startTs: { lt: new Date(endDate) } } : {}),
            }),
        },
        select: bookingFieldsSelect
    })

    return bookings.map((booking) => toBookingDto(booking));
}

/**
 * @param startDate UTC ISO 8601 String (e.g., "2026-06-12T00:00:00.000Z")
 * @param endDate UTC ISO 8601 String (e.g., "2026-06-13T00:00:00.000Z")
 */
export async function getUserBookings(startDate: string, endDate: string): Promise<BookingDto[]> {
    const viewer = await requireAuth()

    if (!viewer.id) {
        return []
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: viewer.id,
            // Checks if the booking overlaps with the provided range
            AND: [
                { startTs: { lt: new Date(endDate) } },
                { endTs: { gt: new Date(startDate) } }
            ]
        },
        select: bookingFieldsSelect,
        orderBy: {
            startTs: 'asc'
        }
    })

    return bookings.map((booking) => toBookingDto(booking));
}

export async function getBooking(bookingId: string): Promise<BookingDto> {
    const viewer = await requireAuth()

    const booking = await prisma.booking.findFirstOrThrow({
        where: {
            id: bookingId,
        },
        select: bookingFieldsSelect
    })
    return toBookingDto(booking);
}

