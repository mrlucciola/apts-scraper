import { z } from "zod";
import { zDayjs, zNumeric } from "../../utils/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const PriceHistory = z.object({
  date: zDayjs.transform<string>((v) => v.local().format("YYYY-MM-DD")), // date: "2022-10-20"
  description: z.string(), // "Rented by Douglas Elliman"
  event: z.string(), // z.enum([ 'LISTED','RENTED','IN_CONTRACT','PRICE_DECREASE','PRICE_INCREASE','NO_LONGER_AVAILABLE' ]);
  listing_id: zNumeric, // "3943463"
  closing_id: zNumeric.nullable(), // null
  price: z.number().nullable(), // 10000
  source_group_label: z.string().nullable(), // "Douglas Elliman"
  url: z.string().url().nullable(), // null
});
export type PriceHistory = z.infer<typeof PriceHistory>;
export const ListingImage = z.object({
  originalUrl: z.string().url(),
  galleryUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
});
export type ListingImage = z.infer<typeof ListingImage>;
export const RelatedListing = z.object({
  id: zNumeric, // numeric: "2758811"
  listed_at: zDayjs, // Datetime: "2019-06-07T20:06:29Z"
  listed_price: z.number().nullable(), // 8995
  images: z.array(ListingImage),
});
export type RelatedListing = z.infer<typeof RelatedListing>;
export const PastListingsExperience = z.object({
  pastListingsData: z.object({
    goldUserAuthFFEnabled: z.boolean().nullish(), // true
    isLoggedInUser: z.boolean().nullish(), // false
    listingType: z.string().nullish(), // "rental"
    rental: z.object({
      price_histories: z.array(PriceHistory),
      related_listings: z.array(RelatedListing),
    }),
  }),
});
export type PastListingsExperience = z.infer<typeof PastListingsExperience>;
