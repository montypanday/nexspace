export type SpaceStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface SpaceDto {
    id: string;
    name: string;
    status: SpaceStatus;
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
}