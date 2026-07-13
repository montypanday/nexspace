import 'server-only';

import prisma from "@/lib/prisma"
import { z } from "zod";
import { LocationGetPayload, LocationSelect } from '@/generated/prisma/models';
import {LocationDto} from "@/features/locations/types";
import {toLocationDto} from "@/features/locations/mappers";
import {requireAuth, verifyOrgMembership} from "@/features/auth/server/queries";

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
    return toLocationDto(location)
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

    return locations.map((location) => toLocationDto(location));
}