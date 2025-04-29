import { prop, modelOptions, Severity, getModelForClass } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose/lib/types";
//
import { type MultiListingResItem } from "../../listingDiscovery/response";
import { ListingNote, ListingRowBase } from "../../listingDiscovery/dbUtils/dbSchemas";
//
import type { SingleListingResBody } from "../../local.singleListingDEPREC/response";
import type { StreeteasyHtmlDetailSchema } from "../../singleListing/dbUtils/models";

/** @deprecated */
@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class Listing {
  /** @deprecated */
  @prop({ _id: true, required: true, unique: true })
  listing_id: number;
  /** @deprecated */
  @prop({ required: true })
  listing_type: MultiListingResItem["listing_type"]; // "Rental"
  /** @deprecated */
  @prop({ required: true })
  longitude: MultiListingResItem["longitude"]; // -74.02420044
  /** @deprecated */
  @prop({ required: true })
  latitude: MultiListingResItem["latitude"]; // 40.7521019
  /** @deprecated */
  @prop({ required: true })
  listed_price: MultiListingResItem["listed_price"];

  /** @deprecated */
  @prop({ required: false, default: null })
  rental: SingleListingResBody["rental"];
  /** @deprecated */
  @prop({ required: false, default: null })
  listedByList: SingleListingResBody["listedByList"];
  /** @deprecated */
  @prop({ required: false, default: null })
  htmlDetail: StreeteasyHtmlDetailSchema;

  /** @deprecated */
  @prop({ required: false })
  notes: ListingNote[];
  /** @deprecated */
  @prop({ required: false })
  log: ListingRowBase[];
}
/** @deprecated */
const ListingModel = getModelForClass(Listing, {
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { timestamps: true },
});
/** @deprecated */
export default ListingModel;
/** @deprecated */
export type ListingDoc = DocumentType<Listing>;
