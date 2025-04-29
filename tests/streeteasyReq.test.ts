import { describe, expect, test } from "bun:test";
// local
import { streeteasyMultiListingConfig } from "../src/listingDiscovery/streeteasy/parse";
// test data
// import { resJsonV6 } from "../src/listingDiscovery/streeteasy/local.testRes";
import { EdgeItem, type GqlResJson } from "../src/listingDiscovery/streeteasy/res";
// import ListingModel, { type Listing } from "../src/db/models/listing";
import { type Listing } from "../src/db/models/listing";
// import { createListing } from "../src/db/crud";

// test("expired api key - single listing", async () => {
//   const listingId = 3943463;

//   const res = await fetchListing(`https://streeteasy.com/rental/${listingId}`);

//   expect(res.status).toBeGreaterThanOrEqual(300);
// });

// describe("multilisting - streeteasy v6 sync", async () => {
//   // @todo add: test("fail: validation", async () => {});
//   const listings: EdgeItem[] = resJsonV6.data.searchRentals.edges; // as EdgeItem[];

//   test("validate", () => {
//     for (let idx = 0; idx < listings.length; idx++) {
//       const listing = listings[idx];
//       expect(EdgeItem.safeParse(listing).success).toBeTrue();
//     }
//   });
//   test("lookup existing streeteasy ids", async () => {
//     const listingIds = [...new Set(listings.map((l) => l.node.id))];

//     // Find all documents that match any of these IDs
//     const existingListings = await ListingModel.find(
//       { listing_id: { $in: listingIds } },
//       // Only get the listing_id field
//       { listing_id: 1, _id: 0 }
//     );

//     // Create a set of existing IDs for faster lookup
//     const existingIdsSet = new Set(existingListings.map((l) => l.current.id));

//     // Filter the API IDs to find those that don't exist in the database
//     const missingIds = listingIds.filter((id) => !existingIdsSet.has(id));

//     const filteredNewListings = listings.filter((l) => missingIds.includes(l.node.id));

//     for (let idx = 0; idx < filteredNewListings.length; idx++) {
//       const newListing = filteredNewListings[idx];

//       // Convert to db @todo this is invalid type
//       const parsedListing: Partial<Listing> = newListing as Partial<Listing>;

//       // await createListing(newListing);
//     }
//   });
// });

describe("multilisting - streeteasy v6 full flow", async () => {
  // @todo add: test("fail: validation", async () => {});
  // @todo add: test("fail: config", async () => {});
  let res: Response;
  let resJson: GqlResJson;
  let listings: EdgeItem[];
  let listingsDb: Listing[];

  test("successful fetch", async () => {
    const { reqConfig, response } = await streeteasyMultiListingConfig.fetch();
    res = response;
  });
  test("successful extract body from res", async () => {
    resJson = await streeteasyMultiListingConfig.extractBodyFromRes(res);
    console.log("res JSON", resJson);
  });
  test("successful convert resjson to listings", () => {
    listings = streeteasyMultiListingConfig.extractListingsFromBody(resJson);
  });
  test("successful validation and transformation to db model", async () => {
    listingsDb = streeteasyMultiListingConfig.validateAndTransformToDbModel(listings);
  });
  test("validate", () => {
    listings = resJson.data.searchRentals.edges;
    console.log("listings", listings.length);
    console.log("lists", listings[0]);
    for (let idx = 0; idx < listings.length; idx++) {
      const listing = listings[idx];
      expect(EdgeItem.safeParse(listing).success).toBeTrue();
    }
  });
});
