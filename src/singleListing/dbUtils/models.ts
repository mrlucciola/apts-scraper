import { z } from "zod";
import { PriceHistory } from "../parseHtml/altHtmlSchemas";
import { ActiveRentalStats, GqlItemPage } from "../parseHtml/activeRentalStats";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const StreeteasyHtmlDetailSchema = z.object({
  priceHistory: z.array(PriceHistory),
  savedByCt: z.number(),
  activeRentalStats: ActiveRentalStats,
  description: GqlItemPage.shape.about.shape.description,
  name: GqlItemPage.shape.about.shape.name,
  fullAddress: GqlItemPage.shape.mainEntity.shape.address,
});
export type StreeteasyHtmlDetailSchema = z.infer<typeof StreeteasyHtmlDetailSchema>;
