import { Group, Rect } from "react-konva"
import { ElementProps } from "@/components/designer/element"

export function Meeting4Konva({ x, y, draggable = true }: ElementProps) {
    return (
        <Group x={x} y={y} draggable={draggable}>
            <Rect
                x={20}
                y={30}
                width={60}
                height={30}
                cornerRadius={6}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            <Rect x={40} y={18} width={20} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={40} y={64} width={20} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={14} y={40} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
            <Rect x={78} y={40} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
        </Group>
    )
}
