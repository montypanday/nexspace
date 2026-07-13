"use server";

import {ActionResponse} from "@/lib/definitions";
import {FloorDto} from "@/features/floors/types";
import {AddFloorInput, AddFloorSchema} from "@/features/floors/schemas";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";
import prisma from "@/lib/prisma"
import {floorFieldsSelect} from "@/features/floors/server/queries";
import {toFloorDto} from "@/features/floors/mappers";

export async function addFloorAction(value: AddFloorInput):
    Promise<ActionResponse<FloorDto>> {
    try {
        const result = await addFloor(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to add floor" };
    }
}

async function addFloor(data: AddFloorInput): Promise<FloorDto> {
    const validatedData = AddFloorSchema.parse(data);
    const viewer = await requireAuth();
    await verifyOrgMembership(validatedData.organizationId)
    const floor = await prisma.floor.create({
        data: {
            name: validatedData.name,
            building: {
                connect: { id: validatedData.buildingId }
            },
            organization: {
                connect: { id: validatedData.organizationId }
            }
        },
        select: floorFieldsSelect
    })
    return toFloorDto(floor)
}