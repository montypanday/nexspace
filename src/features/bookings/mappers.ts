import {BookableAssetSelectPayload, BookingSelectPayload} from "./server/queries"
import type {BookableAssetDto, BookingDto} from "./types"

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
        bookableAssetId: booking.bookableAsset.id,
        bookableAssetName: booking.bookableAsset.name,
        floorId: booking.bookableAsset.floor.id,
        floorName: booking.bookableAsset.floor.name,
        buildingId: booking.bookableAsset.floor.building.id,
        buildingName: booking.bookableAsset.floor.building.name,
        locationId: booking.bookableAsset.floor.building.location.id,
        locationName: booking.bookableAsset.floor.building.location.name,
    }
}

export function toBookableAssetDto(bookableAsset: BookableAssetSelectPayload): BookableAssetDto {
    return {
        id: bookableAsset.id,
        name: bookableAsset.name,
        floorId: bookableAsset.floor.id,
        floorName: bookableAsset.floor.name,
        buildingId: bookableAsset.floor.building.id,
        buildingName: bookableAsset.floor.building.name,
        locationId: bookableAsset.floor.building.location.id,
        locationName: bookableAsset.floor.building.location.name,
        organizationId: bookableAsset.organization.id,
        organizationName: bookableAsset.organization.name,
    }
}