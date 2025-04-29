import { z } from "zod";
import { zNumeric } from "../../utils/zod";
import { BuildingType } from "../../streeteasyUtils/listingEnums";

export const EdgeNode = z.object({
  id: zNumeric, // "4687718"
  /** @note May be an enum */
  areaName: z.string(), // "Hoboken"
  /** @note Small integer */
  bedroomCount: z.number().int(), // 0
  /** @note Currently includes all observed values, there may be others however. */
  buildingType: BuildingType, // "HOUSE"
  /** @note Small integer */
  fullBathroomCount: z.number().int(), // 1
  geoPoint: z.object({
    latitude: z.number(), // 40.7383
    longitude: z.number(), // -74.036
  }),
  /** @note Small integer */
  halfBathroomCount: z.number().int(), // 0
  noFee: z.boolean().nullish(), // false
  // "6aee733e6dd2097652c329da981fc8a0"
  leadMedia: z.object({ photo: z.object({ key: z.string().nullish() }).nullish() }).nullable(),
  price: z.number(), // 2300
  relloExpress: z.any(), // null
  sourceGroupLabel: z.string().nullable(), // "Realty Express LaBarbera"
  /** @todo Incomplete enum */
  status: z.enum(["ACTIVE"]), // "ACTIVE"
  street: z.string(), // "356 1st Street",
  unit: z.string().nullable(), // "1R",
  urlPath: z.string(), // "/building/356-1-street-hoboken/1r",
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
