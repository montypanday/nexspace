import { TabsIcons } from "@/components/nav-tabs";
import { getSpaces } from "@/data/space";
import { SpaceCard } from "@/components/space-card";
import BackButton from "@/components/back-button";
import { getFloor } from "@/data/floor";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
            </main>
        </div>
    );
}
