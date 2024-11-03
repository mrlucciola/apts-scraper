import { prop, modelOptions, Severity, getModelForClass } from "@typegoose/typegoose";
import { type MultiListingResItem } from "../response";

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
}
const ListingModel = getModelForClass(Listing);
export default ListingModel;
