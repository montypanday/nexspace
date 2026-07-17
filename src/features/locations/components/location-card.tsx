import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LocationDto } from "@/features/locations/types";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function LocationCard({ location }: { location: LocationDto }) {
    return <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2.5 rounded-lg">
                    <MapPin />
                </div>
                <div className="">
                    <CardTitle className="text-lg">
                        {location.name}
                    </CardTitle>
                    <CardDescription>
                        {location.address}
                    </CardDescription>
                </div>
            </div>
            <CardAction>
                {/* <Badge>46 available</Badge> */}
            </CardAction>

        </CardHeader>
        <CardContent>

        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Link href={`/locations/${location.id}`} className="w-full">
                <Button
                    className="w-full"
                    size="sm"
                >
                    Show buildings
                </Button>
            </Link>

        </CardFooter>
    </Card>
}