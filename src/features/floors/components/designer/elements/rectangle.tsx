import { cn } from "@/lib/utils"

export function RectangleElement({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={cn("w-full h-full", className)}
        >
            <rect
                x={2}
                y={2}
                width={96}
                height={96}
                fill="white"
                stroke="black"
                strokeWidth={2}
            />
        </svg>
    )
}
