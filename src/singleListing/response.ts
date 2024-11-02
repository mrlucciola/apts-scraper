import { z } from "zod";
import { zNumeric, zUrl } from "../zod";

// __typename
const SeResTypename = z.enum([
  "Image",
  "IndustryProfessional",
  "License",
  "Contact",
  "Address",
  "Building",
  "Rental",
]);

const SeResRental = z.object({
  id: zNumeric,
  address: z
    .object({
      unit: z.string().nullish(), // "#2A"
      __typename: SeResTypename, // "Address"
    })
    .nullish(),
  listingAddress: z.string().nullish(), // "78 West 3rd Street #2A",
  listingPrice: zNumeric, // 10000,
  listingRooms: z.string().nullish(), // "6 rooms",
  listingBeds: z.string().nullish(), // "3 beds",
  listingBaths: z.string().nullish(), // "2 baths",
  building: z
    .object({
      url: zUrl, // "https://streeteasy.com/building/78-west-3-street-new_york"
      __typename: SeResTypename, // "Building"
    })
    .nullish(),
  source: z.string().nullish(), // "Douglas Elliman"
  __typename: SeResTypename, // "Rental"
});
type SeResRental = z.infer<typeof SeResRental>;

const SeReslistedByListItem = z.object({
  business_name: z.string().nullish(),
  image: z.any(),
  id: zNumeric,
  is_pro: z.boolean().catch(false),
  name: z.string().nullish(),
  phone: z.string().nullish(),
  profile: z.object({ url: zUrl }), // "https://streeteasy.com/profile/828148-lincoln-wettenhall",
  license: z.object({
    id: zNumeric,
    display_type: z.string().nullish(), // "Licensed Associate Real Estate Broker",
    __typename: SeResTypename,
  }),
  __typename: SeResTypename,
});
type SeReslistedByListItem = z.infer<typeof SeReslistedByListItem>;

export const SingleListingResBody = z.object({
  rental: SeResRental,
  listedByList: z.array(SeReslistedByListItem),
});
export type SingleListingResBody = z.infer<typeof SingleListingResBody>;
