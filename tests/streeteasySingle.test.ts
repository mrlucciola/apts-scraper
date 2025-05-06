import { describe, expect, test } from "bun:test";
import { JSDOM } from "jsdom";
// db
import { connectToListingsDb } from "../src/db/connectToDb";
// utils
import { getHtmlFilesFromDir } from "./utils/files";
// local
import { streeteasySingleListingConfig } from "../src/singleListing/sources/streeteasy";
import type { ListingIdField } from "../src/general/commonValidation";
import { extractTargetJsonPayloadJsdom } from "../src/singleListing/sources/streeteasy/htmlParsing/extractDomElement";
import type { HtmlPayloadSchema_SeSl } from "../src/singleListing/sources/streeteasy/htmlParsing/htmlToJsonValidation";

const htmlFilesDir = "/src/singleListing/sources/streeteasy/htmlParsing/local";

/**
 * - "../src/singleListing/sources/streeteasy/htmlParsing/local/nyc2.html"
 * - "../src/singleListing/sources/streeteasy/htmlParsing/local/nycRes.txt"
 * - "../src/singleListing/sources/streeteasy/htmlParsing/local/hbkRes.html"
 * - [ nyc2.html, nycRes.txt, hbkRes.html ]
 *
 * }]]}]]
 * }]]}]]}]
 */
const htmlFiles = getHtmlFilesFromDir(htmlFilesDir);

await connectToListingsDb();

describe("se-sl html parse and validate", () => {
  let validatedJsonPayload: HtmlPayloadSchema_SeSl | undefined;
  const rawHtml = htmlFiles[0];

  test("extract JSON from dom via JSDOM parsing", () => {
    if (!rawHtml) throw new Error(`Doc does not exist: ${rawHtml}`);
    expect(rawHtml, "Raw HTML must be string").toBeTypeOf("string");
    expect(rawHtml, "Must be html").toContain("<!DOCTYPE html>");

    validatedJsonPayload = extractTargetJsonPayloadJsdom(rawHtml);
    expect(validatedJsonPayload, "Target DOM elem is undefined").toBeDefined();
    expect(validatedJsonPayload, "Target DOM elem is null").not.toBeNull();
  });
});

/** ## Tests to add:
 * - Fail cases for `await streeteasySingleListingConfig.fetchListing(testListingId)`
 * - Fail cases for `await streeteasySingleListingConfig.extractBodyFromRes(res)`
 * - Fail cases for `streeteasySingleListingConfig.extractListingFromBody(resText)`
 */

// @todo implement: test("se-sl async request-parse-validate-transform flow", async () => {
// @todo implement: test("se-sl async request-parse-validate-transform-update flow", async () => {
test("se-sl async request-parse-validate flow", async () => {
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
  console.log("res text:", listingDetailRes);
  expect(listingDetailRes, "JSON payload must be validated").toBeDefined();

  // @todo Add `transform` step
  // @todo Add `db-update` step
});
