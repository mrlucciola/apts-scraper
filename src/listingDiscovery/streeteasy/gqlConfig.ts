import { z } from "zod";
import { RentalHistoryStatus } from "../../db/models/rentalHistory";

export const ReqBodyGqlFiltersPrice = z.object({
  lowerBound: z.number().default(1000), // 1000,
  upperBound: z.number().default(10000), // 10000,
});
export type ReqBodyGqlFiltersPrice = z.infer<typeof ReqBodyGqlFiltersPrice>;

export const ReqBodyGqlFilters = z.object({
  /** @note Incomplete enum */
  rentalStatus: RentalHistoryStatus.optional(),
  areas: z.array(z.number()).default([1004000]), // Hoboken = 1004000
  /** @todo add more filters */
  price: ReqBodyGqlFiltersPrice.default(ReqBodyGqlFiltersPrice.parse({})),
});
export type ReqBodyGqlFilters = z.infer<typeof ReqBodyGqlFilters>;

export const ReqBodyGqlSorting = z.object({
  /** @note incomplete enum */
  attribute: z.enum(["RECOMMENDED"]).catch("RECOMMENDED"),
  /** @note incomplete enum */
  direction: z.enum(["DESCENDING"]).catch("DESCENDING"),
});
export type ReqBodyGqlSorting = z.infer<typeof ReqBodyGqlSorting>;

export const ReqBodyGqlVariablesInput = z.object({
  filters: ReqBodyGqlFilters.default(ReqBodyGqlFilters.parse({})),
  page: z.number().default(1),
  perPage: z.number().default(500),
  sorting: ReqBodyGqlSorting.default(ReqBodyGqlSorting.parse({})),

  userSearchToken: z.string().default(process.env.STREETEASY_GQL_USER_SEARCH_TOKEN as string),
  /**
   *
   * @note This property has no impact on query currently
   * @note Incomplete enum
   */
  adStrategy: z.enum(["NONE"]).catch("NONE"),
});
export type ReqBodyGqlVariablesInput = z.infer<typeof ReqBodyGqlVariablesInput>;

export const ReqBodyGqlVariables = z.object({ input: ReqBodyGqlVariablesInput });
export type ReqBodyGqlVariables = z.infer<typeof ReqBodyGqlVariables>;

const gqlQuery = `
query GetListingRental($input: SearchRentalsInput!) {
  searchRentals(input: $input) {
    search {
      criteria
    }
    totalCount
    edges {
      ... on OrganicRentalEdge {
        node {
          address: geoPoint { latitude, longitude } 
          agency: sourceGroupLabel
          availableAt
          bedCt: bedroomCount
          buildingType
          displayUnit
          fullBathCt: fullBathroomCount
          furnished
          halfBathCt: halfBathroomCount
          hasTour3d
          hasVideos
          id
          interestingPriceDelta
          isNewDevelopment
          # leadMedia
          leaseTermMonths
          livingAreaSize
          mediaAssetCount
          monthsFree
          netEffectivePrice
          noFee
          offMarketAt
          # photos
          price
          region: areaName
          sourceType
          state
          status
          street
          unit
          # upcomingOpenHouse { ... } # unknown fields
          urlPath
          zipCode
        }
      }
    }
  }
}
`;
export const ReqBodyGql = z.object({
  /** GQL syntax string
   * @todo add validation
   */
  // query: z.string().min(1).catch(gqlQuery),
  query: z.string().min(1).catch(gqlQuery),
  variables: ReqBodyGqlVariables,
});
export type ReqBodyGql = z.infer<typeof ReqBodyGql>;

export const newReqBodyMlStreeteasy = (jsonInput: ReqBodyGql): string => {
  const validatedReqBody = ReqBodyGql.parse(jsonInput);

  return JSON.stringify(validatedReqBody);
};
