import { z } from "zod";

export const MultiListingReqBody = z.object({
  operationName: z.enum(["searchOrganicRentals"]),
  variables: z.object({
    /** "status:open|price:500-10000|area:1004000|beds:1-2|baths>=1" */
    query: z.string(),
  }),
  /** "query searchOrganicRentals($query: String) {\n  search_organic_rentals(input: {limit: 500, query: $query}) {\n    listing_id\n    listing_type\n    longitude\n    latitude\n    listed_price\n    __typename\n  }\n}\n" */
  query: z.string(),
});
export type MultiListingReqBody = z.infer<typeof MultiListingReqBody>;
