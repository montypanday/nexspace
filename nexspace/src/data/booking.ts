import 'server-only'
import { requireAuth } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { BookingGetPayload, BookingSelect } from '@/app/generated/prisma/models'

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

export async function getUserBookings(startDate?: string, endDate?: string): Promise<BookingDto[]> {
    const viewer = await requireAuth()

    if (!viewer.id) {
        return []
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: viewer.id,
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