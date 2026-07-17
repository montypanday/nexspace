"use server";

import { ActionResponse } from "@/lib/definitions";
import { FloorDto, FloorPlanDto } from "@/features/floors/types";
import { AddFloorInput, AddFloorSchema, FloorPlanInput, FloorPlanSchema } from "@/features/floors/schemas";
import { requireAuth, verifyOrgMembership } from "@/features/auth/server/queries";
import { floorFieldsSelect, getFloorPlan } from "@/features/floors/server/queries";
import { toFloorDto } from "@/features/floors/mappers";
import { z } from "zod";
import prisma from "@/lib/prisma";

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

export async function saveFloorPlanAction(data: FloorPlanInput): Promise<ActionResponse<FloorPlanDto>> {
    try {
        const result = await saveFloorPlan(data);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to save floor plan" };
    }
}

async function saveFloorPlan(data: FloorPlanInput): Promise<FloorPlanDto> {

    FloorPlanSchema.parse(data);
    const { floorPlanId, floorId, elements } = data;

    const viewer = await requireAuth();

    const floorPlan = await prisma.floorPlan.findUniqueOrThrow({
        where: { id: floorPlanId, floorId: floorId },
        select: { floor: { select: { orgId: true } } },
    });

    await verifyOrgMembership(floorPlan.floor.orgId);

    // Delete existing elements for this floor plan
    await prisma.floorPlanElement.deleteMany({
        where: { floorPlanId },
    });

    // Create new elements
    await prisma.floorPlanElement.createMany({
        data: elements.map((element) => ({
            id: element.floorPlanElementId,
            type: element.type,
            attrs: element.attrs,
            featureProperties: element.featureProperties ?? {},
            floorPlanId: floorPlanId,
        })),
    });

    return getFloorPlan(floorPlanId)
}

// export async function createOrGetFloorPlan(
//     floorId: string,
//     name: string = "Default Floor Plan"
// ): Promise<ActionResponse<{ floorPlanId: string }>> {
//     try {
//         z.uuid().parse(floorId);
//
//         const viewer = await requireAuth();
//
//         const floor = await prisma.floor.findUniqueOrThrow({
//             where: { id: floorId },
//             select: { orgId: true, id: true },
//         });
//
//         await verifyOrgMembership(floor.orgId);
//
//         // Check if a floor plan already exists for this floor
//         let floorPlan = await prisma.floorPlan.findFirst({
//             where: { floorId },
//             select: { id: true },
//         });
//
//         // If not, create a new one
//         if (!floorPlan) {
//             floorPlan = await prisma.floorPlan.create({
//                 data: {
//                     name,
//                     floor: {
//                         connect: { id: floorId },
//                     },
//                 },
//                 select: { id: true },
//             });
//         }
//
//         return {
//             success: true,
//             data: { floorPlanId: floorPlan.id },
//         };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.message || "Failed to create or get floor plan",
//         };
//     }
// }
//
// export async function loadFloorPlanElements(floorPlanId: string): Promise<ActionResponse<ElementProps[]>> {
//     try {
//         z.string().uuid().parse(floorPlanId);
//
//         const viewer = await requireAuth();
//
//         const floorPlan = await prisma.floorPlan.findUniqueOrThrow({
//             where: { id: floorPlanId },
//             select: { floor: { select: { orgId: true } } },
//         });
//
//         await verifyOrgMembership(floorPlan.floor.orgId);
//
//         const elements = await prisma.floorPlanElement.findMany({
//             where: { floorPlanId },
//             select: {
//                 id: true,
//                 type: true,
//                 attrs: true,
//             },
//         });
//
//         const loaded = elements.map((el) => ({
//             id: el.id,
//             type: el.type || '',
//             draggable: true,
//             isSelected: false,
//             attrs: el.attrs || {},
//         }));
//
//         return {
//             success: true,
//             data: loaded,
//         };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.message || "Failed to load floor plan elements",
//         };
//     }
// }