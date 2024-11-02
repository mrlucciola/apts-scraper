import { z } from "zod";
import { zNumeric } from "./zod";
import { ZAvailability, ZBrandEnum, ZTypeEnum } from "./streeteasyValidation";

const ZAmenityFeatureKey = z.enum([
  "Dishwasher",
  "Washer / Dryer in Unit",
  "Private Outdoor Space",
  "Verizon FiOS Enabled",
  "Central Air",
  "Hardwood Floors",
  "Terrace",
]);
const ZAmenityFeature = z.object({
  name: ZAmenityFeatureKey.or(z.string()),
  value: z.boolean(),
});

const unknownSchema = z.object({
  "@context": z.string(), // "http://schema.org"
  "@type": ZTypeEnum,
  about: z.object({
    "@type": ZTypeEnum,
    name: z.string(), // "78 West 3rd Street #2A"
    offers: z.object({
      "@type": ZTypeEnum,
      price: zNumeric,
      priceCurrency: z.string(),
      availability: ZAvailability, // "inStock"
      url: z.string().url(), // "https://streeteasy.com/rental/3943463"
    }),
    brand: ZBrandEnum,
    description: z.string(),
    image: z.string(),
  }),
});

const ZMainEntity = z.object({
  "@type": z.string(),
  address: z.object({
    "@type": z.string(),
    addressRegion: z.string(),
    addressLocality: z.string(),
    streetAddress: z.string(),
    postalCode: z.string(),
    addressCountry: z.object({ "@type": z.string(), name: z.string() }),
  }),
});

const ReqDetailItem = z.object({
  amenityFeature: z.array(ZAmenityFeature),
  event: z.array(z.any()),
  mainEntity: ZMainEntity,
});
const ReqDetail = z.array(ReqDetailItem);
