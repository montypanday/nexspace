import { z } from "zod";

export const AddFloorSchema = z.object({
    name: z.string(),
    buildingId: z.uuid(),
    organizationId: z.uuid()
})

export type AddFloorInput = z.input<typeof AddFloorSchema>;

export const FloorPlanElementSchema = z.object({
    floorPlanElementId: z.uuid(),
    type: z.string(),
    attrs: z.record(z.string(), z.any()),
    featureProperties: z.record(z.string(), z.any()).nullable().optional(),
});

export type FloorPlanElementInput = z.infer<typeof FloorPlanElementSchema>;

export const FloorPlanSchema = z.object({
    floorPlanId: z.uuid(),
    floorId: z.uuid(),
    elements: z.array(FloorPlanElementSchema),
});

export type FloorPlanInput = z.infer<typeof FloorPlanSchema>;
