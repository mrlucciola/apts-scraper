import { z } from "zod";
import { ListingFields } from "../../db/models/listing";

export const edgeNodeToListingAdapter = (input: EdgeNode): ListingFields => ({
  id: input.id,
  price: input.price,
  buildingType: input.buildingType,
  noFee: input.noFee,
  status: input.status,
  urlPath: input.urlPath,

  address: {
    ...input.address,
    region: input.region,
    unit: input.unit,
    street: input.street,
  },

  broker: { agency: input.agency },

  bedCt: input.bedCt,
  fullBathCt: input.fullBathCt,
  halfBathCt: input.halfBathCt,
});

export const EdgeNode = ListingFields.pick({
  id: true,
  price: true,
  buildingType: true, // "HOUSE"
  noFee: true,
  status: true,
  urlPath: true,
  // roomCt:true
  bedCt: true,
  fullBathCt: true,
  halfBathCt: true,
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
  });
export type EdgeNode = z.infer<typeof EdgeNode>;

export const EdgeItem = z.object({ node: EdgeNode });
export type EdgeItem = z.infer<typeof EdgeItem>;

export const GqlResJson = z.object({
  data: z.object({
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
  }),
});
export type GqlResJson = z.infer<typeof GqlResJson>;
