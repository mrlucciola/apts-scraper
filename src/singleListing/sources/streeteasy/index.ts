import type { ListingIdField } from "../../../general/commonValidation";
import { ServiceConfigSl } from "./ServiceConfigSl";
import { buildListingUrl } from "./reqUtils";

const reqConfig: RequestInit = {};

const fetchListing = async (listingId: ListingIdField) => {
  const url = buildListingUrl(listingId);
  const res = await fetch(url, reqConfig);

  return res;
};

export const streeteasySingleListingConfig = new ServiceConfigSl({
  fetchListing,
  serviceName: "streeteasy",
  reqConfig,
});
