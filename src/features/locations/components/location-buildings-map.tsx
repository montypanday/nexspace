"use client"

import { Map, MapMarker, MapPolygon, MapPopup, MapTileLayer, MapZoomControl } from "@/components/maps/map"
import { BuildingDto } from "@/features/buildings/types"
import { LocationDto } from "@/features/locations/types"
import type { LatLngExpression } from "leaflet"
import { useTheme } from "next-themes"
import React from "react"
import { Tooltip, useMap } from "react-leaflet"

export interface LocationBuildingsProps {
    buildings: BuildingDto[],
    location: LocationDto
}

export function LocationBuildingsMap(props: LocationBuildingsProps) {
    const buildingsData: { id: string, name: string, coordinates: LatLngExpression[] }[] = props.buildings.map((building) => {
        return {
            id: building.id,
            name: building.name,
            coordinates: building.footprints
        }
    });

    return (
        <Map center={{
            "lat": props.location.coordinates.lat,
            "lng": props.location.coordinates.lng
        }} zoom={18} maxZoom={25}>
            <MapTileLayer maxNativeZoom={18} maxZoom={25} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* 2. Map over each individual building object */}
            {buildingsData.map((building, idx) => (
                <MapPolygon
                    key={building.id}
                    positions={building.coordinates}
                    pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.3 }}
                >
                    {/* Choice A: Text that stays permanently centered inside the polygon */}
                    {/* <Tooltip permanent direction="center" className="bg-transparent border-none shadow-none">
                        <span className="font-semibold text-xs tracking-tight bg-background/90 text-foreground px-2 py-1 rounded-md border shadow-sm">
                            {building.name}
                        </span>
                    </Tooltip> */}
                    {/* <Tooltip
                        permanent
                        direction="center"
                        className="custom-building-tooltip"
                    >
                        <span className="font-semibold text-xs tracking-tight bg-white/90 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm dark:bg-slate-950/90 dark:text-slate-200 dark:border-slate-800">
                            {building.name}
                        </span>
                    </Tooltip>
                    <MapPopup className="w-56">
                        <div className="space-y-1">
                            <h4 className="font-medium leading-none">{building.name}</h4>
                            <p className="text-xs text-muted-foreground">Welcome to South America!</p>
                        </div>
                    </MapPopup> */}
                </MapPolygon>
            ))}
            {/* {CITIES.map((city) => (
                <MapMarker key={city.name} position={city.coordinates} />
            ))} */}
            <MapZoomControl position="right-1 bottom-1" />
        </Map>
    )
}
