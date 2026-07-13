import { cn } from "@/lib/utils";

export function Meeting6({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            <rect x="10" y="30" width="80" height="30" rx="6" className="fill-muted" />
            <rect x="30" y="18" width="16" height="8" rx="3" className="fill-primary" />
            <rect x="54" y="18" width="16" height="8" rx="3" className="fill-primary" />
            <rect x="30" y="64" width="16" height="8" rx="3" className="fill-primary" />
            <rect x="54" y="64" width="16" height="8" rx="3" className="fill-primary" />
            <rect x="4" y="40" width="8" height="20" rx="3" className="fill-primary" />
            <rect x="88" y="40" width="8" height="20" rx="3" className="fill-primary" />
        </svg>
    )
}
