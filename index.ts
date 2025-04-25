import { main } from "./src/listingDiscovery";
import { connectToListingsDb } from "./src/db/connectToDb";
import { runSingleListing } from "./src/local.singleListingDEPREC";
import getMultiListing from "./src/listingDiscovery/req";
// import testReq from "./src/testReq";

await connectToListingsDb();

/**
 * ## Get list of listings:
 * 1. Get query from `multi_listing_config` store
 * 1. Fetch multi-listings
 * 1. Parse multi-listings response
 * 1. Save to store `saved_listings`
 *
 * ## Get listing detail:
 * 1. Query saved listings from `saved_listings` by:
 *   - `dtLastLookup` (ascending)
 *   - `isCandidate`
 *   - `isAvailable`
 *
 * ## With list of listings, for each listing:
 * 1. Fetch listing detail
 * 1. Parse listing detail
 * 1. INSERT listing detail in store `listing_detail_log`
 * 1. UPSERT listing detail in store `listing_detail`
 * 1. UPDATE `dtLastLookup` in store `saved_listings`
 */

// const res = await axios.get("");
// cheerio.load(res.data);

console.log("Hello via Bunx!");

// const listingId = 3943463;
// const processListings = async () => {
getMultiListing();
//   getSingleListing;
// };

// main();
// runSingleListing();

// testReq();
