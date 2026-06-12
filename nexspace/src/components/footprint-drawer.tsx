"use client";

import {
    Map,
    MapSearchControl,
    MapTileLayer,
    MapDrawCircle,
    MapDrawControl,
    MapDrawDelete,
    MapDrawEdit,
    MapDrawMarker,
    MapDrawPolygon,
    MapDrawPolyline,
    MapDrawRectangle,
    MapDrawUndo,
    MapMarker,
} from "@/components/ui/map"
import type { FeatureGroup, LatLngExpression } from "leaflet"
import { MapPinIcon } from "lucide-react";
import React from "react";
import { useMap } from "react-leaflet";

export function FootprintDrawer() {
    const CENTRE_COORDINATES = [-38.149287741183834, 144.35996496010284] satisfies LatLngExpression

    const onLayersChange = (layers: FeatureGroup) => {
        console.log(layers)
        console.log(layers.toGeoJSON())
    }

    return (
        <Map center={CENTRE_COORDINATES}>
            <MapTileLayer />
            <MapSearchControlWrapper />
            <MapDrawControl onLayersChange={onLayersChange}>
                <MapDrawMarker />
                <MapDrawPolyline />
                <MapDrawCircle />
                <MapDrawRectangle />
                <MapDrawPolygon />
                <MapDrawEdit />
                <MapDrawDelete />
                <MapDrawUndo />
            </MapDrawControl>
        </Map>
    )
}

function MapSearchControlWrapper() {
    const map = useMap()
    const [selectedPosition, setSelectedPosition] =
        React.useState<LatLngExpression | null>(null)

    React.useEffect(() => {
        if (!selectedPosition) return
        map.panTo(selectedPosition)
    }, [selectedPosition])

    return (
        <>
            <MapSearchControl
                onPlaceSelect={(feature) =>
                    setSelectedPosition(
                        feature.geometry.coordinates.toReversed() as LatLngExpression
                    )
                }
            />
            {selectedPosition && (
                <MapMarker position={selectedPosition} icon={<MapPinIcon />} />
            )}
        </>
    )
}