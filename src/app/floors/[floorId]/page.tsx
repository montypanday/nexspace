import {getFloor, getFloorPlan} from "@/features/floors/server/queries";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { FloorPlanView } from "@/features/floors/components/floor-plan-view";
import {toStageElementDto} from "@/features/floors/mappers";

export default async function Page({
    params,
}: {
    params: Promise<{ floorId: string }>
}) {
    const { floorId } = await params
    // const spaces = await getSpaces(floorId);
    const floor = await getFloor(floorId);
    const floorPlan = floor.activeFloorPlanId ? await getFloorPlan(floor.activeFloorPlanId) : null
    // get elements from active floorPlan
    const floorPlanElements =
        floorPlan !== null ?
            floorPlan.elements.map((e) => toStageElementDto(e, false))
            : [];

    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex items-center gap-4 mt-4 w-full justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/buildings/${floor.buildingId}`}>
                            <Button size="icon" variant="outline">
                                <ChevronLeft />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{floor.floorName}</h1>
                            <p className="text-muted-foreground">{floor.floorId}</p>
                        </div>
                    </div>
                    <Link href={`/floors/${floorId}/designer`}>
                        <Button variant="default" size="sm" className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit Floor Plan
                        </Button>
                    </Link>
                </div>
                    <div className="w-full h-full">
                        <h2 className="text-lg font-semibold mb-4">Floor Plan View</h2>
                        <div className="h-screen">
                            {floor && floorPlan && <FloorPlanView floor={floor} floorPlan={floorPlan} elements={floorPlanElements}/>}
                        </div>
                    </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {spaces.map((space) => <SpaceCard key={space.id} space={space} />)}
                </div> */}
            </main>
        </div>
    );
}
