import { z } from "zod";
import { zNumeric } from "../utils/zod";

/** @deprecated */
export const MultiListingResItem = z.object({
  listing_id: zNumeric,
  listing_type: z.string(), // "Rental"
  longitude: z.number(), // -74.02420044
  latitude: z.number(), // 40.7521019
  listed_price: z.number(), // 3750
  __typename: z.string(), // "OrganicSearchResult"
});
/** @deprecated */
export type MultiListingResItem = z.infer<typeof MultiListingResItem>;

// res.data.data.search_organic_rentals
/** @deprecated */
export type MultiListingRes = { data: { search_organic_rentals: MultiListingRes[] } };
