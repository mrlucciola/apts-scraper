import axios, { isAxiosError } from "axios";
// config
import { defaultHeaders } from "../reqConfig/headers";
import { multiListingCookie, multiListingReqBodyBase } from "./config";
// interfaces
import type { MultiListingReqBody } from "./interfaces";
import type { MultiListingRes } from "./response";

const streeteasyGqlBaseUrl = "https://api-internal.streeteasy.com/graphql";

/** Only params are location, price and amenities */
const getMultiListing = async () => {
  try {
    // Configure request
    const reqBody: MultiListingReqBody = {
      ...multiListingReqBodyBase,
    };
    const headers = { ...defaultHeaders, Cookie: multiListingCookie };

    const res = await axios.post<{ data: MultiListingRes[] }>(streeteasyGqlBaseUrl, reqBody, {
      headers,
    });

    console.log("multilisting response", res.data.data);
    return res.data.data;
  } catch (err) {
    if (!isAxiosError(err)) return console.error(err);
    const { request, response, code, message, config, cause, stack, status } = err;
    const errLog = { request, response, code, message, config, cause, stack, status };

    console.warn(errLog);
  }
};

export default getMultiListing;
