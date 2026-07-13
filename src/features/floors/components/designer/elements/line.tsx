import { cn } from "@/lib/utils"

export function LineElement({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={cn("w-full h-full", className)}
        >
            <line
                x1={10}
                y1={10}
                x2={90}
                y2={90}
                stroke="black"
                strokeWidth={4}
            />
        </svg>
    )
}
