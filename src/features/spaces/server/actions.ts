"use server";

import {SpaceDto} from "@/features/spaces/types";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";
import prisma from "@/lib/prisma"
import {toSpaceDto} from "@/features/spaces/mappers";
import {spaceFieldsSelect} from "@/features/spaces/server/queries";
import {AddSpaceInput, AddSpaceSchema} from "@/features/spaces/schemas";

async function addSpace(data: AddSpaceInput): Promise<SpaceDto> {
    const validatedData = AddSpaceSchema.parse(data);
    const viewer = await requireAuth();
    await verifyOrgMembership(validatedData.organizationId);
    const space = await prisma.space.create({
        data: {
            floor: {
                connect: { id: validatedData.floorId }
            },
            floorPlan: {
                connect: { id: validatedData.floorPlanId }
            },
            floorPlanElement: {
                connect: { id: validatedData.floorPlanElementId }
            },
            asset: {
                connect: { id: validatedData.bookableAssetId }
            },
            organization: {
                connect: { id: validatedData.organizationId }
            }
        },
        select: spaceFieldsSelect
    })
    return toSpaceDto(space);
}