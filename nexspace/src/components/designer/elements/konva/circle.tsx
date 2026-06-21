import { Circle, Group, Rect } from "react-konva"
import { ElementProps } from "../../element"

export function CircleKonva({ id, x, y, draggable = true, onClick }: ElementProps) {
    return (
        <Group id={id} x={x} y={y} draggable={draggable} onClick={onClick}>
            <Circle />
        </Group>
    )
}
