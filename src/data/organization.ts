import 'server-only'

import { requireAuth, verifyOrgMembership } from './auth'
import prisma from "@/lib/prisma"
import { z } from "zod";
import { OrganizationGetPayload, OrganizationSelect } from '@/app/generated/prisma/models';
import { AddOrganizationInput, AddOrganizationSchema } from '@/lib/definitions';

export interface OrganizationDto {
    id: string;
    name: string;
    externalId: string | null;
    createdAt: string;
}

export const organizationFieldsSelect = {
    id: true,
    name: true,
    externalId: true,
    createdAt: true
} satisfies OrganizationSelect;

export type OrganizationSelectPayload = OrganizationGetPayload<{
    select: typeof organizationFieldsSelect;
}>;

function toDto(organization: OrganizationSelectPayload): OrganizationDto {
    return {
        id: organization.id,
        name: organization.name,
        externalId: organization.externalId,
        createdAt: organization.createdAt.toISOString()
    }
}

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
    return toDto(organization);
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
    return organizations.map((organization) => toDto(organization));
}

export async function addOrganization(data: AddOrganizationInput): Promise<OrganizationDto> {
    const validatedData = AddOrganizationSchema.parse(data);
    const viewer = await requireAuth()
    const organization = await prisma.organization.create({
        data: {
            name: validatedData.name,
            externalId: validatedData.externalId
        },
        select: organizationFieldsSelect
    });
    // link the creating user as the first member
    if (viewer.id) {
        await prisma.userOrganization.create({
            data: {
                userId: viewer.id,
                orgId: organization.id
            }
        });
    }

    return toDto(organization);
}

