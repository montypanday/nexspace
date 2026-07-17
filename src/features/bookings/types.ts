export interface BookingDto {
    id: string,
    title: string,
    startTs: string, // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
    endTs: string, // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
    allDay: boolean,
    url: string | null,
    createdAt: string // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
    userId: string
    userName: string | null,
    bookableAssetId: string;
    bookableAssetName: string;
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
}

export interface CheckOverlapInput {
    bookableAssetId: string
    startTs: string | Date  // UTC ISO string or Date object
    endTs: string | Date    // UTC ISO string or Date object
    allDay: boolean
    ignoreBookingId?: string // Pass this when *updating* an existing booking
}

export interface BookableAssetDto {
    id: string;
    name: string;
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
    organizationId: string;
    organizationName: string;
}