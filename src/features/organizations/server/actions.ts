"use server";

import {ActionResponse} from "@/lib/definitions";
import {AddOrganizationInput, AddOrganizationSchema} from "@/features/organizations/schemas";
import {OrganizationDto} from "@/features/organizations/types";
import {requireAuth} from "@/features/auth/server/queries";
import {organizationFieldsSelect} from "@/features/organizations/server/queries";
import {toOrganizationDto} from "@/features/organizations/mappers";
import prisma from "@/lib/prisma"

export async function addOrganizationAction(value: AddOrganizationInput):
    Promise<ActionResponse<OrganizationDto>> {
    try {
        const result = await addOrganization(value);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to create organization" };
    }
}

async function addOrganization(data: AddOrganizationInput): Promise<OrganizationDto> {
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

    return toOrganizationDto(organization);
}