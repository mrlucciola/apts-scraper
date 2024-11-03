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
