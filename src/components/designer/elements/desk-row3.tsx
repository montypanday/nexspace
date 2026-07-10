import { cn } from "@/lib/utils";

export function DeskRow3({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <rect x="5" y="20" width="90" height="30" rx="4" className="fill-muted" />
            <line x1="38" y1="20" x2="38" y2="50" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="62" y1="20" x2="62" y2="50" strokeWidth="2" strokeDasharray="4 4" />
            <rect x="12" y="56" width="20" height="10" rx="3" className="fill-primary" />
            <rect x="40" y="56" width="20" height="10" rx="3" className="fill-primary" />
            <rect x="68" y="56" width="20" height="10" rx="3" className="fill-primary" />
        </svg>
    )
}
