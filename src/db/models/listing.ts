import { prop, modelOptions, Severity, getModelForClass } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose/lib/types";
import { z } from "zod";
import { ExtApiService } from "../../general/enums";
import { zDayjs } from "../../utils/zod";
import { BuildingType } from "../../streeteasyUtils/listingEnums";

export const BrokerInfo = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  fullName: z.string(),
  agency: z.string().optional(),
});
export type BrokerInfo = z.infer<typeof BrokerInfo>;

/** LOCATION */
export const getFullAddress = ({ zipCode, state, city, region, street, unit }: Address): string => {
  return `${street} #${unit}, ${city}, ${state} ${zipCode}`;
};

export const Address = z.object({
  state: z.string(), // "NY",
  city: z.string(), // "NY",
  region: z.string(), // "Manhattan",
  street: z.string(), // "78 West 3rd Street",
  unit: z.string(), // "2a",
  zipCode: z.string(), // "10012",

  longitude: z.number(),
  latitude: z.number(),
});
export type Address = z.infer<typeof Address>;

/** STATUS */
export const RentalHistoryStatus = z.enum(["NO_LONGER_AVAILABLE", "ACTIVE"]);
export type RentalHistoryStatus = z.infer<typeof RentalHistoryStatus>;

export const RentalHistoryEvent = z
  .object({
    price: z.number(),
    status: RentalHistoryStatus.optional(),
    pricePercentChange: z.number().optional(),
    date: zDayjs, // "2020-07-14"
  })
  .transform((statusObj, ctx) => {
    if (!statusObj.pricePercentChange && !statusObj.status) {
      const message = `At least one of: 'pricePercentChange'/'status' must be defined. ${JSON.stringify(
        statusObj
      )}`;
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      return z.NEVER;
    }

    /** @note This forced type is allowed */
    const status: RentalHistoryStatus =
      statusObj.pricePercentChange !== undefined
        ? RentalHistoryStatus.enum.ACTIVE
        : statusObj.status!;
    /** @note This forced type is allowed */
    const pricePercentChange: number =
      statusObj.status !== undefined ? 0 : statusObj.pricePercentChange!;

    return { ...statusObj, status, pricePercentChange };
  });
export type RentalHistoryEvent = z.infer<typeof RentalHistoryEvent>;

export const RentalHistory = z.array(RentalHistoryEvent);
export type RentalHistory = z.infer<typeof RentalHistory>;

export const ListingFields = z.object({
  id: z.string(),
  price: z.number(),

  /**
   * getRentalHistory = () => {
   *   listing.history[0]
   * }
   */
  history: RentalHistory,
  daysOnMarket: z.number(),

  address: Address,

  broker: BrokerInfo,

  buildingType: BuildingType,
  buildingId: z.string(),
  availableAt: zDayjs, // "2024-11-12",
  description: z.string(),
  roomCt: z.number(),
  bedCt: z.number(),
  fullBathCt: z.number(),
  halfBathCt: z.number(),
  size: z.number(),
  outdoorSize: z.number(),

  updateId: z.string(),
  // From single-listing should match updateId
  dtUpdate: zDayjs,
});
export type ListingFields = z.infer<typeof ListingFields>;

export const FieldLogItemBase = z.object({
  dtCreated: zDayjs,
  updateId: z.string(),
});
export type FieldLogItemBase = z.infer<typeof FieldLogItemBase>;

@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class Listing {
  @prop({ required: true })
  current: ListingFields;

  sources: { [key in ExtApiService]: ListingFields };
}

const ListingModel = getModelForClass(Listing, {
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { timestamps: true },
});
export default ListingModel;
export type ListingModel = typeof ListingModel;

export type ListingDoc = DocumentType<Listing>;

export type ListingKey = keyof Listing;
