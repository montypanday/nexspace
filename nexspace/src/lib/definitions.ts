import * as z from 'zod'

export const dateRangeSchema = z
    .object({
        startDate: z.iso.datetime({ offset: true }),
        endDate: z.iso.datetime({ offset: true }),
    });

