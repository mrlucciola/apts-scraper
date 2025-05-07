import { z } from "zod";
import { ListingIdField } from "../../../../../general/commonValidation";
import { ContactBoxInitialDataSchema } from "./ContactBoxInitialDataSchema";
import { BuildingSchema } from "./BuildingSchema";
import { HeaderDataSchema } from "./HeaderDataSchema";
import { ListingSchema } from "./ListingSchema";

const UnimportantFields = z.object({
  children: z.array(z.any()).nullish(), // @deprecated
  breadcrumbs: z.array(z.any()).nullish(), // @todo INCOMPLETE ARRAY
  deeplinkBannerProps: z.string().nullish(), // "$34",
  fingerprint: z.string().nullish(), // "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
  isClickStreamEnabled: z.boolean().nullish(),
  isHidden: z.boolean().nullish(), // false,
  isMobile: z.boolean().nullish(), // false,
  isSaved: z.boolean().nullish(), // false,
  oneTrustDomainID: z.string().nullish(), // "59a0e49e-51ff-45ca-a44f-e17efedb931e-test",
  skipAds: z.boolean().nullish(), // false,
  userSignedIn: z.boolean().nullish(), // false,
  agentFolders: z.array(z.any()).nullish(), // [], // @todo INCOMPLETE ARRAY
  //
  viewer: z.object({}).passthrough(), // @todo INCOMPLETE OBJECT
  //
  nearMeListingType: z.string(), // "rental", @todo INCOMPLETE ENUM
});

const ExperimentsSchema = z.object({
  streeteasy_sale_hdp_open_house_connect: z
    .object({
      assignment_service_cd: z.string().nullish(), //  "split",
      key_type_cd: z.string().nullish(), //  "guid",
      randomization_key: z.string().nullish(), //  "f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
      treatment_nm: z.string().nullish(), //  "off",
    })
    .nullish(),
});

/** Top-level JSON Schema */
export const HtmlPayloadSchema_SeSl = z.object({
  building: BuildingSchema,
  headerData: HeaderDataSchema,
  listing: ListingSchema,
  contactBoxInitialData: ContactBoxInitialDataSchema,
  experiments: ExperimentsSchema.nullish(),
  agentsIds: z.array(ListingIdField).nullish(), // ["362385"],
  enableLinkShareTracking: z.boolean().nullish(),
  note: z.string().nullish(), // ""
  referer: z.any(), // null
  agentsInfo: z.any(), // null
  listingType: z.enum(["rental"]).optional(), // @todo INCOMPLETE ENUM
  //
});
export type HtmlPayloadSchema_SeSl = z.infer<typeof HtmlPayloadSchema_SeSl>;
