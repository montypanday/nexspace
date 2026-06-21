import { getFloors } from "@/data/floor";
import { FloorCard } from "@/components/card/floor-card";
import { getBuilding } from "@/data/building";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { EmptyBuilding } from "@/components/empty/empty-building";
import { AddFloorForm } from "@/components/form/add-floor-form";
// import { MapWrapper } from "@/components/map";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const floors = await getFloors(slug);
    const building = await getBuilding(slug);
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex justify-between w-full align-middle">
                    <div className="flex items-center gap-4 mt-4">
                        <Link href={`/location/${building.locationId}`}>
                            <Button size="icon" variant="outline">
                                <ChevronLeft />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{building.name}</h1>
                            <p className="text-muted-foreground">{building.id}</p>
                        </div>
                    </div>
                    <div>
                        <AddFloorForm building={building} />
                    </div>
                </div>
                {floors.length == 0 && <EmptyBuilding />}
                {floors.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {floors.map((floor) => <FloorCard key={floor.id} floor={floor} />)}
                </div>}
            </main>
        </div>
    );
}
