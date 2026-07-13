import {LatLngLiteral} from "leaflet";

export interface LocationDto {
    id: string;
    name: string;
    address: string | null;
    coordinates: LatLngLiteral
    createdAt: string;
    organizationId: string;
    organizationName: string;
}