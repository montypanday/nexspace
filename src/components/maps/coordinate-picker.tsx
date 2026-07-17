"use client"

import * as React from "react"
import { MapPin, MapPinIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Map, MapLocateControl, MapMarker, MapSearchControl, MapTileLayer } from "./map"
import { PlaceFeature } from "../ui/place-autocomplete"
import { formatAddress } from "@/lib/utils"
import { useMap } from "react-leaflet"
import { LatLngExpression } from "leaflet"

export interface LocationValue {
    lat: string
    lng: string
    address: string
}

interface CoordinatePickerProps {
    value: LocationValue | undefined
    onChange: (value: LocationValue) => void
    defaultCenter?: [number, number]
}

export function CoordinatePicker({
    value,
    onChange,
    defaultCenter = [-37.8136, 144.9631], // Melbourne default
}: CoordinatePickerProps) {
    // Use current values or fallback to default coordinates safely
    const lat = Number(value?.lat) || defaultCenter[0]
    const lng = Number(value?.lng) || defaultCenter[1]

    // 1. Create a controlled open state for the popover
    const [open, setOpen] = React.useState(false)

    const onPlaceSelect = (feature: PlaceFeature) => {
        const location: LocationValue = {
            // latitude lng are inversed in GeoJson
            lat: feature.geometry.coordinates[1].toString(),
            lng: feature.geometry.coordinates[0].toString(),
            address: formatAddress(feature.properties)
        }
        onChange(location)
        // 2. Close the popover immediately after selection
        setOpen(false)
    }

    return <div className="space-y-4 w-full">
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={<Button variant="outline" type="button" className="w-full justify-start gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Search address</span>
            </Button>}>

            </PopoverTrigger>
            <PopoverContent className="w-90 p-0" align="start">
                <div className="h-60 w-full overflow-hidden rounded-md">
                    <Map center={[lat, lng]}>
                        <MapTileLayer />
                        <CoordinatePickerWrapper onSelect={onPlaceSelect} />
                        <MapLocateControl />
                    </Map>
                </div>
                <div className="p-3 bg-muted/50 border-t text-xs text-muted-foreground flex justify-between">
                    <span>Lat: {lat}</span>
                    <span>Lng: {lng}</span>
                </div>
            </PopoverContent>
        </Popover>
    </div>
}


function CoordinatePickerWrapper({
    onSelect
}: {
    onSelect: (feature: PlaceFeature) => void
}) {

    const map = useMap()
    const [selectedPosition, setSelectedPosition] = React.useState<LatLngExpression | null>(null)

    React.useEffect(() => {
        if (!selectedPosition) return
        map.panTo(selectedPosition)
    }, [selectedPosition])

    const onPlaceSelect = (feature: PlaceFeature) => {
        setSelectedPosition(
            feature.geometry.coordinates.toReversed() as LatLngExpression
        )
        onSelect(feature)
    }

    return (<>
        <MapSearchControl
            onPlaceSelect={onPlaceSelect}
        />
        {selectedPosition && (
            <MapMarker position={selectedPosition} icon={<MapPinIcon />} />
        )}
    </>

    )
}
