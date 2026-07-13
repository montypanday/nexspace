import 'server-only';

import {requireAuth, verifyOrgMembership} from '@/features/auth/server/queries'
import prisma from "@/lib/prisma"
import {z} from "zod";
import {BuildingGetPayload, BuildingSelect} from '@/generated/prisma/models';
import {BuildingDto} from '../types';
import {toBuildingDto} from "../mappers";

export const buildingFieldsSelect = {
    id: true,
    name: true,
    address: true,
    footprints: true,
    location: {
        select: {
            id: true,
            name: true
        }
    },
    org: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies BuildingSelect;

export type BuildingSelectPayload = BuildingGetPayload<{
    select: typeof buildingFieldsSelect
}>;


export async function getBuilding(buildingId: string): Promise<BuildingDto> {
    z.uuid().parse(buildingId);
    const viewer = await requireAuth()
    const building = await prisma.building.findUniqueOrThrow({
        where: {id: buildingId},
        select: buildingFieldsSelect
    })
    await verifyOrgMembership(building.org.id)
    return toBuildingDto(building);
}

export async function getBuildings(locationId: string): Promise<BuildingDto[]> {
    z.uuid().parse(locationId);
    const viewer = await requireAuth()
    const location = await prisma.location.findUniqueOrThrow({
        where: {id: locationId},
        select: {orgId: true}
    })
    await verifyOrgMembership(location.orgId)
    const buildings = await prisma.building.findMany({
        select: buildingFieldsSelect,
        where: {
            locationId: locationId
        }
    });
    return buildings.map((building) => toBuildingDto(building));
}