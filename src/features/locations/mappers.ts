import {LocationSelectPayload} from "@/features/locations/server/queries";
import {LocationDto} from "@/features/locations/types";

export function toLocationDto(location: LocationSelectPayload): LocationDto {
    return {
        id: location.id,
        name: location.name,
        address: location.address,
        coordinates: { lat: location.latitude, lng: location.longitude },
        createdAt: location.createdAt.toISOString(),
        organizationId: location.org.id,
        organizationName: location.org.name
    }
}