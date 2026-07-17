'use client'

import { Circle } from "react-konva"
import { StageElementDto } from "@/features/floors/types";

export function CircleKonva(props: StageElementDto) {
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
