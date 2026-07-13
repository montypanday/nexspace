'use server'

import { UpdateFootprintForm } from "@/features/buildings/components/update-footprint-form";
import { getBuilding } from "@/features/buildings/server/queries";
import { getLocation } from "@/features/locations/server/queries";

export default async function Page({
    params,
}: {
    params: Promise<{ buildingId: string }>
}) {
    const { buildingId } = await params
    const building = await getBuilding(buildingId);
    const location = await getLocation(building.locationId);
    return (
        <UpdateFootprintForm building={building} location={location} />
    )
}