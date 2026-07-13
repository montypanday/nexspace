"use server";

import {BuildingDto} from "@/features/buildings/types";
import {
    AddBuildingInput,
    AddBuildingSchema,
    UpdateBuildingFootprintInput,
    UpdateBuildingFootprintSchema
} from "@/features/buildings/schemas";
import {ActionResponse} from "@/lib/definitions";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";
import prisma from "@/lib/prisma"
import {buildingFieldsSelect} from "@/features/buildings/server/queries";
import {toBuildingDto} from "@/features/buildings/mappers";

export async function addBuildingAction(value: AddBuildingInput):
    Promise<ActionResponse<BuildingDto>> {
    try {
        const result = await addBuilding(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add building" };
    }
}

async function addBuilding(data: AddBuildingInput): Promise<BuildingDto> {
    const validatedData = AddBuildingSchema.parse(data)
    const viewer = await requireAuth()
    await verifyOrgMembership(validatedData.organizationId)
    const building = await prisma.building.create({
        data: {
            name: validatedData.name,
            address: validatedData.address,
            footprints: validatedData.footprints,
            location: {
                connect: { id: validatedData.locationId }
            },
            org: {
                connect: { id: validatedData.organizationId }
            }
        },
        select: buildingFieldsSelect
    })
    return toBuildingDto(building)
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

async function updateBuildingFootprint(data: UpdateBuildingFootprintInput): Promise<BuildingDto> {
    const validatedData = UpdateBuildingFootprintSchema.parse(data)
    const viewer = await requireAuth()
    const build = await prisma.building.findFirstOrThrow({
        where: {
            id: validatedData.buildingId
        },
        select: buildingFieldsSelect
    })
    await verifyOrgMembership(build.org.id)
    const building = await prisma.building.update({
        where: {
            id: validatedData.buildingId
        },
        data: {
            footprints: validatedData.footprints,
        },
        select: buildingFieldsSelect
    })
    return toBuildingDto(building)
}