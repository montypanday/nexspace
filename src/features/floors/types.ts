import Konva from "konva";

export interface FloorDto {
    floorId: string;
    floorName: string;
    buildingId: string;
    buildingName: string;
    organizationId: string;
    organizationName: string;
    activeFloorPlanId?: string;
}

export interface FloorPlanDto {
    floorPlanId: string;
    floorId: string;
    elements: FloorPlanElementDto[];
}

export interface FloorPlanElementDto {
    floorPlanElementId: string;
    type: string;
    attrs: Record<string, unknown>;
    featureProperties: Record<string, unknown>
}

export interface StageElementDto {
    id: string;
    type?: string;
    draggable: boolean;
    isSelected?: boolean;
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