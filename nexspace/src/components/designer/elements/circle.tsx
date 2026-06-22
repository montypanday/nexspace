import { cn } from "@/lib/utils";
import { Circle } from "react-konva"

export function CircleElement({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <circle cx="50" cy="50" r="25" fill="white" stroke="black" />
        </svg>
    )
}
