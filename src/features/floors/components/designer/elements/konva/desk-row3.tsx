'use client'

import { Group, Rect, Line } from "react-konva"
import { StageElementDto } from "@/features/floors/types";

export function DeskRow3Konva(props: StageElementDto) {
    return (
        <Group
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...props.attrs}>
            <Rect
                x={5}
                y={20}
                width={90}
                height={30}
                cornerRadius={4}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            <Line
                points={[38, 20, 38, 50]}
                stroke="#d4d4d8"
                strokeWidth={2}
                dash={[4, 4]}
            />
            <Line
                points={[62, 20, 62, 50]}
                stroke="#d4d4d8"
                strokeWidth={2}
                dash={[4, 4]}
            />
            <Rect x={12} y={56} width={20} height={10} cornerRadius={3} fill="#3b82f6" />
            <Rect x={40} y={56} width={20} height={10} cornerRadius={3} fill="#3b82f6" />
            <Rect x={68} y={56} width={20} height={10} cornerRadius={3} fill="#3b82f6" />
        </Group>
    )
}
