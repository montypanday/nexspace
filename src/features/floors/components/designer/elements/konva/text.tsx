'use client'

import { Text } from "react-konva"
import { StageElementDto } from "@/features/floors/types";

export function TextKonva(props: StageElementDto) {
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
