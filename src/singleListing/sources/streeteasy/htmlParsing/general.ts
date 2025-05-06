import { z } from "zod";
import { ListingIdField } from "../../../../general/commonValidation";
import { AddressDb } from "../../../../db/models/address";
import { RentalHistoryStatus } from "../../../../db/models/rentalHistory";
import { Amenities } from "../../../../streeteasyUtils/interfaces";

export const PropertyDetails = z.object({
  address: AddressDb.omit({ latitude: true, longitude: true, region: true }), // @note may be `AddressDb.omit({ latitude: true, longitude: true, region: true })`

  roomCount: z.number(), // 4,
  bedroomCount: z.number(), // 2,
  fullBathroomCount: z.number(), // 2,
  halfBathroomCount: z.number(), // 0,
  livingAreaSize: z.number().nullish(), // 990,
  lotAreaSize: z.number(), // 0,
  amenities: z
    .object({
      list: z.array(Amenities),
      doormanTypes: z.array(z.any()),
      parkingTypes: z.array(z.any()),
      sharedOutdoorSpaceTypes: z.array(z.any()),
      storageSpaceTypes: z.array(z.any()),
    })
    .passthrough(),
  features: z
    .object({
      list: z.array(Amenities),
      fireplaceTypes: z.array(z.any()),
      privateOutdoorSpaceTypes: z.array(z.any()),
      views: z.array(z.string()), // ["CITY", "SKYLINE"],
    })
    .passthrough()
    .nullable(),
});
export type PropertyDetails = z.infer<typeof PropertyDetails>;

// export const AgentFields = z.object({});
export const AgencyFields = z.object({
  sourceGroupLabel: z.string(), // "Manhattan Realty Group",
  license: z
    .object({
      address: AddressDb,
      businessName: z.string(), // "Manhattan Realty Group",
      licenseType: z.string(), // @note enum "Corporate Broker",
    })
    .nullish(),
});

/**
 * - `initialPageFlow.page.elements[idx].children[idx].children[idx].config.contacts_federated[idx]`
 * - `initialPageFlow.page.elements[idx].config.primary.fieldValues.listedBy`
 * - `initialPageFlow.page.elements[idx].config.secondary.fieldValues.listedBy`
 * - `initialPageFlow.page.elements[idx].config.primary.actionData.fieldValues.listedBy`
 */
export const ListedByListItem = z.object({
  contactId: z.number(), // 362385,
  profileId: z.number(), // 955466,
  name: z.string(), // "Luis Hernandez",
  phone: z.string(), // "+16467156554",
  licenseType: z.string().nullish(), // "Real Estate Salesperson",
  sourceGroupLabel: z.string(), // "Manhattan Realty Group",
  isPro: z.boolean().nullish(),
  profileImage: z.object({ key: z.string() }).passthrough().nullish(), // "c9b923ae3f35bff2e5ddbcd6a2c4fc2c",
});
export type ListedByListItem = z.infer<typeof ListedByListItem>;

export const ContextListingSchema = z.object({
  id: ListingIdField, // "4709208",
  propertyDetails: PropertyDetails.pick({
    address: true,
    bedroomCount: true,
    fullBathroomCount: true,
    halfBathroomCount: true,
  }), // @note IMPORTANT
  pricing: z.object({ price: z.number() }).passthrough(),
  status: RentalHistoryStatus, // "ACTIVE",
  legacy: z.object({ sourceGroupLabel: z.string() }), // "Manhattan Realty Group",
});
export type ContextListingSchema = z.infer<typeof ContextListingSchema>;

/**
 * - initialPageFlow.page.elements[idx].config.primary.actionData.fieldValues
 * - initialPageFlow.page.elements[idx].config.secondary.actionData.fieldValues
 */
export const ActionDataFieldValuesSchema = z.object({
  listedBy: ListedByListItem,
  name: z.any().nullish(),
  phone: z.any().nullish(),
  email: z.any().nullish(),
});

const Contact_boxSchema = z.object({
  contact_program_txt: z.string(), // "paid_inclusion"
  contact_box_type_cd: z.string(), // "ask_a_question" | "schedule_tour"
  contact_program_segment_txt: z.any().nullish(),
});
export const ActionDataSchema = z.object({
  clickstreamEvent: z
    .object({
      eventName: z.string(), // "event_5094_v5",
      eventOptions: z
        .object({
          triggerSource: z.string().nullish(), // "button_to_ask_a_question",
          contextualBlocks: z.object({ contact_box: Contact_boxSchema }).nullish(),
        })
        .nullish(),
    })
    .nullish(),
  name: z.string(), // "ContactBox-HDP-Rentals-Consumer-AskQuestion-v.0.0.2.workflow",
  context: z.object({
    listedByList: z.array(ListedByListItem),
    authToken: z.any().nullish(),
    contact_box: Contact_boxSchema,
    isLoggedIn: z.boolean().nullish(),
    chip_storing_tcpa_consents: z.boolean().nullish(),
    listingId: ListingIdField, // "4709208",
    listing: ContextListingSchema,
    listingAddress: z.string(), // "145 4th Avenue #16A",
    user: z.any().nullish(),
    rentalId: ListingIdField, // "4709208",
  }),
  defaultTriggerLabel: z.string().nullish(), // "home_details_component|user_actions",
  fieldValues: ActionDataFieldValuesSchema,
  event: z.object({ action: z.string() }).passthrough().nullish(), // {action: "click_to_request_tour"}
  headline: z.string(), // "Ask a question" | "Request a tour"
});
