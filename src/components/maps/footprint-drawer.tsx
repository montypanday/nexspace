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
    MapZoomControl,
    MapPolygon,
} from "@/components/maps/map"
import type { FeatureGroup, LatLngExpression } from "leaflet"
import L from "leaflet";
import { MapPinIcon } from "lucide-react";
import React from "react";
import { useMap } from "react-leaflet";
import { coordEach } from '@turf/meta';
import { Position } from "geojson";

interface FootprintDrawerProps {
    center: LatLngExpression,
    onDraw: (footprint: LatLngExpression[]) => void
}

export function FootprintDrawer(props: FootprintDrawerProps) {
    const CENTRE_COORDINATES = [-38.149287741183834, 144.35996496010284] satisfies LatLngExpression

    const onLayersChange = (layers: FeatureGroup) => {
        const footprint: LatLngExpression[] = []
        const geoJson = layers.toGeoJSON()
        if (geoJson.type == 'FeatureCollection') {
            geoJson.features.map((feature) => {
                coordEach(feature, (currentCoord: Position) => {
                    footprint.push({ lat: currentCoord[1], lng: currentCoord[0] })
                });
            });
        }
        props.onDraw(footprint)
    }

    return (
        <Map center={props.center || CENTRE_COORDINATES} zoom={18} maxZoom={25}>
            <MapTileLayer maxNativeZoom={18} maxZoom={25} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapSearchControlWrapper />
            {/* {props.footprints && <MapPolygon
                positions={props.footprints}
                pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.3 }}
            ></MapPolygon>} */}

            <MapDrawControl onLayersChange={onLayersChange}>
                {/* <MapDrawMarker />
                <MapDrawPolyline />
                <MapDrawCircle />
                <MapDrawRectangle /> */}
                <MapDrawPolygon />
                <MapDrawEdit />
                <MapDrawDelete />
                <MapDrawUndo />
            </MapDrawControl>
            <MapZoomControl position="right-1 bottom-1" />
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