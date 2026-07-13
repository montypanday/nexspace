import 'server-only'

import { requireAuth, verifyOrgMembership } from '../../auth/server/queries'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { OrganizationGetPayload, OrganizationSelect } from '@/generated/prisma/models';
import {OrganizationDto} from "@/features/organizations/types";
import {toOrganizationDto} from "@/features/organizations/mappers";

export const organizationFieldsSelect = {
    id: true,
    name: true,
    externalId: true,
    createdAt: true
} satisfies OrganizationSelect;

export type OrganizationSelectPayload = OrganizationGetPayload<{
    select: typeof organizationFieldsSelect;
}>;

export async function getOrganization(organizationId: string): Promise<OrganizationDto> {

    z.uuid().parse(organizationId)
    const viewer = await requireAuth()
    await verifyOrgMembership(organizationId);

    const organization = await prisma.organization.findUniqueOrThrow({
        select: organizationFieldsSelect,
        where: {
            id: organizationId
        }
    });
    return toOrganizationDto(organization);
}

export async function getOrganizations(): Promise<OrganizationDto[]> {
    const viewer = await requireAuth()

    const organizations = await prisma.organization.findMany({
        select: organizationFieldsSelect,
        where: {
            users: {
                some: {
                    userId: viewer.id
                }
            }
        }
    });
    return organizations.map((organization) => toOrganizationDto(organization));
}

