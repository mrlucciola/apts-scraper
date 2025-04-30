import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// db
import { connectToListingsDb } from "../db/connectToDb";
import { findAllListings } from "../db/crud";
// req
import { updateSingleListingStreeteasy } from "./sources/streeteasy";
// interfaces
import type { ListingDoc } from "../db/models/listing";

await connectToListingsDb();

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchParseUpdateListing = async (listing: ListingDoc): Promise<void> => {
  const hasStreeteasyId = !!listing.sources.streeteasy.id;
  /** @todo not yet implented */
  const hasHotpadsId = false; // !!listing.sources.hotpads.id
  /** @todo not yet implented */
  const hasZillowId = false; // !!listing.sources.zillow.id
  const hasNoIds = !hasStreeteasyId && !hasHotpadsId && !hasZillowId;

  if (hasNoIds) {
    console.error("Listing does not contain any listing-ids for supported services.", listing);
    throw new Error(
      `Listing does not contain any listing-ids for supported services: Document ID: "${listing._id}"`
    );
  }

  updateSingleListingStreeteasy.fetchAndUpdate(listing);

  // @todo support "Hotpads" fetch-parse-update flow
  //  - updateSingleListingHotpads.fetchAndUpdate(listing);
  // @todo support "Zillow" fetch-parse-update flow
  //  - updateSingleListingZillow.fetchAndUpdate(listing);
};

/**
 * 1. Get all listings from db
 * 2. Filter by isActive
 * 3. Sort by detail.dtUpdated (or never updated)
 * 4. fetch detail
 * 5. update detail
 */
export const fetchParseUpdateAllListings = async () => {
  // fs.writeFileSync(newFilepath(res, "SUCCESS"), await res.text());
  const listingsDb = await findAllListings();

  // @todo Filter by `isActive`

  // @todo Sort by `detail.dtUpdated`

  await listingsDb.forEach(fetchParseUpdateListing);
};
fetchParseUpdateAllListings();
