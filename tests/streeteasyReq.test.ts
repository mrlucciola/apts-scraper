import { describe, expect, test } from "bun:test";
// local
import { streeteasyMultiListingConfig } from "../src/listingDiscovery/streeteasy/parse";
// test data
// import { resJsonV6 } from "../src/listingDiscovery/streeteasy/local.testRes";
import { EdgeItem, EdgeNode, GqlResJson } from "../src/listingDiscovery/streeteasy/res";
import ListingModel, { Listing, ListingFields } from "../src/db/models/listing";
import { ExtApiService } from "../src/general/enums";
import { newReqBodyMlStreeteasy } from "../src/listingDiscovery/streeteasy/gqlConfig";
import { connectToListingsDb } from "../src/db/connectToDb";
import ListingDeprecModel from "../src/db/models/listingDeprec";
import { BuildingType } from "../src/streeteasyUtils/listingEnums";
import { zDayjs } from "../src/utils/zod";
import { RentalHistoryEvent } from "../src/db/models/rentalHistory";

await connectToListingsDb();
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
  let res: Response | undefined;
  let resJson: GqlResJson | undefined;
  let listings: EdgeItem[] | undefined;
  let listingsDb: Listing[] | undefined;

  test("successful fetch", async () => {
    const { reqConfig, response } = await streeteasyMultiListingConfig.fetch();
    expect(
      response.status < 300,
      JSON.stringify({ status: response.status, message: response.statusText })
    );
    res = response;
  });
  test("successful extract body from res", async () => {
    if (!res) throw new Error(`'res' is undefined`);

    resJson = await streeteasyMultiListingConfig.extractBodyFromRes(res);
    console.log(resJson.errors || resJson.data?.searchRentals.edges[0].node);
  });
  test("successful convert resJson to listings", () => {
    if (!resJson) throw new Error(`'resJson' is undefined`);

    listings = streeteasyMultiListingConfig.extractListingsFromBody(resJson);
    listings.forEach((l) => {
      EdgeItem.parse(l);
    });
  });
  test("successful validation and transformation to db model", () => {
    if (!listings) throw new Error(`'listings' is undefined`);

    listingsDb = streeteasyMultiListingConfig.validateAndTransformToDbModel(listings);
    listingsDb.forEach((l) => {
      const validation = ListingFields.safeParse(l.current);
      if (!validation.success) {
        console.error(l.current);
      }

      expect(validation.success, JSON.stringify(validation.error?.errors));
      ExtApiService.options.forEach((o) => {
        ListingFields.parse(l.sources[o]);
      });
    });
  });
  test("successful search and insert", async () => {
    if (listingsDb === undefined) throw new Error(`'listingsDb' is undefined`);
    if (listingsDb.length === 0) throw new Error(`'listingsDb' is empty`);

    streeteasyMultiListingConfig.insertToDb(listingsDb);
  });
});

test("migrate listingDeprec to listing", async () => {
  const existingDeprecListings = await ListingDeprecModel.find();
  const deprecListingIds = existingDeprecListings.map((l) => {
    try {
      const newPriceHistory: RentalHistoryEvent[] | undefined = l.htmlDetail?.priceHistory
        ? l.htmlDetail.priceHistory.map((ph) =>
            RentalHistoryEvent.parse({
              date: ph ? ph.date : undefined,
              price: ph ? ph.price : undefined,
              status: ph ? ph.event : undefined,
            })
          )
        : undefined;
      const newListingFields: ListingFields = {
        id: l.listing_id.toString(),
        address: {
          longitude: l.longitude,
          latitude: l.latitude,
          unit: l.rental?.address?.unit,
          street: l.htmlDetail?.fullAddress?.streetAddress,
          state: l.htmlDetail?.fullAddress?.addressRegion ?? undefined, // state
          region: l.htmlDetail?.activeRentalStats?.propAreaShort, // east-village
          zipCode: l.htmlDetail?.fullAddress?.postalCode ?? undefined,
          city: l.htmlDetail?.fullAddress?.addressLocality ?? undefined,
        },
        history: newPriceHistory ?? undefined,
        price: l.listed_price,
        buildingId: l.htmlDetail?.activeRentalStats.buildID?.toString() ?? undefined,
        buildingType: BuildingType.safeParse(
          l.htmlDetail?.activeRentalStats?.buildType?.toUpperCase()
        ).data,

        daysOnMarket: l.htmlDetail?.activeRentalStats.listDaysMarket,
        availableAt: zDayjs.parse(l.htmlDetail?.activeRentalStats.listAvailDate),

        roomCt: l.htmlDetail?.activeRentalStats.listRoom,
        size: l.htmlDetail?.activeRentalStats.listSqFt,
        description: l.htmlDetail?.description,
        bedCt: l.htmlDetail?.activeRentalStats.listBed,
        fullBathCt: l.htmlDetail?.activeRentalStats.propFullBaths,
        halfBathCt: l.htmlDetail?.activeRentalStats.propHalfBaths,
      };

      const newListing: Listing = {
        current: newListingFields,
        sources: { streeteasy: newListingFields },
      };
      return newListing;
    } catch (err) {
      console.warn("l", l);
      console.warn("l.htmlDetail.priceHistory", l.htmlDetail?.priceHistory);

      console.warn("l.rental", l.rental);
      throw err;
    }
  });
  const uniqueDeprecListingIds = [...new Set(deprecListingIds)];
});
