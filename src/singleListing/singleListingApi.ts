import axios, { isAxiosError } from "axios";
// config
import gqlQuery from "./gqlQuery";
import { defaultHeaders } from "../reqConfig/headers";
import { singleListingCookie, singleListingQueryVars } from "./reqConfig";
// interfaces
import type { ISeReqBody } from "./interfaces";
import type { SingleListingRes } from "./interfaces";
import { graphqlApiUrl } from "../graphql";

const getSingleListing = async (listingId: number | null) => {
  if (!listingId) return console.log("no id provided:", listingId);

  try {
    // Configure request
    const reqBody: ISeReqBody = {
      query: gqlQuery,
      variables: { id: listingId, ...singleListingQueryVars },
    };

    const res = await axios.post<{ data: SingleListingRes }>(graphqlApiUrl, reqBody, {
      headers: {
        ...defaultHeaders,
        Cookie: singleListingCookie,
      },
    });

    console.log("the HEADERS", res.headers);
    console.log("the data", res.data.data);
    return res.data.data;
  } catch (err) {
    if (!isAxiosError(err)) return console.error(err);
    // const err = e as
    const { request, response, code, message, config, cause, stack, status } = err;
    const errLog = { request, response, code, message, config, cause, stack, status };

    console.warn(errLog);
  }
};

export default getSingleListing;
