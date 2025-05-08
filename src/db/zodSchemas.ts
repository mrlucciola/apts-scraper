import mongoose from "mongoose";
import { z } from "zod";
import { zDayjs } from "../utils/zod";

export const zMongoObjectId = z
  .custom<mongoose.Types.ObjectId>()
  .refine((input) => mongoose.Types.ObjectId.isValid(input));
export type zMongoObjectId = z.infer<typeof zMongoObjectId>;

export const zMongoIdRegex = z
  .string()
  .regex(/^[0-9a-f]{24}$/)
  .refine((input) => mongoose.Types.ObjectId.isValid(input));
export type zMongoIdRegex = z.infer<typeof zMongoIdRegex>;

export const zMongoIdUnion = z.union([zMongoObjectId, zMongoIdRegex]);
export type zMongoIdUnion = z.infer<typeof zMongoIdUnion>;

export const zMongoId = zMongoIdUnion.transform((input, _ctx) =>
  typeof input === "string" ? input : input.toString()
);
export type zMongoId = z.infer<typeof zMongoId>;

/** Date fields for a document, managed by MongoDB
 * @note Input: z.string().datetime()
 * @todo Consider creating separate schemas for read and write
 */
export const zDocDates = z.object({ createdAt: zDayjs, updatedAt: zDayjs });
export type zDocDates = z.infer<typeof zDocDates>;
/** All auto-applied document fields, managed by MongoDB
 */
export const zDocFields = zDocDates.extend({ __v: z.number(), _id: zMongoId });
export type zDocFields = z.infer<typeof zDocFields>;
