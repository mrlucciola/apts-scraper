import log from "../logger/loggerUtils";
import ListingModel, { Listing, type ListingKey } from "../general/dbUtils/models/listing";
import type { DocumentType } from "@typegoose/typegoose/lib/types";

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

export const findListingById = async (id: DocumentType<Listing>["_id"]) => {
  return await ListingModel.findById(id);
};
export const findListingByListingId = async (listing_id: number) => {
  return await ListingModel.findOne({ listing_id });
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
export const removeListing = async (listing_id: number) => {
  return ListingModel.deleteMany({ listing_id }); // .findOneAndDelete({ listing_id });
};
export const updateListing = async (listing: Listing) => ListingModel.updateOne(listing);
