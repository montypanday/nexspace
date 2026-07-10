import { cn } from "@/lib/utils";

export function CircleElement({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="25" fill="white" stroke="black" />
        </svg>
    )
}
