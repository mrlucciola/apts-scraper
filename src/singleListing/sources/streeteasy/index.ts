// local
import type { ListingIdField } from "../../../general/commonValidation";
import { type FetchFxn, ServiceConfigSl } from "./ServiceConfigSl";
import { buildListingUrl } from "./reqUtils";
import { buildReqConfig } from "./reqConfig";
import { extractTargetJsonPayloadJsdom } from "./htmlParsing/extractDomElement";
import { transformToDbModel } from "./transformToDbModel";

const defaultReqConfig = buildReqConfig();

const fetchListing: FetchFxn = async (listingId: ListingIdField) => {
  const url = buildListingUrl(listingId);
  return await fetch(url, defaultReqConfig);
};

/**
 *
 */
export const streeteasySingleListingConfig = new ServiceConfigSl({
  serviceName: "streeteasy",
  reqConfig: defaultReqConfig,
  // Functions
  fetchListing,
  extractBodyFromRes: async (res: Response) => await res.text(),
  extractListingFromBody: extractTargetJsonPayloadJsdom,
  transformToDbModel: transformToDbModel,
});
