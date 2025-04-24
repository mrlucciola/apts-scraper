import {
  ReqBodyGql,
  ReqBodyGqlSorting,
  newReqBodyMlStreeteasy,
  type ReqBodyGqlFilters,
} from "./gqlConfig";
import type { GqlResJson } from "./res";

/** @todo move to reqConfig.ts */
const apiEndpoint = "https://api-v6.streeteasy.com/";

/** @todo move to reqConfig.ts */
const reqHeaders: HeadersInit = {
  accept: "application/json",
  "accept-language": "en-US,en;q=0.5",
  "apollographql-client-name": "srp-frontend-service",
  "apollographql-client-version": "version  0ce25b4e16350c11b1e22ff20f77c9a688f277ec",
  "app-version": "1.0.0",
  "cache-control": "no-cache",
  "content-type": "application/json",
  os: "web",
  pragma: "no-cache",
  priority: "u=1, i",
  "sec-ch-ua": '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "sec-gpc": "1",
  "x-forwarded-proto": "https",
  Referer: "https://streeteasy.com/",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

/** @todo move to reqConfig.ts */
const reqConfigDefault: RequestInit = {
  headers: reqHeaders,
  method: "POST",

  // Must be stringified
  // body: "",
};

/** @todo
 * @deprecated add customizable gql query-interface
 */
export const fetchMultilisting = async (
  /** Page number (i.e. 1) */
  page: number,
  /** Results per page (i.e. 500) */
  perPage: number,
  rentalStatus: ReqBodyGqlFilters["rentalStatus"] = "ACTIVE"
) => {
  // 1. Config & send request
  const filters = {
    rentalStatus,
    areas: [1004000], // Hoboken = 1004000
    price: { lowerBound: 1000, upperBound: 10000 },
  };
  const reqConfig: RequestInit = {
    ...reqConfigDefault,
    body: newReqBodyMlStreeteasy({
      query: ReqBodyGql.shape.query.parse(undefined),
      variables: {
        input: {
          filters,
          page,
          perPage,
          sorting: ReqBodyGqlSorting.parse({}), // @note Considering
          userSearchToken: process.env.STREETEASY_GQL_USER_SEARCH_TOKEN as string,
          /** @note incomplete enum - unnecessary */
          adStrategy: "NONE",
        },
      },
    }),
  };
  const res = await fetch(apiEndpoint, reqConfig);

  // 2. Handle response
  // console.log("res", res);

  const resJson: GqlResJson = await res.json();

  return resJson;
};
