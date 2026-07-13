import {LatLngExpression} from "leaflet";

export interface BuildingDto {
    id: string;
    name: string;
    address: string | null;
    footprints: LatLngExpression[]
    locationId: string;
    locationName: string;
    organizationId: string;
    organizationName: string;
}