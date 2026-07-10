import { cn } from "@/lib/utils";

export function DeskDouble({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <rect x="10" y="20" width="35" height="40" rx="4" className="fill-muted" />
            <rect x="55" y="20" width="35" height="40" rx="4" className="fill-muted" />
            <rect x="18" y="64" width="20" height="10" rx="3" className="fill-primary" />
            <rect x="62" y="64" width="20" height="10" rx="3" className="fill-primary" />
        </svg>
    )
}
