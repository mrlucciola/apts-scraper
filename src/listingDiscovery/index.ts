import { createListing, findAllListings } from "../db/crud";
import { ExtApiService } from "../general/enums";
import getMultiListing from "./req";
import { MultiListingResItem } from "./response";

/**
 * 1. Query existing listings - From DB
 * 2. Fetch listings to add/update - From API
 * 3. Add new listings and update existing listings - In DB
 * 4. @todo When user-profiles are implemented - add support for custom search params, stored in DB
 *
 * @deprecated Support sources
 */
export const queryFetchUpdate = async () => {
  // 1. Query all existing listings from DB
  const listingsDb = await findAllListings(["sources"]);
  const listingIdsDb = listingsDb.map((l) => l.sources);

  // 2. Fetch new listings
  const listingsRes = await getMultiListing();

  // 3. Add new listings and/or update existing listings
  listingsRes?.forEach(async (listing) => {
    const validatedListing = MultiListingResItem.safeParse(listing);

    // const shouldAdd =
    //   validatedListing.data && !uniqueListingIdsDb.has(validatedListing.data.listing_id);
    // const shouldUpdate =
    //   validatedListing.data && uniqueListingIdsDb.has(validatedListing.data.listing_id);
    // if (shouldAdd) {
    //   await createListing(validatedListing.data);
    // }
    throw new Error("Not complete. Need to support sources");
  });
};

/** */
export const main = async () => {
  // forEach.ExtApiService.options((srv) => {});
  ExtApiService.options.forEach((srv) => {});
  await queryFetchUpdate();
  // @todo add loop to fetch on a timer
};
