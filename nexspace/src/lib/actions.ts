"use server";

import { ActionResponse, AddBuildingInput, AddLocationInput, AddBookingInput, AddFloorInput, AddOrganizationInput, UpdateBuildingFootprintInput } from "./definitions";
import { addLocation, LocationDto } from "@/data/location";
import { BookingDto, createBooking } from "@/data/booking";
import { addBuilding, BuildingDto, updateBuildingFootprint } from "@/data/building";
import { addFloor, FloorDto } from "@/data/floor";
import { addOrganization, OrganizationDto } from "@/data/organization";
import { revalidatePath } from "next/cache";

// TanStack Form submits an object structured as { value: formData }
export async function addOrganizationAction(value: AddOrganizationInput):
    Promise<ActionResponse<OrganizationDto>> {
    try {
        const result = await addOrganization(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create organization" };
    }
}

// TanStack Form submits an object structured as { value: formData }
export async function addBookingAction(value: AddBookingInput):
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

export async function addBuildingAction(value: AddBuildingInput):
    Promise<ActionResponse<BuildingDto>> {
    try {
        const result = await addBuilding(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add building" };
    }
}

export async function updateBuildingFootprintAction(value: UpdateBuildingFootprintInput):
    Promise<ActionResponse<BuildingDto>> {
    try {
        const result = await updateBuildingFootprint(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to update building footprint" };
    }
}

export async function addFloorAction(value: AddFloorInput):
    Promise<ActionResponse<FloorDto>> {
    try {
        const result = await addFloor(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add floor" };
    }
}