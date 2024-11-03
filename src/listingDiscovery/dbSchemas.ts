import { z } from "zod";
import { MultiListingRes } from "./response";
import { zDates } from "../dbUtils/zodSchemas";

const ListingNote = z
  .object({
    content: z.string(),
  })
  .merge(zDates);

const insertListingSchema = MultiListingRes.merge(
  z.object({
    notes: z.array(ListingNote),
  })
).merge(zDates);

export const SavedListingItem = z.object({});
export type SavedListingItem = z.infer<typeof SavedListingItem>;

export const SavedListingsRow = z.object({
  // ... raw fields
  dtLastUpdated: z.number(),
  log: SavedListingItem,
});
export type SavedListingsRow = z.infer<typeof SavedListingsRow>;
