import * as mongoose from "mongoose";
import { z } from "zod";

mongoose.Types.ObjectId.isValid;
const ZTypeEnumBase = z.enum([
  "Country",
  "ItemPage",
  "Product",
  "Offer",
  "Apartment",
  "PostalAddress",
  // more to be added
]);
export type ZTypeEnumBase = z.infer<typeof ZTypeEnumBase>;

export const ZTypeEnum = z.union([ZTypeEnumBase, z.string()]).pipe(z.coerce.string());
export type ZTypeEnum = z.infer<typeof ZTypeEnum>;

export const ZBrandEnum = z
  .enum([
    "Douglas Elliman",
    // more to be added
  ])
  .or(z.string());
export type ZBrandEnum = z.infer<typeof ZBrandEnum>;

export const ZAvailability = z.enum(["inStock"]).and(z.string());
export type ZAvailability = z.infer<typeof ZAvailability>;
