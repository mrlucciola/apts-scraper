import { JSDOM } from "jsdom";
// local
import type { ListingIdField } from "../../../general/commonValidation";
import {
  type FetchFxn,
  ServiceConfigSl,
  type ExtractBodyFromResFxn,
  type ExtractListingFromBodyFxn,
} from "./ServiceConfigSl";
import { buildListingUrl } from "./reqUtils";
import { buildReqConfig } from "./reqConfig";
import { StreeteasyHtmlDetailSchema } from "../../dbUtils/models";
import { parsePriceHistory } from "../../parseHtml/priceHistory";
import { parseSavedUserCt } from "../../parseHtml/parseElem";
import {
  parseActiveRentalStats,
  parseFullAddress,
  parseGqlItemPage,
} from "../../parseHtml/activeRentalStats";
import { extractScriptString } from "./htmlParsing/extractDomElement";

const defaultReqConfig = buildReqConfig();

type TRes = Response;
type TBody = string;
type TListingRes = StreeteasyHtmlDetailSchema;

const fetchListing: FetchFxn = async (listingId: ListingIdField) => {
  const url = buildListingUrl(listingId);
  return await fetch(url, defaultReqConfig);
};

export const extractBodyFromRes: ExtractBodyFromResFxn<TRes, TBody> = async (res) =>
  await res.text();

export const extractListingFromBody: ExtractListingFromBodyFxn<TBody, TListingRes> = (htmlStr) => {
  const parsedHtmlDom: JSDOM = new JSDOM(htmlStr);
  const doc = parsedHtmlDom.window.document;
  const scriptTagWithPayload = extractScriptString(doc);

  // console.log("parsePriceHistory(doc)", parsePriceHistory(doc));
  // console.log("parseSavedUserCt(doc)", parseSavedUserCt(doc));
  // console.log("parseActiveRentalStats(doc)", parseActiveRentalStats(doc));
  // console.log("parseFullAddress(doc)", parseFullAddress(doc));

  // @todo Causing problems
  // const gqlItemPage = parseGqlItemPage(doc);
  // const { description, name } = gqlItemPage.about;

  return StreeteasyHtmlDetailSchema.parse({
    priceHistory: parsePriceHistory(doc),
    savedByCt: parseSavedUserCt(doc),
    activeRentalStats: parseActiveRentalStats(doc),
    // description,
    // name,
    fullAddress: parseFullAddress(doc),
  });
};

/**
 *
 */
export const streeteasySingleListingConfig = new ServiceConfigSl({
  serviceName: "streeteasy",
  reqConfig: defaultReqConfig,
  // Functions
  fetchListing,
  extractBodyFromRes,
  extractListingFromBody,
});
