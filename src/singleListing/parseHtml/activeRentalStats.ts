import { z } from "zod";
import { zNumeric } from "../../utils/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const ActiveRentalStats = z.object({
  zguidh: z.string().nullish(), // "24980932621751695325648395730615895579658804982765717143092"
  site: z.string().nullish(), // "nyc"
  experiments: z.any().nullish(), // { streeteasy_rental_hdp_aa_test: z.string().nullish(), // "on" hdp_migration: z.string().nullish(), // "legacy" }
  userType: z.any().nullish(), // "anonymous"
  pageCat: z.any().nullish(), // "rentals"
  pageType: z.any().nullish(), // "show"
  listType: z.any().nullish(), // "rental"
  listID: z.number(), // 3943463,
  /** @note important */
  listPrice: z.number(), // 10000,
  listBoro: z.string().nullish(), // "manhattan"
  listNabe: z.string().nullish(), // "greenwich-village"
  listZip: z.string().nullish(), // "10012"
  listPropertyType: z.any().nullish(), // "rental"
  listStatus: z.string().nullish(), // "sold"
  /** @note useful */
  listDaysMarket: z.number(), // 40,
  listAgent: z.string().nullish(), // "Lincoln Wettenhall"
  /** @note useful */
  listAgentId: z.string().nullish(), // "96314"
  listBrokerage: z.string().nullish(), // "elliman"
  /** @note pull from another item, or map */
  listAmen: z
    .union([z.string(), z.array(z.string())])
    .nullish()
    .transform<string[] | null>((v) => (!v ? null : typeof v === "string" ? v.split("|") : v)), // "central_ac|dishwasher|fios_available|hardwood_floors|nyc_evacuation_6|terrace|washer_dryer",
  listBuilding: z.number().nullish(), // 7727,
  listAvailDate: z.string(), // "2022-09-07T09:57:59-04:00"
  /** @note useful */
  listSqFt: z.number(), // 0,
  /** @note useful */
  listBed: z.number(), // 3,
  /** @note useful */
  listBath: z.number(), // 2.0,
  /** @note useful */
  listRoom: z.number(), // 6.0
  listPhotos: z.number().nullish(), // 6
  listVideo: z.number().nullish(), // 1
  listOpenHouse: z.any().nullish(),
  listDate: z.string().nullish(), // "2022-09-07"
  /** @note helpful */
  listFloorPlan: z.boolean().nullish(), // true,
  /** @note important */
  listGeoLat: z.number().nullish(), // 40.72959308,
  /** @note important */
  listGeoLon: z.number().nullish(), // -73.99884181,
  buildID: z.number().nullish(), // 7727,
  buildNabe: z.string().nullish(), // "greenwich-village"
  buildBoro: z.string().nullish(), // "manhattan"
  /** @note useful */
  buildUnits: z.number().nullish(), // 6,
  buildZip: z.string().nullish(), // "10012"
  /** @note helpful */
  buildStories: z.number().nullish(), // 4.0,
  /** @note helpful */
  buildYear: z.number().nullish(), // 1901,
  buildActiveSaleList: z.any().nullish(), // 0,
  buildPreviousSaleList: z.any().nullish(), // 0,
  buildActiveRentalList: z.any().nullish(), // 0,
  buildPhotos: z.any().nullish(), // 0,
  buildVideo: z.any().nullish(), // 0,
  buildHighRental: z.any().nullish(), // 10000,
  buildType: z.string().nullish(), // "Mixed-Use"
  verizonTag: z.any().nullish(), // true,
  propID: z.number().nullish(), // 8726738,
  /** @note important */
  propAreaID: z.number(), // 116,
  propBoro: z.string().nullish(), // "manhattan"
  propAreaShort: z.string().nullish(), // "greenwich-village"
  propBuildingID: z.number().nullish(), // 7727,
  /** @note important */
  propLatitude: z.number().nullish(), // 40.72959308,
  /** @note important */
  propLongitude: z.number().nullish(), // -73.99884181,
  propZipCode: z.string().nullish(), // "10012"
  propType: z.string().nullish(), // "Mixed-Use"
  propFullBaths: z.number(), // 2.0,
  propHalfBaths: z.number(), // 0,
  propBeds: z.number(), // 3,
  propRooms: z.number(), // 6.0,
  propSqFt: z.number(), // 0,
  mediaID: z.any().nullish(), // "52042113|52042114|52042116|52042117|52042118|52042120"
  mediaType: z.any().nullish(), // "image|image|image|image|image|image"
  session_q_c: z.any(), // 0,
  cookie_q_c: z.any(), // 0,
});
export type ActiveRentalStats = z.infer<typeof ActiveRentalStats>;

