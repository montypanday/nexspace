// import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

export function EmptyBuilding() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Layers />
                </EmptyMedia>
                <EmptyTitle>No floors plans</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t added any floor plans. Get started by creating
                    your first floor plan.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
                {/* <Button>Create Floor plan</Button>
                <Button variant="outline">Import Floor Plan</Button> */}
            </EmptyContent>
            <Button variant="link" className="text-muted-foreground" size="sm" nativeButton={false} render={<a href="#">Learn More <ArrowUpRightIcon /></a>} />
        </Empty>
    )
}
