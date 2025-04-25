import type { Listing } from "../../db/models/listing";
import type { ExtractListingsFromBodyFxn, ValidateAndTransformToDbModel } from "../interfaces";
import type { GqlResJson } from "./res";

type InsertListingRes = GqlResJson["data"]["searchRentals"]["edges"][number];

type RentalDb = Omit<Partial<Listing["rental"]>, "building" | "address"> & {
  building: Partial<Listing["rental"]["building"]>;
  address: Partial<Listing["rental"]["address"]>;
};

type InsertListingDb = Omit<Partial<Listing>, "rental"> & Partial<{ rental: RentalDb }>;

export const extractListingsFromBodyStreeteasy: ExtractListingsFromBodyFxn<
  GqlResJson,
  InsertListingRes
> = (body) => body.data.searchRentals.edges;

/** @deprecated Needs to be updated to new DB model for `Listing` */
export const validateAndTransformToDbModelStreeteasy: ValidateAndTransformToDbModel<
  InsertListingRes,
  InsertListingDb
> = (listings) =>
  listings.map(({ node: l }) => ({
    listing_id: l.id,
    latitude: l.geoPoint.latitude,
    longitude: l.geoPoint.longitude,
    listed_price: l.price,
    rental: {
      id: l.id,
      listingPrice: l.price,
      building: {
        url: l.urlPath,
      },
      address: { unit: l.unit },
      source: l.urlPath,
      listingBaths: `${l.fullBathroomCount + Math.round((l.halfBathroomCount * 10) / 2) / 10}`,
      listingBeds: `${l.bedroomCount}`,
      listingAddress: `${l.street} ${l.unit}`,
      // latitude: l.geoPoint.latitude,
      // longitude: l.geoPoint.longitude,
    },
  }));
