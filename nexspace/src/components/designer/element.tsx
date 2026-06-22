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

export enum ElementType {
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
    x: number;
    y: number;
    draggable: boolean;

    attrs: Record<string, any>;
    onClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
    onDragEnd?: (evt: Konva.KonvaEventObject<DragEvent>) => void;
    onTransformEnd?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
}

export function getElementDefaultAttrs(elementType: string | undefined): object {
    switch (elementType) {
        case ElementType.Circle:
            return { radius: 25, stroke: 'black' }
        default:
            return {}
    }
}

export function SpawnedElement(props: ElementProps): React.ReactNode {

    const { type, ...cleanprops } = props
    const newprops = {
        ...cleanprops.attrs,
        ...cleanprops
    }
    switch (type) {
        case ElementType.Circle:
            return <CircleKonva {...newprops} />
        case ElementType.DeskSingle:
            return <DeskSingleKonva {...newprops} />
        case ElementType.DeskLShape:
            return <DeskLShapeKonva {...newprops} />
        case ElementType.DeskDouble:
            return <DeskDoubleKonva {...newprops} />
        case ElementType.DeskRow3:
            return <DeskRow3Konva {...newprops} />
        case ElementType.DeskPod4:
            return <DeskPod4Konva {...newprops} />
        case ElementType.Meeting4:
            return <Meeting4Konva {...newprops} />
        case ElementType.Meeting6:
            return <Meeting6Konva {...newprops} />
        case ElementType.Meeting10:
            return <Meeting10Konva {...newprops} />
        default:
            return null
    }
}