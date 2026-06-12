"use client"

import { Map, MapMarker, MapPolygon, MapPopup, MapTileLayer } from "@/components/ui/map"
import type { LatLngExpression } from "leaflet"
import { Tooltip } from "react-leaflet"

export function LocationBuildings() {
    // 1. Structure data with coordinates and explicit building names
    const buildingsData = [
        {
            name: "Alpha Block",
            coordinates: [
                { lat: -38.19718726092073, lng: -215.7064783573151 },
                { lat: -38.196580179195855, lng: -215.70583462715152 },
                { lat: -38.19671508668321, lng: -215.70556640625003 },
                { lat: -38.19732216728337, lng: -215.70622086524966 }
            ] as LatLngExpression[]
        },
        {
            name: "Bravo Complex",
            coordinates: [
                {
                    "lat": -38.19718789326915,
                    "lng": -215.70572733879092
                },
                {
                    "lat": -38.196715719035744,
                    "lng": -215.70519626140597
                },
                {
                    "lat": -38.196167023461044,
                    "lng": -215.70465445518496
                },
                {
                    "lat": -38.19641997622998,
                    "lng": -215.70410728454593
                },
                {
                    "lat": -38.19666449640474,
                    "lng": -215.7045578956604
                },
                {
                    "lat": -38.196799403735895,
                    "lng": -215.70445060729983
                },
                {
                    "lat": -38.19666449640474,
                    "lng": -215.70416092872622
                },
                {
                    "lat": -38.19684156222562,
                    "lng": -215.7042682170868
                },
                {
                    "lat": -38.197414915262705,
                    "lng": -215.70482611656192
                },
                {
                    "lat": -38.19726314578046,
                    "lng": -215.70502996444705
                },
                {
                    "lat": -38.197414915262705,
                    "lng": -215.7053625583649
                }
            ] as LatLngExpression[]
        }
    ]

    return (
        <Map center={{
            "lat": -38.19718726092073,
            "lng": -215.7064783573151
        }} zoom={17}>
            <MapTileLayer />
            {/* 2. Map over each individual building object */}
            {buildingsData.map((building, idx) => (
                <MapPolygon
                    key={idx}
                    positions={building.coordinates}
                    pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.3 }}
                >
                    {/* Choice A: Text that stays permanently centered inside the polygon */}
                    {/* <Tooltip permanent direction="center" className="bg-transparent border-none shadow-none">
                        <span className="font-semibold text-xs tracking-tight bg-background/90 text-foreground px-2 py-1 rounded-md border shadow-sm">
                            {building.name}
                        </span>
                    </Tooltip> */}
                    <Tooltip
                        permanent
                        direction="center"
                        className="custom-building-tooltip"
                    >
                        <span className="font-semibold text-xs tracking-tight bg-white/90 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm dark:bg-slate-950/90 dark:text-slate-200 dark:border-slate-800">
                            {building.name} {/* Or building.number depending on your data schema */}
                        </span>
                    </Tooltip>

                    {/* Choice B: Context dialog that opens only when the building is clicked */}
                    <MapPopup className="w-56">
                        <div className="space-y-1">
                            <h4 className="font-medium leading-none">{building.name}</h4>
                            <p className="text-xs text-muted-foreground">Welcome to South America!</p>
                        </div>
                    </MapPopup>
                </MapPolygon>
            ))}
            {/* {CITIES.map((city) => (
                <MapMarker key={city.name} position={city.coordinates} />
            ))} */}
        </Map>
    )
}
