import { cn } from "@/lib/utils";

export function DeskSingle({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <rect x="10" y="20" width="80" height="40" rx="4" className="fill-muted" />
            <rect x="35" y="64" width="30" height="10" rx="3" className="fill-primary" />
        </svg>
    )
}
