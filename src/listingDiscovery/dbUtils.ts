import validateResource from "../dbUtils/validateResource";
import ListingModel, { Listing } from "../dbUtils/dbModels";

export const createListing = (input: Partial<Listing>) => {
  return ListingModel.create(input);
};

export const findListingById = async (id: number) => {
  return ListingModel.findById(id);
};
