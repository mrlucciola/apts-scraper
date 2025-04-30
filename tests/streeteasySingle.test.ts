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
import { RentalHistoryEvent, type RentalHistory } from "../src/db/models/rentalHistory";
import { streeteasySingleListingConfig } from "../src/singleListing/sources/streeteasy";
import type { ListingIdField } from "../src/general/commonValidation";

await connectToListingsDb();

describe("streeteasy-singlelisting full flow", async () => {
  // @todo add: test("fail: validation", async () => {});
  // @todo add: test("fail: config", async () => {});
  let res: Response | undefined;
  let resJson: GqlResJson | undefined;
  let listing: EdgeItem | undefined;
  let listingDb: Listing | undefined;

  test("successful fetch", async () => {
    const testListingId: ListingIdField = "3233256"; // 145 4th Ave. #16A - East Village
    res = await streeteasySingleListingConfig.fetchListing(testListingId);

    expect(res.status, JSON.stringify(res)).toBeLessThan(300);
  });

  /**
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

  */
});
