import { Group, Rect } from "react-konva"
import { ElementProps } from "../../element"

export function DeskSingleKonva({ id, x, y, draggable = true, onClick }: ElementProps) {
    return (
        <Group id={id} x={x} y={y} draggable={draggable} onClick={onClick}>
            <Rect
                x={10}
                y={20}
                width={80}
                height={40}
                cornerRadius={4}
                fill="#e4e4e7" // muted
                stroke="#e5e7eb" // border
            />
            <Rect
                x={35}
                y={64}
                width={30}
                height={10}
                cornerRadius={3}
                fill="#3b82f6" // primary
            />
        </Group>
    )
}
