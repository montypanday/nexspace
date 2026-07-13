import * as z from 'zod'



export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; errors?: Record<string, string[]> };


export const dateRangeSchema = z
    .object({
        startDate: z.iso.datetime({ offset: true }),
        endDate: z.iso.datetime({ offset: true }),
    });



