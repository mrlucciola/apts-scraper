import { ListingIdField } from "../general/commonValidation";
import type { ExtApiService } from "../general/enums";
import log from "../logger/loggerUtils";
import ListingModel, { Listing, type ListingDoc, type ListingKey } from "./models/listing";

export const createListing = async (input: Partial<Listing>) => {
  try {
    const createdListing = await ListingModel.create(input);
    log.info(`Created listing: ${createdListing.current.id}`);
    return createdListing;
  } catch (error) {
    log.error(error);
    console.log("err creating listing:", error);
    throw error;
  }
};

export const findListingById = async (id: ListingDoc["_id"]) => {
  return await ListingModel.findById(id);
};
export const findListingByListingId = async (listingId: ListingIdField, service: ExtApiService) => {
  const lookup = `sources.${service}.id`;
  const listingDoc = await ListingModel.findOne(
    { [lookup]: { $eq: ListingIdField.parse(listingId) } }
    // Only get the listing_id field
    // { [lookup]: 1, _id: 0 }
  );

  return listingDoc;
};
export const findAllListings = async <TFields extends undefined | ListingKey[]>(
  fields?: TFields
) => {
  if (fields && fields.length > 0) {
    return await ListingModel.find().select(fields);
  } else {
    return await ListingModel.find();
  }
};
export const removeListing = async (listingId: ListingIdField) => {
  return ListingModel.deleteMany({ current: { id: listingId } }); // .findOneAndDelete({ listing_id });
};
export const updateListing = async (listing: Listing, service: ExtApiService) => {
  const lookup = `sources.${service}.id`;

  return await ListingModel.findOneAndUpdate(
    { [lookup]: { $eq: ListingIdField.parse(listing.sources[service].id) } },
    listing,
    { upsert: true }
  );
};
