import * as z from 'zod'

const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
    z.codec(z.string(), schema, {
        decode: (jsonString, ctx) => {
            try {
                return JSON.parse(jsonString);
            } catch (err: any) {
                ctx.issues.push({
                    code: "invalid_format",
                    format: "json",
                    input: jsonString,
                    message: err.message,
                });
                return z.NEVER;
            }
        },
        encode: (value) => JSON.stringify(value),
    });

export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; errors?: Record<string, string[]> };


export const dateRangeSchema = z
    .object({
        startDate: z.iso.datetime({ offset: true }),
        endDate: z.iso.datetime({ offset: true }),
    });

export const AddBookingSchema = z.object({
    title: z.string(),
    startTs: z.date(),
    endTs: z.date(),
    allDay: z.boolean(),
    spaceId: z.uuid(),
    userId: z.uuid(),
})
// // 2. Refine the entire object to compare the fields
// .refine((data) => new Date(data).ton > Date.now(), {
//     message: "Start time must be in the future",
//     path: ["startTs"], // Puts the error specifically on the startTs field
// })
// .refine((data) => data.endTs.getTime() > data.startTs.getTime(), {
//     message: "End time must be after start time",
//     path: ["endTs"], // Puts the error specifically on the endTs field
// });

export const AddOrganizationSchema = z.object({
    name: z.string(),
    externalId: z.string().optional()
});

export type AddOrganizationInput = z.infer<typeof AddOrganizationSchema>;

export type AddBookingInput = z.infer<typeof AddBookingSchema>;

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

// Schema for a single coordinate object
export const LatLngSchema = z.object({
    lat: z.number()
        .min(-90, { message: "Latitude must be >= -90" })
        .max(90, { message: "Latitude must be <= 90" }),
    lng: z.number()
        .min(-180, { message: "Longitude must be >= -180" })
        .max(180, { message: "Longitude must be <= 180" }),
});

export const AddBuildingSchema = z.object({
    name: z.string(),
    address: z.string(),
    footprints: jsonCodec(z.array(LatLngSchema)),
    locationId: z.uuid(),
    organizationId: z.uuid(),
});

export type AddBuildingInput = z.input<typeof AddBuildingSchema>;
export type AddBuildingOutput = z.output<typeof AddBuildingSchema>;

export const UpdateBuildingFootprintSchema = z.object({
    buildingId: z.uuid(),
    footprints: jsonCodec(z.array(LatLngSchema))
})

export type UpdateBuildingFootprintInput = z.input<typeof UpdateBuildingFootprintSchema>;

export const AddFloorSchema = z.object({
    name: z.string(),
    buildingId: z.uuid(),
    organizationId: z.uuid()
})

export type AddFloorInput = z.input<typeof AddFloorSchema>;

export const AddSpaceSchema = z.object({
    name: z.string(),
    floorId: z.uuid(),
    organizationId: z.uuid()
});

export type AddSpaceInput = z.input<typeof AddFloorSchema>;