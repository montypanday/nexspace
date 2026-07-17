import {z} from "zod";

export const AddSpaceSchema = z.object({
    floorId: z.uuid(),
    floorPlanId: z.uuid(),
    floorPlanElementId: z.uuid(),
    bookableAssetId: z.uuid(),
    organizationId: z.uuid()
});

export type AddSpaceInput = z.input<typeof AddSpaceSchema>;