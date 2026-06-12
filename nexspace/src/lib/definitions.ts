import * as z from 'zod'

// types.ts
export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; errors?: Record<string, string[]> };


export const dateRangeSchema = z
    .object({
        startDate: z.iso.datetime({ offset: true }),
        endDate: z.iso.datetime({ offset: true }),
    });

export const CreateBookingSchema = z.object({
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

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

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