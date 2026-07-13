import z from "zod";

const latitudeRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
const longitudeRegex = /^[-+]?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?)$/;

export const AddLocationSchema = z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.string().regex(latitudeRegex, { message: "Invalid latitude value" }),
    longitude: z.string().regex(longitudeRegex, { message: "Invalid longitude value" }),
    organizationId: z.uuid(),
    organizationName: z.string()
});

export type AddLocationInput = z.infer<typeof AddLocationSchema>;