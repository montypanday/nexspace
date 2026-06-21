import { Group, Rect } from "react-konva"
import { ElementProps } from "@/components/designer/element"

export function DeskPod4Konva({ id, x, y, draggable = true, onClick }: ElementProps) {
    return (
        <Group id={id} x={x} y={y} draggable={draggable} onClick={onClick}>
            {/* Desks */}
            <Rect x={8} y={8} width={34} height={24} cornerRadius={4} fill="#e4e4e7" stroke="#e5e7eb" />
            <Rect x={58} y={8} width={34} height={24} cornerRadius={4} fill="#e4e4e7" stroke="#e5e7eb" />
            <Rect x={8} y={68} width={34} height={24} cornerRadius={4} fill="#e4e4e7" stroke="#e5e7eb" />
            <Rect x={58} y={68} width={34} height={24} cornerRadius={4} fill="#e4e4e7" stroke="#e5e7eb" />

            {/* Divider */}
            <Rect x={8} y={40} width={84} height={20} fill="#e5e7eb" />

            {/* Chairs outside */}
            <Rect x={18} y={2} width={20} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={62} y={2} width={20} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={18} y={94} width={20} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={62} y={94} width={20} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={2} y={18} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
            <Rect x={2} y={62} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
            <Rect x={90} y={18} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
            <Rect x={90} y={62} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
        </Group>
    )
}
