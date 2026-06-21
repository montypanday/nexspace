import Konva from "konva";
import { DeskDoubleKonva } from "./elements/konva/desk-double";
import { DeskLShapeKonva } from "./elements/konva/desk-lshape";
import { DeskPod4Konva } from "./elements/konva/desk-pod4";
import { DeskRow3Konva } from "./elements/konva/desk-row3";
import { DeskSingleKonva } from "./elements/konva/desk-single";
import { Meeting10Konva } from "./elements/konva/meeting-table10";
import { Meeting4Konva } from "./elements/konva/meeting-table4";
import { Meeting6Konva } from "./elements/konva/meeting-table6";

export enum ElementType {
    // Circle = "cirle",
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
    type: string;
    x: number;
    y: number;
    draggable: boolean;
    isSelected: boolean;
    onClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
}

export function SpawnedElement(props: ElementProps): React.ReactNode {
    switch (props.type) {
        // case ElementType.Circle:
        //     return 
        case ElementType.DeskSingle:
            return <DeskSingleKonva {...props} />
        case ElementType.DeskLShape:
            return <DeskLShapeKonva {...props} />
        case ElementType.DeskDouble:
            return <DeskDoubleKonva {...props} />
        case ElementType.DeskRow3:
            return <DeskRow3Konva {...props} />
        case ElementType.DeskPod4:
            return <DeskPod4Konva {...props} />
        case ElementType.Meeting4:
            return <Meeting4Konva {...props} />
        case ElementType.Meeting6:
            return <Meeting6Konva {...props} />
        case ElementType.Meeting10:
            return <Meeting10Konva {...props} />
        default:
            return null
    }
}