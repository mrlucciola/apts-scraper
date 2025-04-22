import { expect, test, beforeEach } from "bun:test";
// local
import { htmlResToDoc } from "../src/singleListing/resUtils";

// test("expired api key - single listing", async () => {
//   const listingId = 3943463;

//   const res = await fetchListing(`https://streeteasy.com/rental/${listingId}`);

//   expect(res.status).toBeGreaterThanOrEqual(300);
// });

test("expired api key", async () => {
  const listingId = 3943463;

  // const res = await fetchListing(`https://streeteasy.com/rental/${listingId}`);
  //
  // expect(res.status).toBeGreaterThanOrEqual(300);
});

test("multilisting - streeteasy v6", async () => {
  const listingId = 3943463;

  // const res = await fetchListing(`https://streeteasy.com/rental/${listingId}`);
  //
  // expect(res.status).toBeGreaterThanOrEqual(300);
});
