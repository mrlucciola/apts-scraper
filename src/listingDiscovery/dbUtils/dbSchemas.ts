import { z } from "zod";
// validation
import { zDates } from "../../general/dbUtils/zodSchemas";
// interfaces
import { MultiListingResItem } from "../response";
import { SingleListingResBody } from "../../singleListing/response";

export const ListingRowBase = zDates.merge(MultiListingResItem).merge(SingleListingResBody);
export type ListingRowBase = z.infer<typeof ListingRowBase>;

export const ListingNote = zDates.merge(z.object({ content: z.string() }));
export type ListingNote = z.infer<typeof ListingNote>;

export const SavedListingsRow = ListingRowBase.merge(SingleListingResBody).merge(
  z.object({
    // ... raw fields
    /** When updating a listing's note, array.push */
    notes: z.array(ListingNote),
    /** When updating a single listing, array.push ListingRowBase.safeParse(row).data */
    log: z.array(ListingRowBase),
  })
);
export type SavedListingsRow = z.infer<typeof SavedListingsRow>;
