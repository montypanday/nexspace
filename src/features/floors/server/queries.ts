import 'server-only';
import { requireAuth, verifyOrgMembership } from '../../auth/server/queries'
import prisma from "@/lib/prisma"
import { z } from "zod";
import {
    FloorGetPayload,
    FloorPlanElementGetPayload,
    FloorPlanElementSelect,
    FloorPlanGetPayload,
    FloorPlanSelect,
    FloorSelect
} from '@/generated/prisma/models';
import { FloorDto, FloorPlanDto, FloorPlanElementDto } from "@/features/floors/types";
import { toFloorDto, toFloorPlanDto, toFloorPlanElementDto } from "@/features/floors/mappers";

export const floorFieldsSelect = {
    id: true,
    name: true,
    activeFloorPlanId: true,
    building: {
        select: {
            id: true,
            name: true
        }
    },
    organization: {
        select: {
            id: true,
            name: true
        }
    }

} satisfies FloorSelect;

export type FloorSelectPayload = FloorGetPayload<{
    select: typeof floorFieldsSelect;
}>;

export async function getFloor(floorId: string): Promise<FloorDto> {
    z.uuid().parse(floorId)
    const viewer = await requireAuth()
    const floor = await prisma.floor.findUniqueOrThrow({
        where: { id: floorId },
        select: floorFieldsSelect
    });
    await verifyOrgMembership(floor.organization.id)
    return toFloorDto(floor);
}

export async function getFloors(buildingId: string): Promise<FloorDto[]> {
    z.uuid().parse(buildingId)
    const viewer = await requireAuth()
    const building = await prisma.building.findUniqueOrThrow({
        where: { id: buildingId },
        select: { orgId: true }
    })
    await verifyOrgMembership(building.orgId)
    const floors = await prisma.floor.findMany({
        select: floorFieldsSelect,
        where: {
            buildingId: buildingId
        }
    });
    return floors.map((floor) => toFloorDto(floor));
}

export const floorPlanFieldsSelect = {
    id: true,
    floor: {
        select: {
            id: true,
            organization: {
                select: {
                    id: true
                }
            }
        }
    },
    elements: {
        select: {
            id: true,
            type: true,
            attrs: true,
            featureProperties: true
        }
    }

} satisfies FloorPlanSelect;

export type FloorPlanSelectPayload = FloorPlanGetPayload<{
    select: typeof floorPlanFieldsSelect;
}>;

export async function getFloorPlan(floorPlanId: string): Promise<FloorPlanDto> {
    z.uuid().parse(floorPlanId)
    const viewer = await requireAuth();

    const floorPlan = await prisma.floorPlan.findUniqueOrThrow({
        where: { id: floorPlanId },
        select: floorPlanFieldsSelect
    });
    await verifyOrgMembership(floorPlan.floor.organization.id)
    return toFloorPlanDto(floorPlan);
}

export const floorPlanElementFieldsSelect = {
    id: true,
    type: true,
    attrs: true,
    featureProperties: true
} satisfies FloorPlanElementSelect;

export type FloorPlanElementSelectPayload = FloorPlanElementGetPayload<{
    select: typeof floorPlanElementFieldsSelect;
}>;