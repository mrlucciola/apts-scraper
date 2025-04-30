import { z } from "zod";
import { zUrl } from "../utils/zod";

/** @todo Incomplete enum */
export const Amenities = z.enum([
  "central_ac",
  "dishwasher",
  "fios_available",
  "hardwood_floors",
  "nyc_evacuation_6",
  "terrace",
  "washer_dryer",
]);
export type Amenities = z.infer<typeof Amenities>;

export const amenitiesMap: { [k in Amenities]: string } = {
  central_ac: "Central Air",
  dishwasher: "Dishwasher",
  fios_available: "Verizon FiOS Enabled",
  hardwood_floors: "Hardwood Floors",
  nyc_evacuation_6: "Private Outdoor Space",
  terrace: "Terrace",
  washer_dryer: "Washer / Dryer in Unit",
};

/** Example: https://streeteasy.com/rental/3943463 */
export const ZStreeteasyListingUrl = zUrl.regex(/(streeteasy\.com\/rental\/\d+)$/gm);
