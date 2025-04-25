import { z } from "zod";

export const DbCollections = z.enum([
  "apartmentListings",
  "requestLogSingleListing",
  "requestLogMultiListing",
]);
export type DbCollections = z.infer<typeof DbCollections>;

export default {
  logLevel: "info",
  dbUri: `mongodb://localhost:27017/${DbCollections.enum.apartmentListings}`,
  requestLogMultiUri: `mongodb://localhost:27017/${DbCollections.enum.requestLogMultiListing}`,
  requestLogSingleUri: `mongodb://localhost:27017/${DbCollections.enum.requestLogSingleListing}`,
};
