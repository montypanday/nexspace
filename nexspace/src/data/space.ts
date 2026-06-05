import 'server-only'
import { requireAuth, verifyOrgMembership } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { SpaceGetPayload, SpaceSelect } from '@/app/generated/prisma/models'

export type SpaceStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface SpaceDto {
    id: string;
    name: string;
    status: SpaceStatus;
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
}

// 1. Define the exact fields you want to select
export const spaceFieldsSelect = {
    id: true,
    name: true,
    status: true,
    organization: {
        select: {
            id: true
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

function toDto(space: SpaceSelectPayload): SpaceDto {
    return {
        id: space.id,
        name: space.name,
        status: space.status.toLowerCase() as SpaceStatus,
        floorId: space.floor.id,
        floorName: space.floor.name,
        buildingId: space.floor.building.id,
        buildingName: space.floor.building.name,
        locationId: space.floor.building.location.id,
        locationName: space.floor.building.location.name
    }
}

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
    return toDto(space);
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
    return spaces.map((space) => toDto(space));
}