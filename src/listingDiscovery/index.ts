import connectToDb from "../dbUtils/connectToDb";
import { createListing } from "./dbUtils";
import getMultiListing from "./req";

const main = async () => {
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

  const listings = await getMultiListing(); // @todo add query
  listings?.forEach(async (listing) => {
    await createListing(listing);
  });
};

main();
