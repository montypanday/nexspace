import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { LocationDto } from "@/data/location";
import { Button } from "../ui/button";
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
            <Link href={`/location/${location.id}`} className="w-full">
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