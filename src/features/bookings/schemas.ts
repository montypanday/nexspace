import * as z from 'zod';

export const AddBookingSchema = z.object({
    title: z.string(),
    startTs: z.date(),
    endTs: z.date(),
    allDay: z.boolean(),
    bookableAssetId: z.uuid(),
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

export type AddBookingInput = z.infer<typeof AddBookingSchema>;