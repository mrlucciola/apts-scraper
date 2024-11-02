import { z } from "zod";

export const SavedListingItem = z.object({});
export type SavedListingItem = z.infer<typeof SavedListingItem>;

export const SavedListingsRow = z.object({
  // ... raw fields
  dtLastUpdated: z.number(),
  log: SavedListingItem,
});
export type SavedListingsRow = z.infer<typeof SavedListingsRow>;
