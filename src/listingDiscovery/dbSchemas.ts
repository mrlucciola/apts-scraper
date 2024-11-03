import { z } from "zod";
// validation
import { zDates } from "../general/dbUtils/zodSchemas";
// interfaces
import { MultiListingResItem } from "./response";
import { SingleListingResBody } from "../singleListing/response";

const ListingRowBase = zDates.merge(MultiListingResItem).merge(SingleListingResBody);
type ListingRowBase = z.infer<typeof ListingRowBase>;

const ListingNote = zDates.merge(z.object({ content: z.string() }));

export const SavedListingsRow = ListingRowBase.merge(
  z.object({
    // ... raw fields
    /** When updating a listing's note, array.push */
    notes: z.array(ListingNote),
    /** When updating a single listing, array.push ListingRowBase.safeParse(row).data */
    log: z.array(ListingRowBase),
  })
);
export type SavedListingsRow = z.infer<typeof SavedListingsRow>;
