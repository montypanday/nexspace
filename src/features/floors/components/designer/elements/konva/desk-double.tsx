"use client"

import { Group, Rect } from "react-konva"
import { ElementProps } from "../../element"

export function DeskDoubleKonva(props: ElementProps) {
    return (
        <Group
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...props.attrs}>
            <Rect
                x={10}
                y={20}
                width={35}
                height={40}
                cornerRadius={4}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            <Rect
                x={55}
                y={20}
                width={35}
                height={40}
                cornerRadius={4}
                fill="#e4e4e7"
                stroke="#e5e7eb"
            />
            <Rect
                x={18}
                y={64}
                width={20}
                height={10}
                cornerRadius={3}
                fill="#3b82f6"
            />
            <Rect
                x={62}
                y={64}
                width={20}
                height={10}
                cornerRadius={3}
                fill="#3b82f6"
            />
        </Group>
    )
}
