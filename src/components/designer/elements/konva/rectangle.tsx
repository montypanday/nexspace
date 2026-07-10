'use client'

import { Rect } from "react-konva"
import { ElementProps } from "../../element"

export function RectangleKonva(props: ElementProps) {
    return (
        <Rect
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...props.attrs} />
    )
}
