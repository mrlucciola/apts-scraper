import { z } from "zod";
import { ListingIdField } from "../../../../../general/commonValidation";
import { AddressDb, LatLon } from "../../../../../db/models/address";
import { zUrl } from "../../../../../utils/zod";
import { Amenities } from "../../../../../streeteasyUtils/interfaces";
import { BuildingStatus } from "../../../../../db/models/building";

const unimportantFields = z.object({
  /** @deprecated unimportant */
  media: z.any().nullish(), // null,
  /** @deprecated unimportant */
  hasActiveBuildingShowcase: z.boolean().nullish(),
  /** @deprecated unimportant */
  hasPropertyDocs: z.boolean().nullish(),
  /** @deprecated unimportant */
  nearbySchools: z.array(z.any()).nullish(),
  aboutBuildingType: z.string().nullish(), // "Rental building",
  /** @deprecated unimportant */
  colleges: z.array(z.string()),
  /** @deprecated unimportant */
  museums: z.array(z.string()).nullish(),
  /** @deprecated unimportant */
  parks: z.array(z.string()).nullish(),
  /** @deprecated unimportant */
  schools: z.string().nullish(), // "$28",
  /** @deprecated unimportant */
  transitStations: z.string().nullish(), // "$29",
  /** @deprecated seems to be specific to just nyc */
  nyc: z.object({
    abatementExpiration: z.any().nullish(),
    abatementType: z.any().nullish(),
    hasAbatements: z.boolean().nullish(),
  }),
});

export const BuildingSchema = unimportantFields.partial().extend({
  se: z.object({ id: z.string(), areaId: z.number() }), // {id: "8108", areaId: 117}
  id: ListingIdField, // "8108",
  slug: z.string().nullish(), // "the-mayfair-145-4th-avenue-new_york",
  area: z.object({
    id: z.string().nullish(), // "east-village",
    name: z.string().nullish(), // "East Village",
    description: z.string().nullish(), // "Known and loved for being the birthplace of punk rock, the East Village is known for its vibrant restaurants and cocktail dens. During the day, however, the neighborhood slows down and has a tranquil feel. Meander down a leafy side street, and you'll happen upon plenty of prewar buildings and rusting fire escapes, which lend the East Village its old-fashioned charm.",
    breadcrumbs: z.array(z.object({ urlPart: z.string().nullish(), name: z.string().nullish() })), // {urlPart: "manhattan",name: "Manhattan"}
    neighborhoodsBlogSlug: z.string().nullish(), // "east-village",
    relatedAreas: z.array(
      z.object({
        id: z.string().nullish(), // "lower-east-side",
        name: z.string().nullish(), // "Lower East Side",
        neighborhoodsBlogSlug: z.string().nullish(), // "lower-east-side",
        slug: z.string().nullish(), // "les",
      })
    ),
    slug: z.string().nullish(), // "east-village",
  }),
  geoCenter: LatLon.nullish(), // {longitude: -73.989555, latitude: 40.733856}
  policies: z.object({
    list: z.array(z.string()), // @note - "PETS_ALLOWED"
    petPolicy: z.object({ catsAllowed: z.any(), dogsAllowed: z.any() }).nullish(),
  }),
  type: z.string().nullish(), // "Rental unit",
  additionalDetails: z.object({
    leasingStartDate: z.any().nullish(),
    salesStartDate: z.any().nullish(),
  }),
  status: BuildingStatus.nullish(), // @note Enum - "COMPLETED",
  address: AddressDb, // {street: "145 4th Avenue", city: "NEW YORK", state: "NY", zipCode: "10003"}
  complex: z.any().nullish(), // null,
  name: z.string().nullish(), // "The Mayfair",
  floorCount: z.number(), // 17,
  residentialUnitCount: z.number(), // 209,
  yearBuilt: z.number(), // 1964,
  rentalInventorySummary: z.object({
    availableListingDigests: z.array(z.object({ id: z.string() })),
  }), // {id: "4675935"}
  saleInventorySummary: z.object({ availableListingDigests: z.array(z.any()).nullish() }),
  nearby: z.object({
    /** [{ name: "14th St-Union Square", routes: ["L", "N", "Q", "R", "W", "4", "5", "6"], distance: 0.0224 }] */
    transitStations: z.array(
      z.object({ name: z.string().nullish(), routes: z.array(z.string()), distance: z.number() })
    ),
    pointsOfInterest: z.array(
      z.object({
        distance: z.number().nullish(), // 0.36550000309944153
        name: z.string().nullish(), // "Yeshiva University Museum"
        type: z.string().nullish(), // "MUSEUM" @note enum
      })
    ),
  }),
  amenities: z.object({ list: z.array(Amenities) }),
  documentsUrl: zUrl.nullish(), // "https://streeteasy.com/building/the-mayfair-145-4th-avenue-new_york/documents",
  latitude: z.number(), // 40.733856,
  longitude: z.number(), // -73.989555,
});
export type BuildingSchema = z.infer<typeof BuildingSchema>;
