import { findAllListings } from "../db/crud";
import { connectToListingsDb } from "../db/connectToDb";
import { type Listing } from "../db/models/listing";

await connectToListingsDb();

const listingsDb = await findAllListings();

const listingDbModelToAppliedListing = (listingModel: Listing) => {};

listingsDb.forEach((listing: Listing) => {
  console.log(listing);
  listingDbModelToAppliedListing(listing);
  process.exit(0);
});
