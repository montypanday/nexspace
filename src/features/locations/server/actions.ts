"use server";

import {ActionResponse} from "@/lib/definitions";
import {LocationDto} from "@/features/locations/types";
import {AddLocationInput, AddLocationSchema} from "@/features/locations/schemas";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";
import prisma from "@/lib/prisma"
import {locationFieldsSelect} from "@/features/locations/server/queries";
import {toLocationDto} from "@/features/locations/mappers";

export async function addLocationAction(value: AddLocationInput):
    Promise<ActionResponse<LocationDto>> {
    try {
        const result = await addLocation(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add location" };
    }
}

async function addLocation(data: AddLocationInput): Promise<LocationDto> {
    const validatedData = AddLocationSchema.parse(data)
    const viewer = await requireAuth()

    await verifyOrgMembership(data.organizationId)

    const location = await prisma.location.create({
        data: {
            name: validatedData.name,
            address: validatedData.address,
            latitude: Number(validatedData.latitude),
            longitude: Number(validatedData.longitude),
            org: {
                connect: { id: validatedData.organizationId }
            }
        },
        select: locationFieldsSelect
    });

    return toLocationDto(location);
}