import { z } from "zod";
import { ListingIdField } from "../../../../../general/commonValidation";
import { zDayjs } from "../../../../../utils/zod";
import {
  RentalHistoryEventBase,
  RentalHistoryStatus,
} from "../../../../../db/models/rentalHistory";
import { AgencyFields, PropertyDetails } from "../general";

const PriceStats = z.object({
  maxPrice: z.number(), // 18900,
  medianPrice: z.number(), // 4995,
  minPrice: z.number(), // 1000,
  numListings: z.number(), // 389,
});

const unimportantFields = z.object({});
const importantFields = z.object({
  id: ListingIdField,
  buildingId: z.string(),
  daysOnMarket: z.number(), // 19,
  onMarketAt: zDayjs, // "2025-04-11",
  legacy: AgencyFields,
  status: RentalHistoryStatus,
  statusChanges: z.array(z.object({ status: RentalHistoryStatus, changedAt: zDayjs })),
  createdAt: zDayjs, // "2025-04-11T15:45:44.000-04:00",
  updatedAt: zDayjs, // "2025-04-14T10:41:03.000-04:00",
  availableAt: zDayjs, // "2025-06-01",
  interestingChangeAt: zDayjs, // "2025-04-11T15:55:44.000-04:00",
  description: z.string().nullish(), // "$35",
  propertyDetails: PropertyDetails,

  propertyHistory: z.array(
    z.object({
      listingId: ListingIdField, // "4709208",
      sourceGroupLabel: z.string(), // "Manhattan Realty Group",
      rentalEventsOfInterest: z.array(RentalHistoryEventBase),
    })
  ),
  pricing: z.object({
    noFee: z.boolean(), // false,
    price: z.number(), // 8250,
    furnishedRent: z.any(), // null,
    dueUpFront: z.any(), // null,
    securityDeposit: z.any(), // null,
    leaseTermMonths: z.any(), // null,
    monthsFree: z.any(), // null,
    rentedPrice: z.any(), // null,
    netEffectiveRent: z.any(), // null,
    interestingPriceDelta: z.any(), // null,
    priceChanges: z.array(z.object({ price: z.number(), changedAt: zDayjs })), // [{price: 8250, changedAt: "2025-04-11T15:55:43.000-04:00"}]
  }),
  upcomingOpenHouses: z.array(z.any()),
  slug: z.string(), // "16a",
  offMarketAt: z.any(), // null,
  listingSource: z.object({ sourceType: z.string(), sourceListingId: z.any() }), // {sourceType: "PARTNER",sourceListingId: null,}
  mlsNumber: z.any(), // null,
  media: z.object({
    videos: z.array(z.any()),
    tour3dUrl: z.any(), // null,
    floorPlans: z.array(z.object({ key: z.string() })),
  }),
  recentListingsPriceStats: z.object({
    bedroomCount: z.number(), // 2,
    rentalPriceStats: PriceStats,
    salePriceStats: PriceStats,
  }),
  latestListing: z.object({
    id: ListingIdField, // "4709208",
    status: RentalHistoryStatus,
    pricing: z.object({ price: z.number() }).passthrough(), // 8250
  }),
  urlPath: z.string(), // "/building/the-mayfair-145-4th-avenue-new_york/16a",
  saleType: z.any(), // null,
});

export const ListingSchema = importantFields.merge(unimportantFields);
export type ListingSchema = z.infer<typeof ListingSchema>;
