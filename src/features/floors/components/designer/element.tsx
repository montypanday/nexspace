import Konva from "konva";
import { DeskDoubleKonva } from "./elements/konva/desk-double";
import { DeskLShapeKonva } from "./elements/konva/desk-lshape";
import { DeskPod4Konva } from "./elements/konva/desk-pod4";
import { DeskRow3Konva } from "./elements/konva/desk-row3";
import { DeskSingleKonva } from "./elements/konva/desk-single";
import { Meeting10Konva } from "./elements/konva/meeting-table10";
import { Meeting4Konva } from "./elements/konva/meeting-table4";
import { Meeting6Konva } from "./elements/konva/meeting-table6";
import { CircleKonva } from "./elements/konva/circle";
import { RectangleKonva } from "./elements/konva/rectangle";
import { TextKonva } from "./elements/konva/text";
import { LineKonva } from "./elements/konva/line";
import { PolygonKonva } from "./elements/konva/polygon";
import React from "react";

export enum ElementType {
    Text = 'text',
    Circle = "cirle",
    Rectangle = "rectangle",
    Polygon = "polygon",
    Line = "line",
    DeskSingle = "desk-single",
    DeskLShape = "desk-lshape",
    DeskDouble = "desk-double",
    DeskRow3 = "desk-row3",
    DeskPod4 = "desk-pod4",
    Meeting4 = "meeting-table4",
    Meeting6 = "meeting-table6",
    Meeting10 = "meeting-table10",
}

export interface ElementProps {
    id: string;
    type?: string;
    draggable: boolean;
    isSelected: boolean;
    attrs: {
        points?: { x: number; y: number }[] | number[];
        [key: string]: any
    }
    feature_properties?: { [name: string]: any } | null
    onClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
    onDblClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
    onDragEnd?: (evt: Konva.KonvaEventObject<DragEvent>) => void;
    onTransformEnd?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
    onChangeAttrs?: (id: string, newAttrs: {
        [key: string]: any
    }) => void;
}

export function getElementDefaultAttrs(elementType: string | undefined): object {
    switch (elementType) {
        case ElementType.Text:
            return { text: 'Sample text', fill: "black" }
        case ElementType.Circle:
            return { radius: 25, stroke: 'black' }
        case ElementType.Rectangle:
            return { width: 25, height: 20, stroke: 'black', strokewidth: 1, strokeScaleEnabled: false }
        case ElementType.Line:
            return { points: [10, 10, 90, 90], stroke: "black", strokeWidth: 4, strokeScaleEnabled: false }
        case ElementType.Polygon:
            return {
                points: [
                    { x: 10, y: 10 },
                    { x: 90, y: 10 },
                    { x: 90, y: 60 },
                    { x: 50, y: 90 },
                    { x: 10, y: 60 },
                ], closed: true, fill: "white", stroke: "black", strokeWidth: 2
            }
        default:
            return {}
    }
}

export function SpawnedElement(props: ElementProps): React.ReactNode {

    const { type, ...cleanProps } = props
    const newProps = {
        ...cleanProps.attrs,
        ...cleanProps
    }
    switch (type) {
        case ElementType.Text:
            return <TextKonva {...newProps} />
        case ElementType.Line:
            return <LineKonva {...newProps} />
        case ElementType.Polygon:
            return <PolygonKonva {...newProps} />
        case ElementType.Circle:
            return <CircleKonva {...newProps} />
        case ElementType.Rectangle:
            return <RectangleKonva {...newProps} />
        case ElementType.DeskSingle:
            return <DeskSingleKonva {...newProps} />
        case ElementType.DeskLShape:
            return <DeskLShapeKonva {...newProps} />
        case ElementType.DeskDouble:
            return <DeskDoubleKonva {...newProps} />
        case ElementType.DeskRow3:
            return <DeskRow3Konva {...newProps} />
        case ElementType.DeskPod4:
            return <DeskPod4Konva {...newProps} />
        case ElementType.Meeting4:
            return <Meeting4Konva {...newProps} />
        case ElementType.Meeting6:
            return <Meeting6Konva {...newProps} />
        case ElementType.Meeting10:
            return <Meeting10Konva {...newProps} />
        default:
            return null
    }
}