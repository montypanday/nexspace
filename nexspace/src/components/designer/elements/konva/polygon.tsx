import { Group, Line, Circle } from "react-konva"
import { ElementProps } from "../../element"

export function PolygonKonva({
    id,
    x,
    y,
    attrs,
    isSelected,
    onClick,
    onDragEnd,
    onTransformEnd,
    onChangeAttrs,
}: ElementProps & {
    isSelected: boolean
    onChangeAttrs: (id: string, newAttrs: any) => void
}) {
    const points = attrs.points || []

    const flat = points.flatMap((p) => [p.x, p.y])

    const updatePoint = (index: number, newPos: { x: number; y: number }) => {
        const updated = [...points]
        updated[index] = newPos

        onChangeAttrs(id, {
            ...attrs,
            points: updated,
        })
    }

    return (
        <Group
            id={id}
            x={x}
            y={y}
            draggable
            onClick={onClick}
            onDragEnd={onDragEnd}
            onTransformEnd={onTransformEnd}
        >
            <Line
                id={id}
                points={flat}
                closed
                fill="white"
                stroke={isSelected ? "#2563eb" : "black"}
                strokeWidth={2}
            />

            {/* Vertices only show when selected */}
            {isSelected &&
                points.map((p, i) => (
                    <Circle
                        key={i}
                        x={p.x}
                        y={p.y}
                        radius={6}
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth={2}
                        draggable
                        onDragMove={(e) =>
                            updatePoint(i, {
                                x: e.target.x(),
                                y: e.target.y(),
                            })
                        }
                        onContextMenu={(e) => {
                            e.evt.preventDefault();   // stop browser menu
                            e.cancelBubble = true;    // stop stage click
                            if (points.length > 3) {
                                const updated = points.filter((_, idx) => idx !== i);
                                onChangeAttrs(id, { ...attrs, points: updated });
                            }
                        }}
                    />
                ))}
            {/* Mid-edge add handles */}
            {isSelected &&
                points.map((p, i) => {
                    const next = points[(i + 1) % points.length];
                    const mid = { x: (p.x + next.x) / 2, y: (p.y + next.y) / 2 };

                    return (
                        <Circle
                            key={`mid-${i}`}
                            x={mid.x}
                            y={mid.y}
                            radius={5}
                            fill="#10b981"
                            stroke="white"
                            strokeWidth={2}
                            onMouseDown={(e) => (e.cancelBubble = true)}
                            onClick={() => {
                                const updated = [...points];
                                updated.splice(i + 1, 0, mid);
                                onChangeAttrs(id, { ...attrs, points: updated });
                            }}
                        />
                    );
                })}
        </Group>
    )
}
