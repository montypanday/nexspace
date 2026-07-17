'use client'

import { Line } from "react-konva"
import { StageElementDto } from "@/features/floors/types";

export function LineKonva(props: StageElementDto) {

    const { points, ...safeAttributes } = props.attrs
    // extract points and convert to single dimensional array if required
    let result: number[] = [];
    if (Array.isArray(points) && points.every(item => typeof item == 'object')) {
        result = points.flatMap((point) => [point.x, point.y])
    }
    if (Array.isArray(points) && points.every(item => typeof item == 'number')) {
        result = points
    }

    return (
        <Line
            id={props.id}
            draggable={props.draggable}
            onClick={props.onClick}
            onTransformEnd={props.onTransformEnd}
            onDragEnd={props.onDragEnd}
            {...safeAttributes}
            points={result} />
    )
}
