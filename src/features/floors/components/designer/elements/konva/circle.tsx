'use client'

import { Circle, Group, Rect } from "react-konva"
import { ElementProps } from "../../element"

export function CircleKonva(props: ElementProps) {
    return (
        <Circle
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...props.attrs} />
    )
}
