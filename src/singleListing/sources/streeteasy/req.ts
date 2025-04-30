import fs from "fs";
// local
import { zNumeric } from "../../../utils/zod";
import { newFilepath } from "../../resUtils";
import { ZStreeteasyListingUrl } from "./interfaces";
import type { IFetchSingleListing } from "../../interfaces";
import type { ListingDeprecDoc } from "../../../db/models/listingDeprec";

/** Single listing */
export const reqHeadersStreeteasy: HeadersInit = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.8",
  priority: "u=0, i",
  "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "sec-gpc": "1",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

/** Single listing */
export const reqParamsStreeteasy: RequestInit = {
  headers: reqHeadersStreeteasy,
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
};

/**
 * - Specific to getting session/anon-user headers for API requests
 * - Had an unresolved issue with `axios` r.e. headers (JS-Fetch-API works for now)
 *
 * @deprecated delete this function
 */
export const fetchSingleListingStreeteasy: IFetchSingleListing = async (
  listingInfo: string | number | ListingDeprecDoc
) => {
  // Test if input is number or URL
  const listingId =
    zNumeric.safeParse(listingInfo).data ||
    zNumeric.safeParse((listingInfo as ListingDeprecDoc).listing_id).data;
  const listingTestUrl = listingId ? `https://streeteasy.com/rental/${listingId}` : listingInfo;

  // Validate URL
  const listingUrl = ZStreeteasyListingUrl.parse(listingTestUrl);

  // Fetch listing html
  return await fetch(listingUrl, reqParamsStreeteasy);
};

/**
 * @deprecated incomplete
 * @todo Need to replicate, model and handle unsuccessful behavior
 */
export const handleUnsuccessfulResStreeteasy = async (res: Response) => {
  const isRedirect = res.status >= 300 && res.status < 400;
  const isError = res.status >= 400;
  console.log("res", res);
  console.log("res.status", res.status);
  console.warn("res.heaers:", res.headers);

  if (isRedirect) {
    handleRedirectRes(res);
  } else if (isError) {
    handleUnauthRes(res);
  }
  return res;
};

/**
 * # NEED TO call endpoint again with updated headers/cookies (https://streeteasy.com/rental/3943463)
 * 1. get res headers/cookies
 *    a. Call req to get 301
 *       - Req cookies:
 *          - `_px3=89c8ca91566d9abfad1ee6233d234ed5e344444c5f5d1781a524e8043b9c6e98:m7d1Goy12FSJdYSbNj6SurvbGm3ZBczyOENVLaQe2GZ/4aGoXMDUZsOCUw1ET6Y8OpuV7BQMrTuc3Y9rzHO94g==:1000:52ZTZYLCjoxvKqCFUPGUledWSpINGylgz5r2u/n2SQxcQRJpkrdXJpIvR7JpSY06JGpI7Ls1UAc6c5CNjimG7JLLdc3b5KNIfq8IrZfbi0y/eeL6cQu+tpjaj0Rvj3UKeQIEXWmgLG6ZAlLqQxpTSbzJPldtCeb3PWXil3RZLAcfuiBGSNGGfFt6eo2kOesT0x7z8ZganK5VvAxZEN4rvts2FrDeKdMs3HAnce1OGQo=`
 *          - `_pxvid=`
 *          - `pxcts=`
 *    b. RES RETURNS COOKIES:
 *       - `_actor`
 *       - `_se_t`
 *       - `_ses`
 *       - `hdp3`
 *       - `se_lsa`
 *
 * 2. Get the init req-res params
 *    - _actor
 *    - _px3;
 *    - _pxvid;
 *    - _se_t;
 *    - _ses;
 *    - hdp3;
 *    - pxcts;
 *    - se_lsa;
 */
export const handleUnauthRes = async (res: Response) => {
  console.error("unauth res:", res);
  console.error("file path:", newFilepath(res, "UNAUTH"));
  fs.writeFileSync(newFilepath(res, "UNAUTH"), await res.text());
};
export const handleRedirectRes = async (res: Response) => {
  console.warn("redirect res:", res);
  console.error("file path:", newFilepath(res, "REDIRECT"));
  fs.writeFileSync(newFilepath(res, "REDIRECT"), await res.text());
};
