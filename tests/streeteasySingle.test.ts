import { describe, expect, test } from "bun:test";
import { JSDOM } from "jsdom";
// local
// test data
// import { resJsonV6 } from "../src/listingDiscovery/streeteasy/local.testRes";
import { Listing } from "../src/db/models/listing";
import { connectToListingsDb } from "../src/db/connectToDb";
import { streeteasySingleListingConfig } from "../src/singleListing/sources/streeteasy";
import type { ListingIdField } from "../src/general/commonValidation";
import { StreeteasyHtmlDetailSchema } from "../src/singleListing/dbUtils/models";
import { htmlPayload } from "../src/singleListing/sources/streeteasy/htmlParsing/local.raw.json";

import { extractTargetJsonPayload } from "../src/singleListing/sources/streeteasy/htmlParsing/extractDomElement";
// @ts-ignore
import * as rawHtmlImport from "../src/singleListing/sources/streeteasy/htmlParsing/local.nyc.res.txt";
import { ScriptInnerTextSchema2_Tuple } from "../src/singleListing/sources/streeteasy/htmlParsing/domElemToPayload";
import type { HtmlPayloadSchema } from "../src/singleListing/sources/streeteasy/htmlParsing/htmlToJsonValidation";

await connectToListingsDb();

describe("se-sl html parse", () => {
  let parsedHtmlDom: JSDOM | undefined;
  let doc: Document | null | undefined;
  let validatedJsonPayload: HtmlPayloadSchema | undefined;

  test("process html into jsdom", () => {
    const rawHtml: string = rawHtmlImport.default;

    expect(rawHtml, "Raw HTML must be string").toBeTypeOf("string");
    expect(rawHtml, "Must be html").toContain("<!DOCTYPE html>");
    parsedHtmlDom = new JSDOM(rawHtml);

    expect(parsedHtmlDom, "Parsed html dom returned undefined").not.toBeUndefined();
    expect(parsedHtmlDom, "Parsed html dom returned null").not.toBeNull();

    doc = parsedHtmlDom.window.document;

    expect(doc, "Document within html returned undefined").not.toBeUndefined();
    expect(doc, "Document within html returned null").not.toBeNull();
  });
  test("extract JSON from dom", () => {
    if (!doc) throw new Error(`Doc does not exist: ${doc}`);

    validatedJsonPayload = extractTargetJsonPayload(doc);
    expect(validatedJsonPayload, "Target DOM elem is undefined").toBeDefined();
    expect(validatedJsonPayload, "Target DOM elem is null").not.toBeNull();
  });

  // test("se-sl parsed-json-within-script to payload 3", () => {
  //   const orig = { a: ["$", "$L18", null, htmlPayload] };

  //   const parsed = ScriptInnerTextSchema3_OuterJson.safeParse(orig);
  //   console.log(parsed.data ?? parsed.error);
  // });
});

describe("streeteasy-singlelisting full flow", async () => {
  // @todo add: test("fail: validation", async () => {});
  // @todo add: test("fail: config", async () => {});
  let res: Response | undefined;
  let resText: string | undefined;
  let listingDetail: StreeteasyHtmlDetailSchema | undefined;
  let listingDb: Listing | undefined;

  test("PASS: fetch listing", async () => {
    const testListingId: ListingIdField = "3233256"; // 145 4th Ave. #16A - East Village
    res = await streeteasySingleListingConfig.fetchListing(testListingId);

    expect(res.status, JSON.stringify(res)).toBeLessThan(300);
  });
  test("PASS: extract response body", async () => {
    if (!res || res.status >= 300) throw new Error(`Response: ${JSON.stringify(res, null, 2)}`);

    resText = await streeteasySingleListingConfig.extractBodyFromRes(res);

    expect(resText, "ResText is not a string").toBeString();
  });
  test("PASS: parse listing info from response", () => {
    if (!resText) throw new Error(`No response text`);

    listingDetail = streeteasySingleListingConfig.extractListingFromBody(resText);
    const validation = StreeteasyHtmlDetailSchema.safeParse(listingDetail);

    expect(validation.success, validation.error?.stack).toBeTrue();
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
