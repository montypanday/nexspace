import {BuildingSelectPayload} from "./server/queries";
import {BuildingDto} from "./types";
import {LatLngExpression} from "leaflet";

export function toBuildingDto(building: BuildingSelectPayload): BuildingDto {
    return {
        id: building.id,
        name: building.name,
        address: building.address,
        locationId: building.location.id,
        locationName: building.location.name,
        organizationId: building.org.id,
        organizationName: building.org.name,
        footprints: building.footprints as unknown as LatLngExpression[]
    }
}