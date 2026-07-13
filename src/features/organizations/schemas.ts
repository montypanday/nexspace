import {z} from "zod";

export const AddOrganizationSchema = z.object({
    name: z.string(),
    externalId: z.string().optional()
});

export type AddOrganizationInput = z.infer<typeof AddOrganizationSchema>;