import { cn } from "@/lib/utils";

export function Meeting10({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <rect x="10" y="30" width="80" height="30" rx="10" className="fill-muted" />

            {/* Top row */}
            <rect x="20" y="18" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="34" y="18" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="48" y="18" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="62" y="18" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="76" y="18" width="12" height="8" rx="3" className="fill-primary" />

            {/* Bottom row */}
            <rect x="20" y="64" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="34" y="64" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="48" y="64" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="62" y="64" width="12" height="8" rx="3" className="fill-primary" />
            <rect x="76" y="64" width="12" height="8" rx="3" className="fill-primary" />
        </svg>
    )
}
