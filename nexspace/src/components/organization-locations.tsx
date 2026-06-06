import { Map, MapMarker, MapTileLayer } from "@/components/ui/map"
import type { LatLngExpression } from "leaflet"

export function OrganizationLocations() {
    const CITIES = [
        {
            name: "Waurn Ponds",
            coordinates: [-38.19855978238883, 144.29821922675296] satisfies LatLngExpression,
        },
        {
            name: "Waterfront",
            coordinates: [-38.14383788016828, 144.35995884282156] satisfies LatLngExpression,
        },
        {
            name: "Burwood",
            coordinates: [-37.849579437134935, 145.1145805524464] satisfies LatLngExpression,
        },
        {
            name: "Warranambool",
            coordinates: [-38.39088845716636, 142.5386681780042] satisfies LatLngExpression,
        },
    ]

    return (
        <Map center={CITIES[1].coordinates} zoom={4}>
            <MapTileLayer />
            {CITIES.map((city) => (
                <MapMarker key={city.name} position={city.coordinates} />
            ))}
        </Map>
    )
}
