import mongoose from "mongoose";
import { z } from "zod";

export const zDates = z.object({
  dtCreated: z.string().datetime(),
  dtUpdated: z.string().datetime(),
});
export type zDates = z.infer<typeof zDates>;

export const mongoIdSchema = z.custom<mongoose.Types.ObjectId>();
type mongoIdSchema = z.infer<typeof mongoIdSchema>;
export const mongoIdSchema2 = z.string().regex(/^[0-9a-f]{24}$/);
export const mongoIdSchema3 = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val));
