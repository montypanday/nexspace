import { getSpaces } from "@/features/spaces/server/queries";
import { SpaceCard } from "@/features/spaces/components/space-card";
import { getFloor } from "@/features/floors/server/queries";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import FloorPlan from "@/features/floors/components/floor-plan";

export default async function Page({
    params,
}: {
    params: Promise<{ floorId: string }>
}) {
    const { floorId } = await params
    const spaces = await getSpaces(floorId);
    const floor = await getFloor(floorId);
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex items-center gap-4 mt-4">
                    <Link href={`/buildings/${floor.buildingId}`}>
                        <Button size="icon" variant="outline">
                            <ChevronLeft />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{floor.name}</h1>
                        <p className="text-muted-foreground">{floor.id}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {spaces.map((space) => <SpaceCard key={space.id} space={space} />)}
                </div>
                <div className="w-full px-4 py-4">
                    <FloorPlan />
                </div>
            </main>
        </div>
    );
}
