import type { ListingIdField } from "../../../general/commonValidation";
import { type FetchFxn, ServiceConfigSl, type ExtractBodyFromResFxn } from "./ServiceConfigSl";
import { buildListingUrl } from "./reqUtils";
import { buildReqConfig } from "./reqConfig";

const defaultReqConfig = buildReqConfig();

type TRes = Response;
type TBody = string;

const fetchListing: FetchFxn = async (listingId: ListingIdField) => {
  const url = buildListingUrl(listingId);
  return await fetch(url, defaultReqConfig);
};

export const extractBodyFromRes: ExtractBodyFromResFxn<TRes, TBody> = async (res) =>
  await res.text();

export const streeteasySingleListingConfig = new ServiceConfigSl({
  serviceName: "streeteasy",
  reqConfig: defaultReqConfig,
  // Functions
  fetchListing,
  extractBodyFromRes,
});
