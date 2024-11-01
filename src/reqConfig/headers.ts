import type { RawAxiosRequestHeaders } from "axios";

export const defaultHeaders: RawAxiosRequestHeaders = {
  // POST /graphql HTTP/2
  // Host: "api-internal.streeteasy.com",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Referer: "https://streeteasy.com/",
  "Content-Type": "application/json",
  Origin: "https://streeteasy.com",
  DNT: "1",
  "Sec-GPC": "1",
  Connection: "keep-alive",
  Cookie:
    "_ses=ZEtvTWo5RzM3ek1raStRR1drM1RZSjBUYWFzaHVPV2VBb3dhc3VHWmF3K0t1RVpmMUFVaWE0U1hjZ0ZjT1U3MlNRY1RVYnVFcU14c3hSQUNwcUtvNlgrbStDaUxqMHFSWW4rbGxpKzNzQjgwTkVaS3prd3hJa01wenJjMlU2SFdIdVR3NGpZbk5JdEtrKzZuVTk3ZS9kT21sa0F6b2hSU29BdUVRUTVvcnJXSkQrYllld29RSlBsMEZMUnlzOHlzLS1MMy84NGhINEUxdDZDQk4xeUkyNFh3PT0%3D--0113b632012e3eb52296da2cd918b69e6902f2c4; ezab_gold_past_rentals_experience=control; ezab=%7B%22gold_past_rentals_experience%22%3A%22control%22%2C%22uds_rental_hdp_aa%22%3A%22control%22%2C%22per_luxury_concierge_ab_test%22%3A%22variant%22%7D; ezab_uds_rental_hdp_aa=control; ezab_per_luxury_concierge_ab_test=variant; _se_t=d1e9680c-e4fe-4500-80f7-be73b7438b08; zjs_anonymous_id=%2269059b2f-c576-4425-b34f-aa5a35bf6ffa%22; zjs_user_id=null; zg_anonymous_id=%222775e518-1bb7-4355-8f43-15f0dcbef061%22",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  TE: "trailers",
};