// const scriptContentToValue = <T>(): T => {};

export const parseActiveRentalStats = (doc: Document): ActiveRentalStats => {
  const jsScriptTags = doc.querySelectorAll('body > div > script[type="text/javascript"]');
  for (const scriptElem of jsScriptTags) {
    const dataLayerMatchStr = "dataLayer =";
    if (scriptElem.textContent?.includes(dataLayerMatchStr)) {
      const dataLayer = eval(scriptElem.textContent.split(dataLayerMatchStr)[1]);

      const activeRentalStats = z.array(ActiveRentalStats).min(1).parse(dataLayer);
      return activeRentalStats[0];
    }
  }

  throw new Error("parseActiveRentalStats: none returned");
};

export const GqlItemPage = z.object({
  about: z.object({
    "@type": z.string().nullish(), // "Product",
    name: z.string(), // "78 West 3rd Street #2A",
    offers: z.object({
      "@type": z.string().nullish(), // "Offer",
      price: zNumeric, // "10000.00",
      priceCurrency: z.string().nullish(), // "USD",
      availability: z.string().nullish(), // "inStock",
      url: z.string().url().nullish(), // "https://streeteasy.com/rental/3943463",
    }),
    brand: z.string().nullish(), // "Douglas Elliman",
    description: z.string(), // "Greenwich Village loft perfection. 3 bedroom and 2 bathroom generously proportioned full floor loft with a private outdoor space off the kitchen. This elegant residence features a chef’s kitchen, spacious private terrace, 2 bedrooms with custom closets and a master bedroom with en suite bathroom. Apartment has its own washer/dryer. Located in 78 West 3rd Street a boutique 4 unit rental building in Greenwich Village. This modern rental building features unique luxury apartments ranging from 1 bedrooms to 3 bedrooms. The sleek facade of the building features the original brick fused with copper. Located at the crossroads of downtown with easy access to the Subway, NYU, Washington Square Park and so much more.\n\nPlease no pets, this apartment has a broker's fee.",
    image: z.string().url().nullish(), // "https://photos.zillowstatic.com/fp/7160344905bcf13ddfc16b0ad62bc964-se_medium_500_250.webp",
  }),
  mainEntity: z.object({
    "@type": z.string().nullish(), // "Apartment",
    address: z
      .object({
        "@type": z.string().nullish(), // "PostalAddress",
        addressRegion: z.string().nullish(), // "NY",
        addressLocality: z.string().nullish(), // "Manhattan",
        streetAddress: z.string(), // "78 West 3rd Street",
        postalCode: z.string().nullish(), // "10012",
        addressCountry: z.object({
          "@type": z.string().nullish(), // "Country",
          name: z.string().nullish(), // "USA",
        }),
      })
      .nullish(),
    amenityFeature: z.array(z.object({ name: z.string(), value: z.boolean() })),
    event: z.any(), // [],
  }),
});
export type GqlItemPage = z.infer<typeof GqlItemPage>;

export const parseGqlItemPage = (doc: Document): GqlItemPage => {
  const jsScriptTags = doc.querySelectorAll('head > script[type="application/ld+json"]');
  for (const scriptElem of jsScriptTags) {
    const textContent = scriptElem.textContent;
    const startTagMatchStr = "//<![CDATA[";
    const endTagMatchStr = "//]]>";
    if (
      textContent?.includes(startTagMatchStr) &&
      textContent.includes(endTagMatchStr) &&
      textContent.includes("ItemPage")
    ) {
      const gqlResObjEval = eval(
        textContent.replace(startTagMatchStr, "").replace(endTagMatchStr, "").trim()
      );
      const gqlResObj = z.array(GqlItemPage).parse(gqlResObjEval);

      return gqlResObj[0];
    }
  }

  throw new Error("parseDescription: none returned");
};
export type FullAddress = Omit<GqlItemPage["mainEntity"]["address"], "@type"> & {
  unit: string | null;
  name: string;
};
export const parseFullAddress = (doc: Document): FullAddress => {
  const itemPage = parseGqlItemPage(doc);
  const name = itemPage.about.name;
  const unit = itemPage.mainEntity.address?.streetAddress
    ? name.replace(itemPage.mainEntity.address?.streetAddress, "").trim()
    : null;

  return { ...itemPage.mainEntity.address, unit, name };
};
export const parseDescription = (doc: Document): string => {
  const itemPage = parseGqlItemPage(doc);
  return itemPage.about.description;
};
