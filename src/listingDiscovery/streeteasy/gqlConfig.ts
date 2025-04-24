import { z } from "zod";

export const ReqBodyGqlFiltersPrice = z.object({
  lowerBound: z.number().default(1000), // 1000,
  upperBound: z.number().default(10000), // 10000,
});
export type ReqBodyGqlFiltersPrice = z.infer<typeof ReqBodyGqlFiltersPrice>;

export const ReqBodyGqlFilters = z.object({
  /** @note incomplete enum */
  rentalStatus: z.enum(["ACTIVE"]).default("ACTIVE"),
  areas: z.array(z.number()).default([1004000]), // Hoboken = 1004000
  /** @todo add more filters */
  price: ReqBodyGqlFiltersPrice,
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
  filters: ReqBodyGqlFilters,
  page: z.number().default(1),
  perPage: z.number().default(500),
  sorting: ReqBodyGqlSorting,

  userSearchToken: z.string().default(process.env.STREETEASY_GQL_USER_SEARCH_TOKEN as string),
  /** @note incomplete enum - unnecessary */
  adStrategy: z.enum(["NONE"]).catch("NONE"),
});
export type ReqBodyGqlVariablesInput = z.infer<typeof ReqBodyGqlVariablesInput>;

export const ReqBodyGqlVariables = z.object({ input: ReqBodyGqlVariablesInput });
export type ReqBodyGqlVariables = z.infer<typeof ReqBodyGqlVariables>;

/**
 * @note See original stringified query - note the prepended and postpended whitespace:
 * `"\\n  query GetListingRental($input: SearchRentalsInput!) {\\n    searchRentals(input: $input) {\\n      search {\\n        criteria\\n      }\\n      totalCount\\n      edges {\\n        ... on OrganicRentalEdge {\\n          node {\\n            id\\n            areaName\\n            bedroomCount\\n            buildingType\\n            fullBathroomCount\\n            geoPoint {\\n              latitude\\n              longitude\\n            }\\n            halfBathroomCount\\n            noFee\\n            leadMedia {\\n              photo {\\n                  key\\n              }\\n            }\\n            price\\n            relloExpress {\\n              ctaEnabled\\n              link\\n              rentalId\\n            }\\n            sourceGroupLabel\\n            status\\n            street\\n            unit\\n            urlPath\\n          }\\n        }\\n      }\\n    }\\n  }\\n"`
 */
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
          id
          areaName
          bedroomCount
          buildingType
          fullBathroomCount
          geoPoint {
            latitude
            longitude
          }
          halfBathroomCount
          noFee
          leadMedia {
            photo {
              key
            }
          }
          price
          relloExpress {
            ctaEnabled
            link
            rentalId
          }
          sourceGroupLabel
          status
          street
          unit
          urlPath
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
  query: z.string().min(1).catch(gqlQuery),
  variables: ReqBodyGqlVariables,
});
export type ReqBodyGql = z.infer<typeof ReqBodyGql>;

export const newReqBodyMlStreeteasy = (jsonInput: ReqBodyGql): string => {
  const validatedReqBody = ReqBodyGql.parse(jsonInput);

  return JSON.stringify(validatedReqBody);
};
