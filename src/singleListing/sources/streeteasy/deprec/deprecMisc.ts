import type { ListingDeprec } from "../../../../db/models/listingDeprec";
import { StreeteasyHtmlDetailSchema } from "../../../dbUtils/models";
import { UpdateDocFromSingleListing, type ITransformSingleListing } from "../../../interfaces";
import {
  parseActiveRentalStats,
  parseFullAddress,
  parseGqlItemPage,
} from "../../../parseHtml/activeRentalStats";
import { parseSavedUserCt } from "../../../parseHtml/parseElem";
import { parsePriceHistory } from "../../../parseHtml/priceHistory";
import { htmlResToDoc } from "../../../resUtils";
import { fetchSingleListingStreeteasy, handleUnsuccessfulResStreeteasy } from "./req";

const transformHtmlToModel: ITransformSingleListing<Document, ListingDeprec> = (doc) => ({
  htmlDetail: StreeteasyHtmlDetailSchema.parse({
    priceHistory: parsePriceHistory(doc),
    savedByCt: parseSavedUserCt(doc),
    activeRentalStats: parseActiveRentalStats(doc),
    description: parseGqlItemPage(doc).about.description,
    name: parseGqlItemPage(doc).about.name,
    fullAddress: parseFullAddress(doc),
  }),
});

export const updateSingleListingStreeteasy = new UpdateDocFromSingleListing<ListingDeprec, any, Document>(
  fetchSingleListingStreeteasy,
  handleUnsuccessfulResStreeteasy,
  htmlResToDoc,
  transformHtmlToModel,
  async (l, p) => await l.updateOne({ htmlDetail: p })
);
