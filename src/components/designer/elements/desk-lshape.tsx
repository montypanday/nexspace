import { cn } from "@/lib/utils";

export function DeskLShape({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            {/* Desk surfaces */}
            <rect x="10" y="40" width="60" height="20" rx="4" className="fill-muted" />
            <rect x="50" y="10" width="20" height="50" rx="4" className="fill-muted" />

            {/* Inner cutout */}
            <rect x="50" y="40" width="20" height="20" className="fill-background" />

            {/* Chair in corner */}
            <rect x="46" y="58" width="20" height="10" rx="3" className="fill-primary" />
        </svg>
    )
}
