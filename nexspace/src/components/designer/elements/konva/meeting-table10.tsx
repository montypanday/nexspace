import { Group, Rect } from "react-konva"
import { ElementProps } from "@/components/designer/element"

export function Meeting10Konva({ id, x, y, draggable = true, onClick }: ElementProps) {
    return (<Group id={id} x={x} y={y} draggable={draggable} onClick={onClick}>
        <Rect
            x={10}
            y={30}
            width={80}
            height={30}
            cornerRadius={10}
            fill="#e4e4e7"
            stroke="#e5e7eb"
        />

        <Rect x={20} y={18} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={34} y={18} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={48} y={18} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={62} y={18} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={76} y={18} width={12} height={8} cornerRadius={3} fill="#3b82f6" />

        <Rect x={20} y={64} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={34} y={64} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={48} y={64} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={62} y={64} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
        <Rect x={76} y={64} width={12} height={8} cornerRadius={3} fill="#3b82f6" />
    </Group>
    )
}
