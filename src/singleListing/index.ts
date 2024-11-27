import { findAllListings } from "../dbUtils/crud";
import getSingleListing from "./singleListingApi";

/** Polling */
export const runSingleListing = async () => {
  // 1. Query all existing listings from DB
  const listingsDb = await findAllListings();
  const listingIdsDb = listingsDb.map((l) => l.listing_id);
  const uniqueListingIdsDb = new Set(listingIdsDb);

  // @ts-ignore
  listingsDb.sort((a, b) => a.updatedAt > b.updatedAt);
  console.log(listingsDb[0]._id);
  // Sort by order

  uniqueListingIdsDb.forEach(async (id) => {
    const listingRes = await getSingleListing(id);
    console.log("\n\n\n", listingRes);
    process.exit(0);
  });

  // Check last update time
  // Check that listing has `rental` prop set
};
