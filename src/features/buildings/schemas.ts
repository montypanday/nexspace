import * as z from 'zod';

// Schema for a single coordinate object
export const LatLngSchema = z.object({
    lat: z.number()
        .min(-90, { message: "Latitude must be >= -90" })
        .max(90, { message: "Latitude must be <= 90" }),
    lng: z.number()
        .min(-180, { message: "Longitude must be >= -180" })
        .max(180, { message: "Longitude must be <= 180" }),
});

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
});

export type UpdateBuildingFootprintInput = z.input<typeof UpdateBuildingFootprintSchema>;