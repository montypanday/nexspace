import { getLocations } from "@/data/location";
import { LocationCard } from "@/components/card/location-card";
import { getOrganization } from "@/data/organization";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrganizationLocations } from "@/components/organization-locations";
import { AddLocationForm } from "@/components/form/add-location-form";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const locations = await getLocations(slug);
    const organization = await getOrganization(slug);

    return (
        <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
            <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex justify-between w-full align-middle">
                    <div className="flex items-center gap-4 mt-4">
                        <Link href="/">
                            <Button size="icon" variant="outline">
                                <ChevronLeft />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{organization.name}</h1>
                            <p className="text-muted-foreground">{organization.id}</p>
                        </div>
                    </div>
                    <div className="">
                        <AddLocationForm organization={organization} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Global Locations</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {locations.map((location) => <LocationCard key={location.id} location={location} />)}
                </div>
                <OrganizationLocations locations={locations} />
            </main>
        </div>
    );
}
