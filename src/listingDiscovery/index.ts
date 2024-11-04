import connectToDb from "../general/dbUtils/connectToDb";
import {
  createListing,
  findAllListings,
  findListingById,
  findListingByListingId,
  removeListing,
} from "./dbUtils/crud";
import { testRes } from "./local/testRes";
import getMultiListing from "./req/req";
import { MultiListingResItem } from "./response";

export const main = async () => {
  await connectToDb();

  // @todo add loop to fetch on a timer
  /**
   while (false) {
     const queries: string[] = [];
     queries.forEach(async (multiListingQuery) => {
       const listings = await getMultiListing(multiListingQuery);
       listings?.forEach((listing) => {
         createListing(listing);
       });
     });
   }
   */

  // const listings = await getMultiListing(); // @todo add query
  // console.log("req lestings:", listings);
  // const listings = testRes;

  // console.log("listingsx:", listings[0], "\n\n");

  const allListings = await findAllListings();
  // console.log("all listings ct:", allListings.length);
  // const allListingIds = allListings.map((l) => l.listing_id);
  // const filteredListingIds = new Set(allListingIds);
  // console.log("all stats:", allListingIds.length, filteredListingIds.size);

  // listings?.forEach(async (listing) => {
  //   const validatedListing = MultiListingResItem.safeParse(listing);

  //   // if (validatedListing.data?.listing_id) {
  //   //   const foundListing = await findListingByListingId(validatedListing.data?.listing_id);
  //   // }
  //   validatedListing.data && (await createListing(validatedListing.data));
  // });
};

// main();
