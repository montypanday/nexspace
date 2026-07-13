'use client'

import { Group, Line, Circle } from "react-konva"
import { ElementProps } from "../../element"
import { IconPointerPlus } from "@tabler/icons-react";

export function PolygonKonva(props: ElementProps) {
    const points = props.attrs.points || []

    let singleDimPoints: number[] = [];
    let vertices: { x: number, y: number }[] = [];
    if (Array.isArray(points) && points.every(item => typeof item == 'object')) {
        singleDimPoints = points.flatMap((point) => [point.x, point.y])
        vertices = points;
    }
    if (Array.isArray(points) && points.every(item => typeof item == 'number')) {
        singleDimPoints = points
    }

    const updatePoint = (index: number, newPos: { x: number; y: number }) => {
        const updated = [...points]
        updated[index] = newPos

        if (!props.onChangeAttrs) { return }

        props.onChangeAttrs(props.id, {
            ...props.attrs,
            points: updated,
        })
    }



    return (
        <Group
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onDragEnd={props.onDragEnd}
            onTransformEnd={props.onTransformEnd}
            x={props.attrs.x}
            y={props.attrs.y}
        >
            {/* project this line relative to the parent group at 0, 0 */}
            <Line
                x={0}
                y={0}
                id={`line-${props.id}`}
                points={singleDimPoints}
                closed={props.attrs.closed}
                fill={props.attrs.fill}
                stroke={props.isSelected ? "#2563eb" : props.attrs.stroke}
                strokeWidth={props.attrs.strokeWidth}

            />

            {/* Vertices only show when selected */}
            {props.isSelected &&
                vertices.map((p, i) => (
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
                                if (props.onChangeAttrs) {
                                    props.onChangeAttrs(props.id, { ...props.attrs, points: updated });
                                }

                            }
                        }}
                    />
                ))}
            {/* Mid-edge add handles */}
            {props.isSelected &&
                vertices.map((p, i) => {
                    const next = vertices[(i + 1) % vertices.length];
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
                                if (props.onChangeAttrs) {
                                    props.onChangeAttrs(props.id, { ...props.attrs, points: updated });
                                }
                            }}
                        />
                    );
                })}
        </Group>
    )
}
