import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { findAllListings, findListingByListingId } from "../db/crud";
import { docToDbModel } from "./resUtils";
import { fetchListing } from "./reqUtils";
import { fetchResToDoc } from "./resUtils";
import connectToDb from "../db/connectToDb";

await connectToDb();

dayjs.extend(utc);
dayjs.extend(timezone);

const fetchParseUpdateListing = async (listingId: number): Promise<void> => {
  const res = await fetchListing(`https://streeteasy.com/rental/${listingId}`);

  const parsedHtmlDoc = await fetchResToDoc(res);
  const dbPayload = docToDbModel(parsedHtmlDoc);
  console.log("dbPayload", dbPayload);
  const listingDb = await findListingByListingId(dbPayload.activeRentalStats.listID);
  if (!listingDb) return;
  const updateDbRes = await listingDb.updateOne({ htmlDetail: dbPayload });
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

  const listingIdsDb = listingsDb.map((l) => l.listing_id);
  const uniqueListingIdsDb = new Set(listingIdsDb);

  await uniqueListingIdsDb.forEach(fetchParseUpdateListing);
};
fetchParseUpdateAllListings();
