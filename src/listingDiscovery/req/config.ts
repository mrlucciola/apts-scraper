// interfaces
import { z } from "zod";
import type { ILocation } from "../../general/locations";
import { zNumeric, type Numeric } from "../../utils/zod";
import type { MultiListingReqBody } from "../interfaces";

const operationName = "searchOrganicRentals";
const multiListingGqlQuery = `
query ${operationName}($query: String) {
  search_organic_rentals(input: {
    limit: 5,
    query: $query
  }) {
    listing_id
    listing_type
    longitude
    latitude
    listed_price
    
    __typename
  }
}
`;

type EqParam<T extends string | number = number> = `${EqOp}${T}`;
type RangeParam = `:${number}-${number}`;
const EqOp = z.enum([">=", "<=", "<", ">", ":"]);
type EqOp = z.infer<typeof EqOp>;

const NumOp = z
  .object({ op: EqOp, value: zNumeric })
  .transform<EqParam>((val) => `${val.op}${val.value}`);
type NumOp = z.infer<typeof NumOp>;
const NumRangeObj = z
  .object({ min: z.number().int().min(1), max: z.number().int().min(1) })
  .transform<RangeParam>((val, ctx) => {
    if (val.min > val.max) {
      ctx.addIssue({ code: "custom", message: "Min cannot be greater than max" });
    }
    return `${EqOp.enum[":"]}${val.min}-${val.max}`;
  });
type NumRangeObj = z.infer<typeof NumRangeObj>;
const NumRangeArr = z
  .array(zNumeric)
  .length(2)
  .transform<RangeParam>((val) => `${EqOp.enum[":"]}${Math.min(...val)}-${Math.max(...val)}`);
type NumRangeArr = z.infer<typeof NumRangeArr>;
const NumOnly = zNumeric.transform<EqParam>((val) => `${EqOp.enum[":"]}${val}`);
const NumParam = z.union([NumOp, NumRangeObj, NumRangeArr, NumOnly]);
type NumParam = z.infer<typeof NumParam>;

const StrParam = z.string().transform<EqParam<string>>((val) => `${EqOp.enum[":"]}${val}`);
type StrParam = z.infer<typeof StrParam>;

const defaultQueryStr = "status:open|price:500-10000|area:1004000|beds:1-2|baths>=1";
export const defaultInputQuery: MlQueryIn = {
  status: "open",
  price: { min: 500, max: 10000 },
  area: 1004000,
  beds: { min: 1, max: 2 },
  baths: { op: ">=", value: 1 },
};

const MlQuery = z.object({
  status: StrParam,
  price: NumRangeObj, // @todo support NumParam
  area: NumOnly,
  beds: NumRangeObj, // @todo support NumParam
  baths: NumParam,
});
type MlQueryIn = z.input<typeof MlQuery>;
export type MlQuery = z.output<typeof MlQuery>;

const buildQuery = (queryParams: MlQueryIn): string => {
  const parsedParams = MlQuery.parse(queryParams);

  const queryElems: string[] = [];
  for (const _field in parsedParams) {
    const field = _field as keyof MlQuery;
    if (Object.prototype.hasOwnProperty.call(parsedParams, field)) {
      const value = parsedParams[field];
      // @todo add separator param
      //   - @todo update schemas to return separators separately from string
      queryElems.push(`${field}${value}`);
    }
  }
  return queryElems.join("|");
};
export const newMultiReq = (inputQuery: MlQueryIn): MultiListingReqBody => {
  const query = buildQuery(inputQuery);
  console.log("query", query);
  return { operationName, variables: { query }, query: multiListingGqlQuery };
};

export const multiListingCookie =
  "_ses=UVR3L1FtcnNkWkVMMVZkVVZIQmdBNkp6Um9Pd0ljNlU1cVV3K1BodUo1SUdRM1lhRHNXK2RRZC92cmZLT2g2U05UbnFPZ2FObWl5ZERzNC9oRVdpbmFjVzA2VXMyYnBGTUYvb0duRGNuZWt5RGZLZks5d3l2QkpucjcyL0lPZDQ4V3M1WG91V05vN3VSSnNDZE5QNWlxRXE2RDIveThrRTBhd0pSdmVNTjNLTGJoWG03Q3FvV1o2OFJ3dTVyZDlhcCs4OFdXUUxwVHZGS08zeE4ybVVoQ0ZZd2l1dlRZZTJZNGRGNXlKNzNaLzRoeTNHOHJVcUdNUUo5VGNOMWoxNk9tOEZaa09wZ1pBRlJ6VHNPY08yUHRvbjZjRjNaVjFRUVNmRHlPSFNWK2RnNk9zWllRYlV1RUxnTnllRE9sT0FEL0lVRnVPSkpmWXA1VjhKT2Z3TXlZb0RaZVJGM3JnbGcxbXFYcGRRRDNaeisvMlB2b2pKVWtNSStaSXVZaEhpdXZrWlF6c2ZHSGJ5OGhyZFdqWlJTU3NRcDZSRFZRcDVhaDkySXo4K2dpeW1xK1Z4Wks2cm56VnFldWx2MGkxdnNoRGUzMTdLZE9SQVZrSFZ3aHZkMWNhRVYwQlRrVUI1dW5OWHUvOGRySnM3L0R3Y3k4YmI4T2s0RlVrRWszQlJwWmNDRkVLNXlLdEVnck9MMFYzaDNjY2ZVQS8zRmV0WjRudjk3bWhwRFoyaHliRktMU3RKc2hsdzU2VWZVVkF5LS1NNGxFL0xld3R6TzNZTnNONTZEQklnPT0%3D--b97be39809030a1e3fff83dd6a9320292a808c91; ezab_gold_past_rentals_experience=control; ezab=%7B%22gold_past_rentals_experience%22%3A%22control%22%2C%22per_luxury_concierge_ab_test%22%3A%22variant%22%2C%22uds_rental_hdp_aa%22%3A%22control%22%2C%22uds_srp_tabs%22%3A%22test%22%7D; ezab_uds_rental_hdp_aa=control; ezab_per_luxury_concierge_ab_test=variant; _se_t=d1e9680c-e4fe-4500-80f7-be73b7438b08; zjs_anonymous_id=%2269059b2f-c576-4425-b34f-aa5a35bf6ffa%22; zjs_user_id=null; zg_anonymous_id=%222775e518-1bb7-4355-8f43-15f0dcbef061%22; ezab_uds_srp_tabs=test";
