import { Button } from "@/components/ui/button";
import { getBuildings } from "@/features/buildings/server/queries";
import { BuildingCard } from "@/features/buildings/components/building-card";
import { getLocation } from "@/features/locations/server/queries";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LocationBuildingsMap } from "@/features/locations/components/location-buildings-map";
import { AddBuildingForm } from "@/features/buildings/components/add-building-form";

export default async function Page({
    params,
}: {
    params: Promise<{ locationId: string }>
}) {
    const { locationId } = await params
    const buildings = await getBuildings(locationId);
    const location = await getLocation(locationId);
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex justify-between w-full align-middle">
                    <div className="flex items-center gap-4 mt-4">
                        <Link href={`/organizations/${location.organizationId}`}>
                            <Button size="icon" variant="outline">
                                <ChevronLeft />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{location.name}</h1>
                            <p className="text-muted-foreground">{location.address}</p>
                        </div>
                    </div>
                    <div>
                        <AddBuildingForm location={location} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {buildings.map((building) => <BuildingCard key={building.id} building={building} />)}
                </div>
                <LocationBuildingsMap buildings={buildings} location={location} />
            </main>
        </div>
    );
}
