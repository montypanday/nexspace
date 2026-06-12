import 'server-only'
import { requireAuth, verifyOrgMembership } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { BookingGetPayload, BookingSelect } from '@/app/generated/prisma/models'
import { CreateBookingInput, CreateBookingSchema } from '@/lib/definitions';

export interface BookingDto {
    id: string,
    title: string,
    startTs: string, // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
    endTs: string, // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
    allDay: boolean,
    url: string | null,
    createdAt: string // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
    userId: string
    userName: string | null,
    spaceId: string;
    spaceName: string;
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
}

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

function toDto(booking: BookingSelectPayload): BookingDto {
    return {
        id: booking.id,
        title: booking.title,
        startTs: booking.startTs.toISOString(), // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
        endTs: booking.endTs?.toISOString() ?? null, // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
        allDay: booking.allDay,
        url: booking.url,
        createdAt: booking.createdAt.toISOString(), // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
        userId: booking.user.id,
        userName: booking.user.name,
        spaceId: booking.space.id,
        spaceName: booking.space.name,
        floorId: booking.space.floor.id,
        floorName: booking.space.floor.name,
        buildingId: booking.space.floor.building.id,
        buildingName: booking.space.floor.building.name,
        locationId: booking.space.floor.building.location.id,
        locationName: booking.space.floor.building.location.name,
    }
}

interface CheckOverlapInput {
    spaceId: string
    startTs: string | Date  // UTC ISO string or Date object
    endTs: string | Date    // UTC ISO string or Date object
    allDay: boolean
    ignoreBookingId?: string // Pass this when *updating* an existing booking
}

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

    return bookings.map((booking) => toDto(booking));
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

    return bookings.map((booking) => toDto(booking));
}

export async function getBooking(bookingId: string): Promise<BookingDto> {
    const viewer = await requireAuth()

    const booking = await prisma.booking.findFirstOrThrow({
        where: {
            id: bookingId,
        },
        select: bookingFieldsSelect
    })
    return toDto(booking);
}

export async function createBooking(data: CreateBookingInput): Promise<BookingDto> {
    const validatedData = CreateBookingSchema.parse(data)
    const viewer = await requireAuth()

    const space = await prisma.space.findFirstOrThrow({
        where: {
            id: validatedData.spaceId
        }
    })

    await verifyOrgMembership(space.orgId)

    let start = validatedData.startTs
    // Force end to the very end of the day (or midnight of the next day)
    let end = validatedData.endTs

    if (validatedData.allDay) {
        start = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0))
        // Force end to the very end of the day (or midnight of the next day)
        end = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999))
    }

    const isOverlap = await hasBookingOverlap({
        spaceId: space.id,
        startTs: start.toISOString(),
        endTs: end.toISOString(),
        allDay: validatedData.allDay
    })

    if (isOverlap) {
        throw new Error('Space is not available between the given start and end time.')
    }

    const booking = await prisma.booking.create({
        data: {
            title: validatedData.title,
            startTs: start,
            endTs: end,
            allDay: validatedData.allDay,
            user: {
                connect: { id: validatedData.userId }
            },
            space: {
                connect: { id: validatedData.spaceId }
            },
            organization: {
                connect: { id: space.orgId }
            }
        },
        select: bookingFieldsSelect
    });

    return toDto(booking)
}