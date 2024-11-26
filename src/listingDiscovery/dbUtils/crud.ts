import log from "../../logger/loggerUtils";
import type { SavedListingsRow } from "./dbSchemas";
import ListingModel, { Listing, type ListingKey } from "../../general/dbUtils/models/listing";

export const createListing = async (input: Partial<Listing>) => {
  try {
    const createdListing = await ListingModel.create(input);
    log.info(`Created listing: ${createdListing.listing_id}`);
    return createdListing;
  } catch (error) {
    log.error(error);
    console.log("err creating listing:", error);
    throw error;
  }
};

export const findListingById = async (id: number) => {
  return ListingModel.findById(id);
};
export const findListingByListingId = async (listingId: number) => {
  return ListingModel.findOne({ listing_id: listingId });
};
export const findAllListings = async <TFields extends ListingKey[]>(fields?: TFields) => {
  if (fields && fields.length > 0) return ListingModel.find().select(fields);
  else return ListingModel.find();
};
export const removeListing = async (listing_id: number) => {
  return ListingModel.deleteMany({ listing_id }); // .findOneAndDelete({ listing_id });
};
export const updateListing = async (listing: SavedListingsRow) => {
  return ListingModel.updateOne({
    ...listing,
    // log
  });
};
