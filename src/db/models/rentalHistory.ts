import { z } from "zod";
import { zDayjs } from "../../utils/zod";

/** @note Possibly incomplete enum */
export const RentalHistoryStatus = z.preprocess(
  (input, _ctx) => (typeof input === "string" ? input.toUpperCase() : input),
  z.enum([
    "NO_LONGER_AVAILABLE",
    "ACTIVE",
    "LISTED",
    "PRICE_DECREASE",
    "PRICE_INCREASE",
    "RENTED",
    "DELISTED",
    "DRAFT",
    "TEMPORARILY_OFF_MARKET",
  ])
);
export type RentalHistoryStatus = z.infer<typeof RentalHistoryStatus>;

export const RentalHistoryEventBase = z.object({
  price: z.number(),
  status: RentalHistoryStatus.optional(),
  pricePercentChange: z.number().optional(),
  date: zDayjs, // "2020-07-14"
});
export type RentalHistoryEventBase = z.infer<typeof RentalHistoryEventBase>;
