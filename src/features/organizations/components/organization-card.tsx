import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrganizationDto } from "@/features/organizations/types";
import Link from "next/link";
import { Building2Icon, GroupIcon, MapPin, Users2Icon } from "lucide-react";

export function OrganizationCard({ organization }: { organization: OrganizationDto }) {
    return <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2.5 rounded-lg">
                    <GroupIcon />
                </div>
                <div className="">
                    <CardTitle className="text-lg">
                        {organization.name}
                    </CardTitle>
                    <CardDescription>
                        Sample Description
                    </CardDescription>
                </div>
            </div>
            <CardAction>
                {/* <Badge>46 available</Badge> */}
            </CardAction>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin width={24} height={24} />
                            <span className="text-xs">
                                Locations
                            </span>
                        </div>
                        <p className="text-lg font-semibold">200</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Building2Icon width={24} height={24} />
                            <span className="text-xs">
                                Buildings
                            </span>
                        </div>
                        <p className="text-lg font-semibold">8</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users2Icon width={24} height={24} />
                            <span className="text-xs">Active members</span>
                        </div>
                        <p className="text-lg font-semibold">78</p>
                    </div>
                </div>
                <div className="space-y-2"><p className="text-sm font-medium">Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                        <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&amp;]:hover:bg-accent [a&amp;]:hover:text-accent-foreground text-xs">Gym</span><span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&amp;]:hover:bg-accent [a&amp;]:hover:text-accent-foreground text-xs">Cafeteria</span><span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&amp;]:hover:bg-accent [a&amp;]:hover:text-accent-foreground text-xs">Rooftop Terrace</span>
                        <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&amp;]:hover:bg-accent [a&amp;]:hover:text-accent-foreground text-xs">Parking
                        </span>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Link href={`/organizations/${organization.id}`} className="w-full">
                <Button className="w-full">
                    Navigate locations
                </Button>
            </Link>
        </CardFooter>
    </Card>
}