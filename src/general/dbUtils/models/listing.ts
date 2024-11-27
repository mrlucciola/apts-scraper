import { prop, modelOptions, Severity, getModelForClass } from "@typegoose/typegoose";
//
import { type MultiListingResItem } from "../../../listingDiscovery/response";
import { ListingNote, ListingRowBase } from "../../../listingDiscovery/dbUtils/dbSchemas";
//
import type { SingleListingResBody } from "../../../singleListing/response";

@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class Listing {
  @prop({ _id: true, required: true, unique: true })
  listing_id: number;
  @prop({ required: true })
  listing_type: MultiListingResItem["listing_type"]; // "Rental"
  @prop({ required: true })
  longitude: MultiListingResItem["longitude"]; // -74.02420044
  @prop({ required: true })
  latitude: MultiListingResItem["latitude"]; // 40.7521019
  @prop({ required: true })
  listed_price: MultiListingResItem["listed_price"];

  @prop({ required: false, default: null })
  rental: SingleListingResBody["rental"];
  @prop({ required: false, default: null })
  listedByList: SingleListingResBody["listedByList"];

  @prop({ required: false })
  notes: ListingNote[];
  @prop({ required: false })
  log: ListingRowBase[];
}
const ListingModel = getModelForClass(Listing, {
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { timestamps: true },
});
export default ListingModel;

export type ListingKey = keyof Listing;
