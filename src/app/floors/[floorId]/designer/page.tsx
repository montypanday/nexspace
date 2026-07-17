
import { Designer } from "@/features/floors/components/designer/designer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {getFloor, getFloorPlan} from "@/features/floors/server/queries";
import {toStageElementDto} from "@/features/floors/mappers";

export default async function DesignerPage({
    params,
}: {
    params: Promise<{ floorId: string }>
}) {
    const { floorId } = await params;

    const floor = await getFloor(floorId);
    const floorPlan = floor.activeFloorPlanId ? await getFloorPlan(floor.activeFloorPlanId) : null
    // get elements from active floorPlan
    const floorPlanElements =
        floorPlan !== null ?
            floorPlan.elements.map((e) => toStageElementDto(e, true))
            : [];
    return (
        <div className="flex min-h-screen flex-col dark:bg-black">
            <header className="border-b bg-background p-4">
                <div className="flex items-center gap-4">
                    <Link href={`/floors/${floorId}`}>
                        <Button size="icon" variant="outline">
                            <ChevronLeft />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Floor Plan Designer</h1>
                        <p className="text-sm text-muted-foreground">Edit your floor layout</p>
                    </div>
                </div>
            </header>
            {floor.activeFloorPlanId && <Designer floorId={floor.floorId} floorPlanId={floor.activeFloorPlanId} initialElements={floorPlanElements} />}
        </div>
    );
}
