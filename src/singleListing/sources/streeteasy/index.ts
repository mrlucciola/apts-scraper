import type { ListingIdField } from "../../../general/commonValidation";
import { type FetchFxn, ServiceConfigSl } from "./ServiceConfigSl";
import { buildListingUrl } from "./reqUtils";
import { buildReqConfig } from "./reqConfig";

const defaultReqConfig = buildReqConfig();

export const fetchListing: FetchFxn = async (listingId: ListingIdField) => {
  const url = buildListingUrl(listingId);
  return await fetch(url, defaultReqConfig);
};

export const streeteasySingleListingConfig = new ServiceConfigSl({
  fetchListing,
  serviceName: "streeteasy",
  reqConfig: defaultReqConfig,
});
