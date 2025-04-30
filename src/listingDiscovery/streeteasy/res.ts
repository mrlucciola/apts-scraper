import { z } from "zod";
import { ListingFields } from "../../db/models/listing";
import { zDayjs } from "../../utils/zod";

export const edgeNodeToListingAdapter = (input: EdgeNode): ListingFields => ({
  ...input,

  address: {
    ...input.address,

    region: input.region,
    street: input.street,
    unit: input.unit,
    state: input.state,
    zipCode: input.zipCode,
  },

  broker: { agency: input.agency },
});

export const EdgeNode = ListingFields.pick({
  id: true,
  price: true,
  buildingType: true,
  noFee: true,
  status: true,
  urlPath: true,
  bedCt: true,
  fullBathCt: true,
  halfBathCt: true,
  availableAt: true,
  displayUnit: true,
  furnished: true,
})
  .required()
  .extend({
    // Renamed fields
    agency: ListingFields.shape.broker.unwrap().shape.agency, // "Realty Express LaBarbera"

    // Address fields
    address: ListingFields.shape.address.partial(),
    region: ListingFields.shape.address.shape.region, // "Hoboken"
    street: ListingFields.shape.address.shape.street, // "356 1st Street",
    unit: ListingFields.shape.address.shape.unit, // "1R",
    state: ListingFields.shape.address.shape.state,
    zipCode: ListingFields.shape.address.shape.zipCode,

    // Unimportant
    // leadMedia: z.any().optional(), LeadMedia # OBJECT
    hasTour3d: z.boolean().nullish(),
    hasVideos: z.boolean().nullish(),
    interestingPriceDelta: z.number().int().nullish(),
    livingAreaSize: z.number().int().nullish(),
    mediaAssetCount: z.number().int(), // required !
    netEffectivePrice: z.number().int(), // required !
    isNewDevelopment: z.boolean().nullish(),
    leaseTermMonths: z.number().nullish(),
    monthsFree: z.number().nullish(),
    sourceType: z.string().nullish(), // ListingSourceType # ENUM,
    offMarketAt: zDayjs.nullish(),
    photos: z.array(z.any()).nullish(), // [Photo] // # OBJECT
    upcomingOpenHouse: z.any().nullish(), // OpenHouseDigest // # OBJECT
  });
export type EdgeNode = z.infer<typeof EdgeNode>;

export const EdgeItem = z.object({ node: EdgeNode });
export type EdgeItem = z.infer<typeof EdgeItem>;

export const GqlResJson = z.object({
  data: z
    .object({
      searchRentals: z.object({
        search: z.object({
          /** x "|"-delimited key-value pairs, i.e. "area:1004000|price:1000-10000|status:open" */
          criteria: z
            .string()
            .describe(
              '"|"-delimited key-value pairs, i.e. "area:1004000|price:1000-10000|status:open"'
            ),
        }),
        totalCount: z.number(),
        edges: z.array(EdgeItem),
      }),
    })
    .optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        locations: z.array(z.any()),
        extensions: z.array(z.any()),
      })
    )
    .optional(),
});
export type GqlResJson = z.infer<typeof GqlResJson>;
