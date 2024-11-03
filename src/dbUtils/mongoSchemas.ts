import { prop, modelOptions, Severity } from "@typegoose/typegoose";
import { type MultiListingRes } from "../listingDiscovery/response";

@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class Listing {
  @prop({ _id: true, required: true, unique: true })
  id: number;

  @prop({ required: true })
  listing_type: MultiListingRes["listing_type"]; // "Rental"
  @prop({ required: true })
  longitude: MultiListingRes["longitude"]; // -74.02420044
  @prop({ required: true })
  latitude: MultiListingRes["latitude"]; // 40.7521019
  @prop({ required: true })
  listed_price: MultiListingRes["listed_price"];
}
