import { cn } from "@/lib/utils"

export function PolygonElement({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={cn("w-full h-full", className)}
        >
            <polygon
                points="10,10 90,10 90,60 50,90 10,60"
                fill="white"
                stroke="black"
                strokeWidth={2}
            />
        </svg>
    )
}
