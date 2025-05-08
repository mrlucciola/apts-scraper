import * as _ from "lodash";
import { describe, expect, test } from "bun:test";
// db
import { connectToListingsDb } from "../src/db/connectToDb";
import { findListingByListingId, updateListing } from "../src/db/crud";
// utils
import { getHtmlFilesFromDir } from "./utils/files";
// local
import { streeteasySingleListingConfig } from "../src/singleListing/sources/streeteasy";
import type { ListingIdField } from "../src/general/commonValidation";
import { extractTargetJsonPayloadJsdom } from "../src/singleListing/sources/streeteasy/htmlParsing/extractDomElement";
import type { HtmlPayloadSchema_SeSl } from "../src/singleListing/sources/streeteasy/htmlParsing/htmlToJsonValidation";
import { transformToDbModel } from "../src/singleListing/sources/streeteasy/transformToDbModel";
import { origListingTest, updatedListingTest } from "./local.streeteasySingle.data";
import { ListingReadValidation, ListingWriteValidation } from "../src/db/models/listing";

const htmlFilesDir = "/src/singleListing/sources/streeteasy/htmlParsing/local";

/**
 * - Dir: "../src/singleListing/sources/streeteasy/htmlParsing/local"
 * - Files: [ nyc2.html, nycRes.txt, hbkRes.html ]
 */
const htmlFiles = getHtmlFilesFromDir(htmlFilesDir);
const randomHtmlIdx = Math.floor(Math.random() * htmlFiles.length);
const randomRawHtml = htmlFiles[randomHtmlIdx];

await connectToListingsDb();

describe("se-sl html parse-validate-transform", () => {
  let validatedJsonPayload: HtmlPayloadSchema_SeSl | undefined;

  test("extract JSON from dom via JSDOM parsing", () => {
    htmlFiles.forEach((rawHtml) => {
      if (!rawHtml) throw new Error(`Doc does not exist: ${rawHtml}`);
      expect(rawHtml, "Raw HTML must be string").toBeTypeOf("string");
      expect(rawHtml, "Must be html").toContain("<!DOCTYPE html>");

      validatedJsonPayload = extractTargetJsonPayloadJsdom(rawHtml);
      expect(validatedJsonPayload, "Target DOM elem is undefined").toBeDefined();
      expect(validatedJsonPayload, "Target DOM elem is null").not.toBeNull();
    });
  });
  test("transform", () => {
    if (!validatedJsonPayload) throw new Error(`JSON does not exist: ${validatedJsonPayload}`);
    transformToDbModel(validatedJsonPayload);
  });
});

// @todo incomplete test
test("update db", async () => {
  // 0) Query the original doc
  const origListingDoc = await findListingByListingId(
    origListingTest.sources.streeteasy.id,
    "streeteasy"
  );
  const origListingDb = ListingReadValidation.parse(origListingDoc);

  // 1) Validate test inputs
  //   1.1) Validate listing exists
  const listingDocId = origListingDb?._id;
  expect(
    listingDocId,
    `SE Listing #${origListingTest.sources.streeteasy.id} does not exist.`
  ).toBeDefined();
  //   1.2) @note Possibly unnecessary - Test & DB values should match for listing.
  expect(
    _.isEqual(
      ListingWriteValidation.parse(origListingTest),
      ListingWriteValidation.parse(origListingDb)
    ),
    "Test & DB values should match for listing"
  ).toBeTrue();

  // 2) Update and validate changes in listing document
  //   2.1) Update listing document in DB
  await updateListing(updatedListingTest, "streeteasy");
  //   2.2) Fetch listing doc - should reflect changed fields
  const updatedListingDoc = await findListingByListingId(
    updatedListingTest.sources.streeteasy.id,
    "streeteasy"
  );
  const updatedListingDb = ListingReadValidation.parse(updatedListingDoc);
  //   2.3) Validate changed fields
  expect(
    _.isEqual(
      ListingWriteValidation.parse(updatedListingTest),
      ListingWriteValidation.parse(updatedListingDoc)
    )
  ).toBeTrue();
  expect(
    _.isEqual(
      ListingWriteValidation.parse(updatedListingTest),
      ListingWriteValidation.parse(updatedListingDb)
    )
  ).toBeTrue();

  // 3) Revert update and validate
  //   3.1) Update listing document in DB
  await updateListing(origListingTest, "streeteasy");
  //   3.2) Get reverted listing document from DB
  const revertedListingDoc = await findListingByListingId(
    updatedListingTest.sources.streeteasy.id,
    "streeteasy"
  );
  const revertedListingDb = ListingReadValidation.parse(revertedListingDoc);
  expect(
    _.isEqual(
      ListingWriteValidation.parse(revertedListingDoc),
      ListingWriteValidation.parse(revertedListingDb)
    )
  ).toBeTrue();
  expect(
    _.isEqual(
      ListingWriteValidation.parse(revertedListingDb),
      ListingWriteValidation.parse(origListingDoc)
    )
  ).toBeTrue();
  expect(
    _.isEqual(
      ListingWriteValidation.parse(revertedListingDb),
      ListingWriteValidation.parse(origListingTest)
    )
  ).toBeTrue();
  expect(
    _.isEqual(
      ListingWriteValidation.parse(revertedListingDb),
      ListingWriteValidation.parse(origListingDb)
    )
  ).toBeTrue();
});

/** ## Tests to add:
 * - Fail cases for `await streeteasySingleListingConfig.fetchListing(testListingId)`
 * - Fail cases for `await streeteasySingleListingConfig.extractBodyFromRes(res)`
 * - Fail cases for `streeteasySingleListingConfig.extractListingFromBody(resText)`
 */

// @todo implement: test("se-sl async request-parse-validate-transform flow", async () => {
// @todo implement: test("se-sl async request-parse-validate-transform-update flow", async () => {
test("se-sl async request-parse-validate-transform flow", async () => {
  // Test params:
  const testListingId: ListingIdField = "3233256"; // 145 4th Ave. #16A - East Village

  // 1) Request
  const res = await streeteasySingleListingConfig.fetchListing(testListingId);
  expect(res.status, JSON.stringify(res)).toBeLessThan(300);

  // 2) Parse
  const resText = await streeteasySingleListingConfig.extractBodyFromRes(res);
  expect(resText, "Var `resText` must be type `string`").toBeString();
  expect(resText, "Var `resText` must be valid HTML").toContain("<!DOCTYPE html>");

  const listingDetailRes = streeteasySingleListingConfig.extractListingFromBody(resText);

  // 3) Transform
  const listingDetailDb = streeteasySingleListingConfig.transformToDbModel(listingDetailRes);
  console.log("listingDetailDb:", listingDetailDb);

  // @todo Add `db-update` step
});
