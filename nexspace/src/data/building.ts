import 'server-only'
import { requireAuth, verifyOrgMembership } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { BuildingGetPayload, BuildingSelect } from '@/app/generated/prisma/models';
import { AddBuildingInput, AddBuildingSchema, UpdateBuildingFootprintInput, UpdateBuildingFootprintSchema } from '@/lib/definitions';
import { LatLngExpression } from 'leaflet';

export interface BuildingDto {
    id: string;
    name: string;
    address: string | null;
    footprints: LatLngExpression[]
    locationId: string;
    locationName: string;
    organizationId: string;
    organizataionName: string;
}

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

function toDto(building: BuildingSelectPayload): BuildingDto {
    return {
        id: building.id,
        name: building.name,
        address: building.address,
        locationId: building.location.id,
        locationName: building.location.name,
        organizationId: building.org.id,
        organizataionName: building.org.name,
        footprints: building.footprints as unknown as LatLngExpression[]
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

export async function addBuilding(data: AddBuildingInput): Promise<BuildingDto> {
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
    return toDto(building)
}

export async function updateBuildingFootprint(data: UpdateBuildingFootprintInput): Promise<BuildingDto> {
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
    return toDto(building)
}