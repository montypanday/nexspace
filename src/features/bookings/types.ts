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
    spaceId: string;
    spaceName: string;
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    locationId: string;
    locationName: string;
}

export interface CheckOverlapInput {
    spaceId: string
    startTs: string | Date  // UTC ISO string or Date object
    endTs: string | Date    // UTC ISO string or Date object
    allDay: boolean
    ignoreBookingId?: string // Pass this when *updating* an existing booking
}