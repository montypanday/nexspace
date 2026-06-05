import 'server-only'
import { requireAuth, verifyOrgMembership } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { BuildingGetPayload, BuildingSelect } from '@/app/generated/prisma/models';

export interface BuildingDto {
    id: string;
    name: string;
    address: string | null;
    locationId: string;
    locationName: string;
    organizationId: string;
    organizataionName: string;
}

export const buildingFieldsSelect = {
    id: true,
    name: true,
    address: true,
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

function toDto(building: BuildingSelectPayload): BuildingDto {
    return {
        id: building.id,
        name: building.name,
        address: building.address,
        locationId: building.location.id,
        locationName: building.location.name,
        organizationId: building.org.id,
        organizataionName: building.org.name
    }
}

export async function getBuilding(buildingId: string): Promise<BuildingDto> {
    z.uuid().parse(buildingId);
    const viewer = await requireAuth()
    const building = await prisma.building.findUniqueOrThrow({
        where: { id: buildingId },
        select: buildingFieldsSelect
    })
    await verifyOrgMembership(building.org.id)
    return toDto(building);
}

export async function getBuildings(locationId: string): Promise<BuildingDto[]> {
    z.uuid().parse(locationId);
    const viewer = await requireAuth()
    const location = await prisma.location.findUniqueOrThrow({
        where: { id: locationId },
        select: { orgId: true }
    })
    await verifyOrgMembership(location.orgId)
    const buildings = await prisma.building.findMany({
        select: buildingFieldsSelect,
        where: {
            locationId: locationId
        }
    });
    return buildings.map((building) => toDto(building));
}