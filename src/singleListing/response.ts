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
  source: z.string().nullish().catch(null), // "Douglas Elliman"
  __typename: SeResTypename, // "Rental"
});
type SeResRental = z.infer<typeof SeResRental>;

const SeReslistedByListItem = z.object({
  business_name: z.string().nullish(),
  image: z.any().default(null),
  industry_professional: z
    .object({
      headshot: z.object({
        url: zUrl, // "https://photos.zillowstatic.com/fp/b3e440a57c0b1d8c64b7931cfbc14517-se_large_800_400.webp",
        __typename: SeResTypename,
      }),
      __typename: SeResTypename,
    })
    .nullable()
    .catch(null),
  id: zNumeric,
  is_pro: z.boolean().catch(false),
  name: z.string(),
  phone: z.string(),
  profile: z.object({
    url: zUrl, // "https://streeteasy.com/profile/828148-lincoln-wettenhall",
  }),
  license: z.object({
    id: zNumeric,
    display_type: z.string(), // "Licensed Associate Real Estate Broker",
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
