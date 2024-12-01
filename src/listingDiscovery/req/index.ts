import axios, { isAxiosError } from "axios";
// config
import { defaultHeaders } from "../../reqConfig/headers";
import { defaultInputQuery, multiListingCookie, newMultiReq } from "./config";
// interfaces
import type { MultiListingReqBody } from "../interfaces";
import type { MultiListingRes } from "../response";
import { graphqlApiUrl } from "../../local.singleListingDEPREC/viewerQueryGql";

/** Only params are location, price and amenities */
const getMultiListing = async () => {
  try {
    // Configure request
    const reqBody: MultiListingReqBody = newMultiReq(defaultInputQuery);
    const headers = { ...defaultHeaders, Cookie: multiListingCookie };

    const res = await axios.post<MultiListingRes>(graphqlApiUrl, reqBody, { headers });

    return res.data.data.search_organic_rentals;
  } catch (err) {
    if (!isAxiosError(err)) return console.error(err);
    const { request, response, code, message, config, cause, stack, status } = err;
    const errLog = { request, response, code, message, config, cause, stack, status };

    console.warn(errLog);
    throw err;
  }
};

export default getMultiListing;
