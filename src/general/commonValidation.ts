import { z } from "zod";

export const ListingIdField = z.union([z.string().min(1), z.number()]).transform((i, _) => `${i}`);
export type ListingIdField = z.infer<typeof ListingIdField>;
