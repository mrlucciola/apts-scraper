import { z } from "zod";
import { zNumeric } from "../zod";

export const MultiListingRes = z.object({
  listing_id: zNumeric,
  listing_type: z.string(), // "Rental"
  longitude: z.number(), // -74.02420044
  latitude: z.number(), // 40.7521019
  listed_price: z.number(), // 3750
  __typename: z.string(), // "OrganicSearchResult"
});
export type MultiListingRes = z.infer<typeof MultiListingRes>;
