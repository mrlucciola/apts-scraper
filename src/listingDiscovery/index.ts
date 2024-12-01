import { createListing, findAllListings, findListingByListingId } from "../db/crud";
import getMultiListing from "./req";
import { MultiListingResItem } from "./response";

/**
 * 1. Query existing listings - From DB
 * 2. Fetch listings to add/update - From API
 * 3. Add new listings and update existing listings - In DB
 */
export const queryFetchUpdate = async () => {
  // 1. Query all existing listings from DB
  const listingsDb = await findAllListings(["listing_id"]);
  const listingIdsDb = listingsDb.map((l) => l.listing_id);
  const uniqueListingIdsDb = new Set(listingIdsDb);

  // 2. Fetch new listings
  const listingsRes = await getMultiListing();

  // 3. Add new listings and/or update existing listings
  listingsRes?.forEach(async (listing) => {
    const validatedListing = MultiListingResItem.safeParse(listing);

    const shouldAdd =
      validatedListing.data && !uniqueListingIdsDb.has(validatedListing.data.listing_id);
    const shouldUpdate =
      validatedListing.data && uniqueListingIdsDb.has(validatedListing.data.listing_id);
    if (shouldAdd) {
      await createListing(validatedListing.data);
    }
  });
};

/** */
export const main = async () => {
  await queryFetchUpdate();
  // @todo add loop to fetch on a timer
};
