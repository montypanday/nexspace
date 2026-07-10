import { getSpaces } from "@/data/space";
import { SpaceCard } from "@/components/card/space-card";
import { getFloor } from "@/data/floor";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import FloorPlan from "@/components/floor-plan";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const spaces = await getSpaces(slug);
    const floor = await getFloor(slug);
    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex items-center gap-4 mt-4">
                    <Link href={`/building/${floor.buildingId}`}>
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
