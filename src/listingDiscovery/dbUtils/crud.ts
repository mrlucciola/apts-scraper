import log from "../../logger/loggerUtils";
import type { SavedListingsRow } from "./dbSchemas";
import ListingModel, { Listing } from "./dbModels";

export const createListing = async (input: Partial<Listing>) => {
  try {
    const createdListing = await ListingModel.create(input);
    log.info(`Created listing: ${createdListing.listing_id}`);
    return createdListing;
  } catch (error) {
    log.error(error);
    console.log("err creating listing:", error);

    // throw error;
  }
};

export const findListingById = async (id: number) => {
  return ListingModel.findById(id);
};
export const findListingByListingId = async (listingId: number) => {
  return ListingModel.findOne({ listing_id: listingId });
};
export const findAllListings = async () => {
  return ListingModel.find();
};
export const removeListing = async (listingId: number) => {
  return ListingModel.deleteMany({ listing_id: listingId }); // .findOneAndDelete({ listing_id: listingId });
};
export const updateListing = async (listing: SavedListingsRow) => {
  return ListingModel.updateOne({
    ...listing,
    // log
  });
};
