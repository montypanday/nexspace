'use server'

import { UpdateFootprintForm } from "@/components/form/update-footprint-form";
import { getBuilding } from "@/data/building";
import { getLocation } from "@/data/location";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const building = await getBuilding(slug);
    const location = await getLocation(building.locationId);
    return (
        <UpdateFootprintForm building={building} location={location} />
    )
}