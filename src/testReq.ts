import axios, { isAxiosError } from "axios";
// config
import { defaultHeaders } from "./reqConfig/headers";
import { singleListingCookie } from "./singleListing/reqConfig";
// interfaces

const testReq = async () => {
  try {
    // Configure request

    const res = await axios.get("https://streeteasy.com/similar_listings/rental/4556590", {
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

export default testReq;
