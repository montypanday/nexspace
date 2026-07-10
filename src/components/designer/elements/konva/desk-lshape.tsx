'use client'

import { Group, Rect } from "react-konva"
import { ElementProps } from "@/components/designer/element"

export function DeskLShapeKonva(props: ElementProps) {
    return (
        <Group
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...props.attrs}
        >
            {/* Horizontal desk */}
            <Rect
                x={10}
                y={40}
                width={60}
                height={20}
                cornerRadius={4}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            {/* Vertical desk */}
            <Rect
                x={50}
                y={10}
                width={20}
                height={50}
                cornerRadius={4}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            {/* Inner cutout */}
            <Rect x={50} y={40} width={20} height={20} fill="#ffffff" />
            {/* Chair in corner */}
            <Rect
                x={46}
                y={58}
                width={20}
                height={10}
                cornerRadius={3}
                fill="#3b82f6"
            />
        </Group>
    )
}
