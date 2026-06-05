import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { FloorDto } from "@/data/floor";
import { ChevronRight, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { IconDesk } from "@tabler/icons-react";

export function FloorCard({ floor }: { floor: FloorDto }) {
    return <Card className="hover:shadow-md transition-shadow">
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="bg-primary/10 p-2.5 rounded-lg">
                        <Layers />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{floor.name}</h3>
                            <Badge>Open plan</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <IconDesk />
                                <span>25 spaces</span>
                            </div>
                        </div>
                    </div>
                    <Link href={`/floor/${floor.id}`}>
                        <Button size="icon">
                            <ChevronRight />
                        </Button>
                    </Link>
                </div>
            </div>
        </CardContent>
    </Card>
}