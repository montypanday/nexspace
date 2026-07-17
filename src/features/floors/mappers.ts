import { FloorPlanElementSelectPayload, FloorPlanSelectPayload, FloorSelectPayload } from "@/features/floors/server/queries";
import {FloorDto, FloorPlanDto, FloorPlanElementDto, StageElementDto} from "@/features/floors/types";

export function toFloorDto(floor: FloorSelectPayload): FloorDto {
    return {
        floorId: floor.id,
        floorName: floor.name,
        activeFloorPlanId: floor.activeFloorPlanId ?? undefined,
        buildingId: floor.building.id,
        buildingName: floor.building.name,
        organizationId: floor.organization.id,
        organizationName: floor.organization.name
    }
}

export function toFloorPlanDto(floorPlan: FloorPlanSelectPayload): FloorPlanDto {
    const elements = floorPlan.elements.map(e => toFloorPlanElementDto(e))
        .filter(value => value !== null)
    return {
        floorPlanId: floorPlan.id,
        floorId: floorPlan.floor.id,
        elements: elements
    }
}

export function toFloorPlanElementDto(element: FloorPlanElementSelectPayload | StageElementDto): FloorPlanElementDto | null {

    if("feature_properties" in element){
        return {
            floorPlanElementId: element.id,
            type: element.type ?? 'unknown',
            attrs: JSON.parse(JSON.stringify(element.attrs)),
            featureProperties: JSON.parse(JSON.stringify(element.feature_properties))
        }
    }

    if("featureProperties" in element){
        return {
            floorPlanElementId: element.id,
            type: element.type ?? 'unknown',
            attrs: JSON.parse(JSON.stringify(element.attrs)),
            featureProperties: JSON.parse(JSON.stringify(element.featureProperties))
        }
    }
    return null;
}

export function toStageElementDto(floorPlanElement: FloorPlanElementDto, editable: boolean): StageElementDto {
    return {
        id: floorPlanElement.floorPlanElementId,
        type: floorPlanElement.type,
        attrs: floorPlanElement.attrs,
        feature_properties: floorPlanElement.featureProperties,
        draggable: editable,
        isSelected: false
    }
}