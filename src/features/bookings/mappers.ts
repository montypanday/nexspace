import type { BookingSelectPayload } from "./server/queries"
import type { BookingDto } from "./types"

export function toBookingDto(booking: BookingSelectPayload): BookingDto {
    return {
        id: booking.id,
        title: booking.title,
        startTs: booking.startTs.toISOString(), // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
        endTs: booking.endTs?.toISOString() ?? null, // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
        allDay: booking.allDay,
        url: booking.url,
        createdAt: booking.createdAt.toISOString(), // ISO 8601 format string (e.g., "2026-06-01T12:00:00.000Z")
        userId: booking.user.id,
        userName: booking.user.name,
        spaceId: booking.space.id,
        spaceName: booking.space.name,
        floorId: booking.space.floor.id,
        floorName: booking.space.floor.name,
        buildingId: booking.space.floor.building.id,
        buildingName: booking.space.floor.building.name,
        locationId: booking.space.floor.building.location.id,
        locationName: booking.space.floor.building.location.name,
    }
}