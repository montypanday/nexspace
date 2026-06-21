import { Button } from "@/components/ui/button";
import { getBuildings } from "@/data/building";
import { BuildingCard } from "@/components/card/building-card";
import { getLocation } from "@/data/location";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LocationBuildings } from "@/components/location-buildings";
import { AddBuildingForm } from "@/components/form/add-building-form";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const buildings = await getBuildings(slug);
    const location = await getLocation(slug);
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex justify-between w-full align-middle">
                    <div className="flex items-center gap-4 mt-4">
                        <Link href={`/organization/${location.organizationId}`}>
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
                <LocationBuildings buildings={buildings} location={location} />
            </main>
        </div>
    );
}
