import {z} from "zod";

export const AddSpaceSchema = z.object({
    name: z.string(),
    floorId: z.uuid(),
    organizationId: z.uuid()
});

export type AddSpaceInput = z.input<typeof AddSpaceSchema>;