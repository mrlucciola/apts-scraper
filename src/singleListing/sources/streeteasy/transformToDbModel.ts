import { ListingFields, type Listing } from "../../../db/models/listing";
import type { TransformToDbModel } from "./ServiceConfigSl";
import type { HtmlPayloadSchema_SeSl } from "./htmlParsing/htmlToJsonValidation";
import type { ListingSchema } from "./htmlParsing/htmlToJsonValidation/ListingSchema";
import type { RentalHistoryEventBase } from "../../../db/models/rentalHistory";
import { BuildingType } from "../../../streeteasyUtils/listingEnums";

type TListingRes = HtmlPayloadSchema_SeSl;
type TListingDb = Listing;

/**
 *
 * RentalHistoryEventBase[] = ListingSchema["propertyHistory"][number]["rentalEventsOfInterest"]
 * RentalHistoryEvent[]     = ListingFields["history"]
 *
 * ListingSchema["propertyHistory"][number]["rentalEventsOfInterest"] -> ListingFields["history"]
 * RentalHistoryEventBase[] -> RentalHistoryEvent[]
 */
const propertyHistoryToPriceHistory = (
  propertyHistory: ListingSchema["propertyHistory"]
): ListingFields["history"] => {
  const priceHistoryEventsOrig: RentalHistoryEventBase[] = [];

  propertyHistory.forEach((ph) => {
    priceHistoryEventsOrig.push(...ph.rentalEventsOfInterest);
  });

  return ListingFields.shape.history.parse(priceHistoryEventsOrig);
};

export const transformToDbModel: TransformToDbModel<TListingRes, TListingDb> = (listing) => {
  const contactFirstElement = listing.contactBoxInitialData.initialPageFlow.page.elements[0];
  const contactConfig = contactFirstElement?.config;
  const actionData = contactConfig.primary?.actionData ?? contactConfig.secondary?.actionData;
  const agentFieldValues = actionData?.fieldValues;
  const agentInfo =
    agentFieldValues?.listedBy ??
    contactFirstElement?.children[0]?.children[0]?.config?.contacts_federated[0];

  const listingDb: ListingFields = {
    id: listing.listing.id,
    address: {
      latitude: listing.building.latitude,
      longitude: listing.building.longitude,
      ...listing.listing.propertyDetails.address,
    },

    price: listing.listing.pricing.price,
    noFee: listing.listing.pricing.noFee,
    // RentalHistoryEventBase -> RentalHistoryEvent[]
    history: propertyHistoryToPriceHistory(listing.listing.propertyHistory),
    status: listing.listing.status,

    broker: {
      agency: listing.listing.legacy.sourceGroupLabel,
      email: agentFieldValues?.email ?? undefined, // @todo Not yet discovered
      fullName: agentInfo.name,
      phone: agentInfo.phone,
    }, // BrokerInfo.optional(),

    /** From `log` collection */
    // updateId: z.string().optional(),
    /** From `log` collection. Should match date associated with `updateId`. */
    // dtUpdate: zDayjs.optional(),

    // BuildingInfo
    buildingType: BuildingType.parse(listing.building.aboutBuildingType), // BuildingType.optional(),
    buildingId: listing.building.id,

    // ListingStats
    // savedByCt: z.number().nullish(),
    amenities: [
      ...listing.listing.propertyDetails.amenities.list,
      ...(listing.listing.propertyDetails.features?.list || []),
    ],
    listingType: listing.listingType,
    daysOnMarket: listing.listing.daysOnMarket, // z.number().nullish(),
    availableAt: listing.listing.availableAt, // zDayjs.nullish(), // "2024-11-12",
    // description, // @todo get
    // outdoorSize, // @todo get
    bedCt: listing.listing.propertyDetails.bedroomCount,
    roomCt: listing.listing.propertyDetails.roomCount,
    fullBathCt: listing.listing.propertyDetails.fullBathroomCount,
    halfBathCt: listing.listing.propertyDetails.halfBathroomCount,
    size: listing.listing.propertyDetails.livingAreaSize ?? undefined,
    urlPath: listing.listing.urlPath,
  };
  const validatedListing = ListingFields.parse(listingDb);
  return { current: validatedListing, sources: { streeteasy: validatedListing } };
};
