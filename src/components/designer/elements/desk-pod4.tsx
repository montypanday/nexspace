import { cn } from "@/lib/utils";

export function DeskPod4({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={cn("w-full h-full stroke-border", className)}>
            {/* Desks */}
            <rect x="8" y="8" width="34" height="24" rx="4" className="fill-muted" />
            <rect x="58" y="8" width="34" height="24" rx="4" className="fill-muted" />
            <rect x="8" y="68" width="34" height="24" rx="4" className="fill-muted" />
            <rect x="58" y="68" width="34" height="24" rx="4" className="fill-muted" />

            {/* Divider */}
            <rect x="8" y="40" width="84" height="20" className="fill-secondary" />

            {/* Chairs on outside */}
            <rect x="18" y="2" width="20" height="8" rx="3" className="fill-primary" />
            <rect x="62" y="2" width="20" height="8" rx="3" className="fill-primary" />
            <rect x="18" y="94" width="20" height="8" rx="3" className="fill-primary" />
            <rect x="62" y="94" width="20" height="8" rx="3" className="fill-primary" />
            {/* <rect x="2" y="18" width="8" height="20" rx="3" className="fill-primary" />
            <rect x="2" y="62" width="8" height="20" rx="3" className="fill-primary" /> */}
            {/* <rect x="90" y="18" width="8" height="20" rx="3" className="fill-primary" />
            <rect x="90" y="62" width="8" height="20" rx="3" className="fill-primary" /> */}
        </svg>
    )
}
