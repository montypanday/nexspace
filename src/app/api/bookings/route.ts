// app/api/events/route.ts
import { getUserBookings } from "@/features/bookings/server/queries";
import { NextRequest, NextResponse } from "next/server";
import { dateRangeSchema } from "@/lib/definitions"
import z from "zod";
import {BookingDto} from "@/features/bookings/types";

export async function GET(request: NextRequest) {
    // 1. Extract query params and convert to an object
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    console.log(searchParams)
    // Validate using Zod
    const validatedFields = dateRangeSchema.safeParse(searchParams);
    console.log(validatedFields)
    if (!validatedFields.success) {
        // Handle validation errors
        return NextResponse.json({ errors: z.treeifyError(validatedFields.error) });
    }
    const { startDate, endDate } = validatedFields.data;
    const bookings: BookingDto[] = await getUserBookings(startDate, endDate)
    return NextResponse.json(bookings);
}
