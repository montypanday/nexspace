'use client';
import { Map, MapMarker, MapTileLayer } from "@/components/ui/map"
import type { LatLngExpression } from "leaflet"
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';

// Sub-component to manage map bounds
function ChangeView({ markers }: { markers: LatLngExpression[] }) {
    const map = useMap(); // Accesses the native Leaflet map object

    useEffect(() => {
        if (markers.length === 0) return;

        // Create a LatLngBounds object from the markers array
        const bounds = L.latLngBounds(markers);

        // Zoom and pan the map to fit all points safely
        map.fitBounds(bounds, {
            padding: [50, 50], // Add pixel padding so markers don't hit the screen edge
            maxZoom: 15,       // Prevent extreme zoom when fitting a single marker
            animate: true      // Smooth transition animation
        });
    }, [markers, map]);

    return null;
}

export interface MapLocation {
    name: string;
    coordinates: LatLngExpression;
}

export interface OrganizationLocationsProps {
    locations: MapLocation[];
}

export function OrganizationLocationsMap({ locations }: OrganizationLocationsProps) {

    // Extract coordinate list for map boundary fitting
    const markerCoordinates = locations.map((loc) => loc.coordinates);

    // Guard clause to prevent runtime crashes if the locations array is empty
    if (locations.length === 0) {
        return <div>No locations available.</div>;
    }

    // Safely fallback to the first item if index 1 doesn't exist
    const initialCenter = locations[1]?.coordinates ?? locations[0].coordinates;

    return (
        <Map center={initialCenter} zoom={4}>
            <MapTileLayer />

            {locations.map((location) => (
                <MapMarker
                    key={location.name}
                    position={location.coordinates}
                />
            ))}

            {/* Synchronise the map bounds when markers change */}
            <ChangeView markers={markerCoordinates} />
        </Map>
    )
}
