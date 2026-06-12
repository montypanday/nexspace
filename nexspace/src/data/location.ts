import 'server-only';
import { requireAuth, verifyOrgMembership } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { LocationGetPayload, LocationSelect } from '@/app/generated/prisma/models';
import { AddLocationInput, AddLocationSchema } from '@/lib/definitions';

export interface LocationDto {
    id: string;
    name: string;
    address: string | null;
    coordinates: [number, number]
    createdAt: string;
    organizationId: string;
    organizationName: string;
}

export const locationFieldsSelect = {
    id: true,
    name: true,
    address: true,
    createdAt: true,
    latitude: true,
    longitude: true,
    org: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies LocationSelect;

export type LocationSelectPayload = LocationGetPayload<{
    select: typeof locationFieldsSelect;
}>;

function toDto(location: LocationSelectPayload): LocationDto {
    return {
        id: location.id,
        name: location.name,
        address: location.address,
        coordinates: [location.latitude, location.longitude],
        createdAt: location.createdAt.toISOString(),
        organizationId: location.org.id,
        organizationName: location.org.name
    }
}

export async function getLocation(locationId: string): Promise<LocationDto> {
    z.uuid().parse(locationId);
    const viewer = await requireAuth()

    const location = await prisma.location.findUniqueOrThrow({
        where: {
            id: locationId
        },
        select: locationFieldsSelect
    })
    await verifyOrgMembership(location.org.id)
    return toDto(location)
}

export async function getLocations(organizationId: string): Promise<LocationDto[]> {

    z.uuid().parse(organizationId);

    const viewer = await requireAuth()
    await verifyOrgMembership(organizationId)

    const locations = await prisma.location.findMany({
        where: {
            orgId: organizationId
        },
        select: locationFieldsSelect
    })

    return locations.map((location) => toDto(location));
}

export async function addLocation(data: AddLocationInput): Promise<LocationDto> {
    const validatedData = AddLocationSchema.parse(data)
    const viewer = await requireAuth()

    await verifyOrgMembership(data.organizationId)

    const location = await prisma.location.create({
        data: {
            name: validatedData.name,
            address: validatedData.address,
            latitude: Number(validatedData.latitude),
            longitude: Number(validatedData.longitude),
            org: {
                connect: { id: validatedData.organizationId }
            }
        },
        select: locationFieldsSelect
    });

    return toDto(location);

}