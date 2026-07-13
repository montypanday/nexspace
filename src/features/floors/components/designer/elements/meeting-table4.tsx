import { cn } from "@/lib/utils";

export function Meeting4({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <rect x="20" y="30" width="60" height="30" rx="6" className="fill-muted" />
            <rect x="40" y="18" width="20" height="8" rx="3" className="fill-primary" />
            <rect x="40" y="64" width="20" height="8" rx="3" className="fill-primary" />
            <rect x="14" y="40" width="8" height="20" rx="3" className="fill-primary" />
            <rect x="78" y="40" width="8" height="20" rx="3" className="fill-primary" />
        </svg>
    )
}
