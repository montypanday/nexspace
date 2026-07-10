'use client'

import { Text } from "react-konva"
import { ElementProps } from "../../element"

export function TextKonva(props: ElementProps) {
    return (
        <Text
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...props.attrs}
        />
    )
}
