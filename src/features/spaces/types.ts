export type SpaceStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface SpaceDto {
    id: string;
    status: SpaceStatus;
    floorId: string;
    floorName: string;
    floorPlanId: string;
    floorPlanName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
}