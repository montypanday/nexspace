import {SpaceDto, SpaceStatus} from "@/features/spaces/types";
import {SpaceSelectPayload} from "@/features/spaces/server/queries";

export function toSpaceDto(space: SpaceSelectPayload): SpaceDto {
    return {
        id: space.id,
        status: space.status.toLowerCase() as SpaceStatus,
        floorId: space.floor.id,
        floorName: space.floor.name,
        floorPlanId: space.floorPlan.id,
        floorPlanName: space.floorPlan.name,
        buildingId: space.floor.building.id,
        buildingName: space.floor.building.name,
        locationId: space.floor.building.location.id,
        locationName: space.floor.building.location.name
    }
}