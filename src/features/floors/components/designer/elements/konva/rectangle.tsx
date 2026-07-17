'use client'

import { Rect } from "react-konva"
import { StageElementDto } from "@/features/floors/types";

export function RectangleKonva(props: StageElementDto) {
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
