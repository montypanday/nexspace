import { Group, Rect } from "react-konva"
import { ElementProps } from "@/components/designer/element"

export function Meeting6Konva({ x, y, draggable = true }: ElementProps) {
    return (
        <Group x={x} y={y} draggable={draggable}>
            <Rect
                x={10}
                y={30}
                width={80}
                height={30}
                cornerRadius={6}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            <Rect x={30} y={18} width={16} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={54} y={18} width={16} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={30} y={64} width={16} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={54} y={64} width={16} height={8} cornerRadius={3} fill="#3b82f6" />
            <Rect x={4} y={40} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
            <Rect x={88} y={40} width={8} height={20} cornerRadius={3} fill="#3b82f6" />
        </Group>
    )
}
