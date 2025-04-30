import type { ListingIdField } from "../../../general/commonValidation";

export const buildListingUrl = (listingId: ListingIdField): string =>
  `https://streeteasy.com/rental/${listingId}`;

/**
 *
 * Example: "https://streeteasy.com/building/the-mayfair-145-4th-avenue-new_york/16a"
 */
export const buildListingUrlBySlug = (buildingSlug: string, unitId: string): string =>
  `https://streeteasy.com/building/${buildingSlug}/${unitId}`;
