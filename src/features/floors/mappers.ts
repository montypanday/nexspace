import {FloorSelectPayload} from "@/features/floors/server/queries";
import {FloorDto} from "@/features/floors/types";

export function toFloorDto(floor: FloorSelectPayload): FloorDto {
    return {
        id: floor.id,
        name: floor.name,
        buildingId: floor.building.id,
        buildingName: floor.building.name,
        organizationId: floor.organization.id,
        organizationName: floor.organization.name
    }
}