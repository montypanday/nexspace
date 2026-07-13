import {z} from "zod";

export const AddFloorSchema = z.object({
    name: z.string(),
    buildingId: z.uuid(),
    organizationId: z.uuid()
})

export type AddFloorInput = z.input<typeof AddFloorSchema>;
