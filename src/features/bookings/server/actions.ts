"use server";

import prisma from "@/lib/prisma"
import {AddBookingInput, AddBookingSchema} from "../schemas";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";
import {bookingFieldsSelect, hasBookingOverlap} from "./queries";
import { BookingDto } from "../types";
import {ActionResponse} from "@/lib/definitions";
import {toBookingDto} from "../mappers";

export async function addBookingAction(value: AddBookingInput):
    Promise<ActionResponse<BookingDto>> {
    try {
        const result = await createBooking(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create booking" };
    }
}

async function createBooking(data: AddBookingInput): Promise<BookingDto> {
    const validatedData = AddBookingSchema.parse(data)
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

    return toBookingDto(booking)
}