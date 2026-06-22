import { cn } from "@/lib/utils"

export function TextElement({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={cn("w-full h-full", className)}
        >
            <text
                x="50"
                y="55"
                fontSize="20"
                textAnchor="middle"
                fill="black"
                dominantBaseline="middle"
            >
                Text
            </text>
        </svg>
    )
}
