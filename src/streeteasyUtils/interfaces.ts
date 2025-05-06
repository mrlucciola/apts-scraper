import { z } from "zod";
import { zUrl } from "../utils/zod";

/** @todo Incomplete enum */
const AmenitiesEnum = z.enum([
  "central_ac",
  "dishwasher",
  "fios_available",
  "hardwood_floors",
  "nyc_evacuation_6",
  "terrace",
  "washer_dryer",

  "doorman",
  "elevator",
  "gym",
  "laundry",
  "live_in_super",
  "package_room",
  "view",
  "parking",
]);
export const Amenities = z.preprocess((arg, ctx) => {
  if (typeof arg === "string") return AmenitiesEnum.parse(arg.toLowerCase());
  return AmenitiesEnum.parse(arg);
}, AmenitiesEnum);
export type Amenities = z.infer<typeof Amenities>;

export const amenitiesMap: { [k in Amenities]: string } = {
  central_ac: "Central Air",
  dishwasher: "Dishwasher",
  fios_available: "Verizon FiOS Enabled",
  hardwood_floors: "Hardwood Floors",
  nyc_evacuation_6: "Private Outdoor Space",
  terrace: "Terrace",
  washer_dryer: "Washer / Dryer in Unit",
  doorman: "Doorman",
  elevator: "Elevator",
  gym: "Gym",
  laundry: "Laundry in building",
  live_in_super: "Live-in super",
  package_room: "Package room",
  view: "View",
  parking: "Parking",
};

/** Example: https://streeteasy.com/rental/3943463 */
export const ZStreeteasyListingUrl = zUrl.regex(/(streeteasy\.com\/rental\/\d+)$/gm);
