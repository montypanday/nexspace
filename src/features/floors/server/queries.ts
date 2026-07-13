import 'server-only';
import { requireAuth, verifyOrgMembership } from '../../auth/server/queries'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { FloorGetPayload, FloorSelect } from '@/generated/prisma/models';
import {FloorDto} from "@/features/floors/types";
import {toFloorDto} from "@/features/floors/mappers";

export const floorFieldsSelect = {
    id: true,
    name: true,
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