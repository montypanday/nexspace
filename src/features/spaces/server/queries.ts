import 'server-only'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { SpaceGetPayload, SpaceSelect } from '@/generated/prisma/models'
import { SpaceDto } from "@/features/spaces/types";
import {toSpaceDto} from "@/features/spaces/mappers";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";

// 1. Define the exact fields you want to select
export const spaceFieldsSelect = {
    id: true,
    status: true,
    organization: {
        select: {
            id: true
        }
    },
    floorPlan: {
        select: {
            id: true,
            name: true,
        }
    },
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
    },
} satisfies SpaceSelect;

// 2. Infer the precise object type from the select payload
export type SpaceSelectPayload = SpaceGetPayload<{
    select: typeof spaceFieldsSelect;
}>;

export async function getSpace(spaceId: string): Promise<SpaceDto> {
    z.uuid().parse(spaceId);
    const viewer = await requireAuth()

    const space = await prisma.space.findUniqueOrThrow({
        select: spaceFieldsSelect,
        where: {
            id: spaceId
        }
    });
    await verifyOrgMembership(space.organization.id)
    return toSpaceDto(space);
}


export async function getSpaces(floorId: string): Promise<SpaceDto[]> {
    z.uuid().parse(floorId)
    const viewer = await requireAuth()
    const floor = await prisma.floor.findUniqueOrThrow({
        where: { id: floorId },
        select: { orgId: true }
    })
    await verifyOrgMembership(floor.orgId)

    const spaces = await prisma.space.findMany({
        select: spaceFieldsSelect,
        where: {
            floorId: floorId
        }
    })
    return spaces.map((space) => toSpaceDto(space));
}