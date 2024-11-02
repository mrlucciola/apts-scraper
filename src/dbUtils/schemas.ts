import { z } from "zod";

export const zDates = z.object({
  dtCreated: z.string().datetime(),
  dtUpdated: z.string().datetime(),
});
export type zDates = z.infer<typeof zDates>;
