import { Circle, Group, Rect } from "react-konva"
import { ElementProps } from "../../element"

export function CircleKonva({ x, y, draggable = true }: ElementProps) {
    return (
        <Group x={x} y={y} draggable={draggable}>
            <Circle />
        </Group>
    )
}
