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
    region: input.areaName,
    latitude: input.geoPoint.latitude,
    longitude: input.geoPoint.longitude,
    unit: input.unit,
    street: input.street,
  },

  broker: { agency: input.sourceGroupLabel },

  bedCt: input.bedroomCount,
  fullBathCt: input.fullBathroomCount,
  halfBathCt: input.halfBathroomCount,
});

export const EdgeNode = ListingFields.pick({
  id: true,
  price: true,
  buildingType: true, // "HOUSE"
  noFee: true,
  status: true,
  urlPath: true,
})
  .required()
  .extend({
    // Renamed fields
    bedroomCount: ListingFields.shape.bedCt.unwrap(), // 0
    fullBathroomCount: ListingFields.shape.fullBathCt.unwrap(), // 1
    halfBathroomCount: ListingFields.shape.halfBathCt.unwrap(), // 0
    sourceGroupLabel: ListingFields.shape.broker.unwrap().shape.agency, // "Realty Express LaBarbera"

    // Address fields
    areaName: ListingFields.shape.address.shape.region, // "Hoboken"
    street: ListingFields.shape.address.shape.street, // "356 1st Street",
    unit: ListingFields.shape.address.shape.unit, // "1R",
    geoPoint: ListingFields.shape.address.pick({ latitude: true, longitude: true }), // 40.7383, -74.036

    // Unused fields
    leadMedia: z.object({ photo: z.object({ key: z.string().nullish() }).nullish() }).nullish(), // "6aee733e6dd2097652c329da981fc8a0"
    relloExpress: z.any(), // null
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
