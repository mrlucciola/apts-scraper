import { prop, modelOptions, Severity, getModelForClass } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose/lib/types";
import { z } from "zod";
// utils
import { zDayjs } from "../../utils/zod";
import { zDocFields, zMongoId } from "../zodSchemas";
import { ExtApiService } from "../../general/enums";
//
import { BuildingType } from "../../streeteasyUtils/listingEnums";
import { AddressDb } from "./address";
import { RentalHistoryEventBase, RentalHistoryStatus } from "./rentalHistory";
import { ListingIdField } from "../../general/commonValidation";
import { Amenities } from "../../streeteasyUtils/interfaces";

export const BrokerInfo = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string().optional(),
  agency: z.string().nullish(),
});
export type BrokerInfo = z.infer<typeof BrokerInfo>;

/** LOCATION */

/** STATUS */
export const UnitInfo = z.object({
  roomCt: z.number().optional(),
  size: z.number().optional(),
  outdoorSize: z.number().optional(),
  description: z.string().optional(),
  bedCt: z.number().int().optional(),
  fullBathCt: z.number().int().optional(),
  halfBathCt: z.number().int().optional(),
  urlPath: z.string().optional(), // "/building/356-1-street-hoboken/1r"
});
export const BuildingInfo = z.object({
  /** @note Currently includes all observed values, there may be others however. */
  buildingType: BuildingType.optional(),
  buildingId: z.string().optional(),
});

export const ListingStats = z.object({
  savedByCt: z.number().nullish(),
  amenities: z.array(Amenities).nullish(),
  listingType: z.enum(["rental"]).nullish(),
  daysOnMarket: z.number().nullish(),
  availableAt: zDayjs.nullish(), // "2024-11-12",
});

export const ListingFields = UnitInfo.merge(BuildingInfo)
  .merge(ListingStats)
  .extend({
    id: ListingIdField,
    address: AddressDb,

    price: z.number(),
    noFee: z.boolean().optional(), // On `EdgeNode`
    history: z.array(RentalHistoryEventBase).optional(),
    status: RentalHistoryStatus.optional(),

    broker: BrokerInfo.optional(),

    displayUnit: z.string().nullish(),
    furnished: z.boolean().nullish(),

    /** From `log` collection */
    updateId: z.string().optional(),
    /** From `log` collection. Should match date associated with `updateId`. */
    dtUpdate: zDayjs.optional(),
  });
export type ListingFields = z.infer<typeof ListingFields>;

export const FieldLogItemBase = z.object({
  dtCreated: zDayjs,
  updateId: z.string(),
});
export type FieldLogItemBase = z.infer<typeof FieldLogItemBase>;

export const ListingWriteValidation = z.object({
  current: ListingFields,
  sources: z.record(ExtApiService, ListingFields),
});
export type ListingWriteValidation = z.infer<typeof ListingWriteValidation>;

export const ListingReadValidation = ListingWriteValidation.merge(zDocFields);
export type ListingReadValidation = z.infer<typeof ListingReadValidation>;

@modelOptions({
  schemaOptions: { collection: "listings", timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Listing implements ListingWriteValidation {
  @prop({ required: false, type: () => Object })
  current: ListingFields;

  @prop({ required: false, type: () => Object })
  sources: { [key in ExtApiService]: ListingFields };
}

const ListingModel = getModelForClass(Listing, {
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { timestamps: true, collection: "listings" },
});
export default ListingModel;
export type ListingModel = typeof ListingModel;

export type ListingDoc = DocumentType<Listing>;

export type ListingKey = keyof Listing;

/**
 * getRentalHistory = () => {
 *   listing.history[0]
 * }
 */
