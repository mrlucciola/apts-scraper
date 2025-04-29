import { ReqBodyGql, ReqBodyGqlVariablesInput } from "./gqlConfig";

/** @todo move to reqConfig.ts */
export const apiEndpoint = "https://api-v6.streeteasy.com/";

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

export const reqConfigDefault: RequestInit = {
  headers: reqHeaders,
  method: "POST",

  // Must be stringified
  // body: "",
};

export const defaultQuery = ReqBodyGql.shape.query.parse(undefined);
