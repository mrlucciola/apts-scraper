import { z } from "zod";
import { zDayjs } from "../../utils/zod";

/** @note Possibly incomplete enum */
export const RentalHistoryStatus = z.enum([
  "NO_LONGER_AVAILABLE",
  "ACTIVE",
  "LISTED",
  "PRICE_DECREASE",
  "PRICE_INCREASE",
  "RENTED",
  "DELISTED",
  "DRAFT",
  "TEMPORARILY_OFF_MARKET",
]);
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
