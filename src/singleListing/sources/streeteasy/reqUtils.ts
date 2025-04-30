import type { ListingIdField } from "../../../general/commonValidation";

export const buildListingUrl = (listingId: ListingIdField): string =>
  `https://streeteasy.com/rental/${listingId}`;
