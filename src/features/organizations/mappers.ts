import {OrganizationSelectPayload} from "@/features/organizations/server/queries";
import {OrganizationDto} from "@/features/organizations/types";

export function toOrganizationDto(organization: OrganizationSelectPayload): OrganizationDto {
    return {
        id: organization.id,
        name: organization.name,
        externalId: organization.externalId,
        createdAt: organization.createdAt.toISOString()
    }
}