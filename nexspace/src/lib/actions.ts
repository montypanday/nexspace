"use server";

import { BookingDto, createBooking } from "@/data/booking";
import { ActionResponse, AddLocationInput, CreateBookingInput } from "./definitions";
import { addLocation, LocationDto } from "@/data/location";

// TanStack Form submits an object structured as { value: formData }
export async function createBookingAction(value: CreateBookingInput):
    Promise<ActionResponse<BookingDto>> {
    try {
        const result = await createBooking(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create booking" };
    }
}

export async function addLocationAction(value: AddLocationInput):
    Promise<ActionResponse<LocationDto>> {
    try {
        const result = await addLocation(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add location" };
    }
}