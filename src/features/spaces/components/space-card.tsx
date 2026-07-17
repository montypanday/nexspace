import { FullscreenIcon, MonitorIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpaceDto } from "@/features/spaces/types";
import Link from "next/link";

export function SpaceCard({ space }: { space: SpaceDto }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            {/*{space.name}*/}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {space.floorName} • {space.buildingName}
                        </p>
                    </div>
                    {space.status === "available" && (
                        <Badge variant="secondary"
                            // className={statusColors[desk.status]}
                            className="bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        >
                            {space.status}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {/* {desk.currentUser && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{desk.currentUser}</span>
            </div>
          )} */}

                    <div className="flex flex-wrap gap-2">
                        {/* {desk.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
              >
                {amenityIcons[amenity]}
                <span>{amenity}</span>
              </div>
            ))} */}
                    </div>
                </div>
            </CardContent>
            {space.status === "available" && (
                <CardFooter className="flex-col gap-2">
                    <Link href={`/bookings/create/${space.id}`} className="w-full">
                        <Button
                            className="w-full"
                            size="sm"
                        >
                            Book Desk
                        </Button>
                    </Link>
                    <Link href={`/buildings/${space.buildingId}`} className="w-full">
                        <Button
                            className="w-full"
                            size="sm"
                            variant="outline"
                        >
                            {space.buildingName}
                        </Button>
                    </Link>

                </CardFooter>
            )
            }
        </Card >
        // <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border hover:shadow-md transition-shadow">
        //     <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
        //         <div className="flex items-start justify-between">
        //             <div>
        //                 <h4 className="text-lg">A-101</h4>
        //                 <p className="text-sm text-muted-foreground mt-1">1st Floor • North</p>
        //             </div>
        //             <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-secondary/90 bg-green-500/10 text-green-600 hover:bg-green-500/20">available</span>
        //         </div>
        //     </div>
        //     <div className="px-6 [&amp;:last-child]:pb-6">
        //         <div className="space-y-3">
        //             <div className="flex flex-wrap gap-2">
        //                 <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
        //                     <MonitorIcon /><span>Monitor</span>
        //                 </div>
        //                 <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
        //                     <FullscreenIcon /><span>Standing Desk</span>
        //                 </div>
        //             </div>
        //             <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5 w-full mt-2">
        //                 Book Desk
        //             </button>
        //         </div>
        //     </div>
        // </div>
    )
}
