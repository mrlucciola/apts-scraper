import { z } from "zod";
import { zNumeric } from "../../utils/zod";

const URL_DOMAIN = "https://hotpads.com";

const Hp_UrlComponents = z
  .object({
    /** Static: `https://hotpads.com/` */
    domain: z.string().url(),

    /** Follows the `location` segment of the URL
     * @note From a defined set (enum) (i.e. `"hoboken-nj" | "manhattan"`)
     * Example: `hoboken-nj`
     * Original:
     * - `https://hotpads.com/hoboken-nj/apartments-for-rent?beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
     * Highlighted in brackets:
     * - `https://hotpads.com/{hoboken-nj}
     */
    location: z.string(),

    /** Follows the `location` segment of the URL
     * @note should be static (i.e. always `"apartments-for-rent"`)
     * Example: `apartments-for-rent`
     * Original:
     * - `https://hotpads.com/hoboken-nj/apartments-for-rent?beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
     * Highlighted in brackets:
     * - `https://hotpads.com/hoboken-nj/{apartments-for-rent}
     */
    searchType: z.string(),

    /** Everything after the question mark.
     * Example: `beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
     * Original: `https://hotpads.com/hoboken-nj/apartments-for-rent?beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
     * Highlighted in brackets: `https://hotpads.com/hoboken-nj/apartments-for-rent?{beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15}`
     */
    queryParams: z.string(),
  })
  .transform((val, _ctx) => {
    const path = `${val.location}/${val.searchType}`;
    const url = `${val.domain}/${path}`;
    const uri = `${url}?${val.queryParams}`;
    return { ...val, path, url, uri };
  });
export type Hp_UrlComponents = z.infer<typeof Hp_UrlComponents>;

/** Input must be a string */
export const Hp_UrlSchema = z.preprocess((input, ctx) => {
  const { data: parsedInput, error: inputError } = z
    .string()
    .url()
    .startsWith(URL_DOMAIN)
    .safeParse(input);
  if (!parsedInput) {
    inputError?.issues.forEach((i) => ctx.addIssue(i));
    return z.NEVER;
  }

  /** Parse string into individual parts:
   * Original: `https://hotpads.com/hoboken-nj/apartments-for-rent?beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
   *
   * ### 1. Basepath
   * - `https://hotpads.com`
   * ### 2. Location
   * - hoboken-nj
   * ### 3. Search-type
   * - apartments-for-rent
   * ### 4. Query parameters
   * - beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15
   */

  /** `hoboken-nj/apartments-for-rent?...query-params...` */
  const urlPath = parsedInput.split(URL_DOMAIN + "/")![1];

  /**
   * From: `hoboken-nj/apartments-for-rent?...query-params...`
   * To  : `hoboken-nj`
   */
  const [locationInput, searchTypeAndQueryParams] = urlPath.split("/", 2);
  // @todo Change to enum type: `['hoboken-nj', 'manhattan', ...]`
  const { data: location, error: locationError } = z.string().min(1).safeParse(locationInput);
  if (!location) {
    locationError?.issues.forEach((i) => ctx.addIssue(i));
    return z.NEVER;
  }
  /**
   * From: `apartments-for-rent?...query-params...`
   * To  : `apartments-for-rent`
   */
  const [searchTypeInput, queryParamsInput] = searchTypeAndQueryParams.split("?", 2);
  // @todo Change to enum type: `['hoboken-nj', 'manhattan', ...]`
  const { data: searchType, error: searchTypeError } = z.string().min(1).safeParse(searchTypeInput);
  if (!searchType) {
    searchTypeError?.issues.forEach((i) => ctx.addIssue(i));
    return z.NEVER;
  }

  /**
   * From: `apartments-for-rent?...query-params...`
   * To  : `...query-params...`
   */
  const { data: queryParams, error: queryParamsError } = z
    .string()
    .min(1)
    .safeParse(queryParamsInput);
  if (!queryParams) {
    queryParamsError?.issues.forEach((i) => ctx.addIssue(i));
    return z.NEVER;
  }

  return { domain: URL_DOMAIN, location, searchType, queryParams } as z.input<
    typeof Hp_UrlComponents
  >;
}, Hp_UrlComponents);

/** @todo (If any) Add all relevant query parameters
 * Original: `beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
 * - beds=1-8plus
 * - lat=40.7447
 * - lon=-74.0290
 * - page=2
 * - price=0-3350
 * - z=15
 */
const Hp_queryParams = z.object({
  /** Price range + modifier: format = `${min}-${max}${modifier}` */
  beds: z
    .string()
    .optional()
    .refine((val) => {
      if (val === null || val === undefined) return true;
      const [min, max] = val.split("-", 2);
      const isMinValid = zNumeric.safeParse(min).success;
      const isMaxValid = max.includes("plus") || zNumeric.safeParse(max).success;
      return isMinValid && isMaxValid;
    }),
  /** Latitude (numeric) */
  lat: zNumeric,
  /** Longitude (numeric) */
  lon: zNumeric,
  page: zNumeric,
  /** Price range: format = `${low}-${high}` */
  price: z
    .string()
    .optional()
    .refine((val) => {
      if (val === null || val === undefined) return true;
      const [min, max] = val.split("-", 2);
      const isMinValid = zNumeric.safeParse(min).success;
      const isMaxValid = max.includes("plus") || zNumeric.safeParse(max).success;
      return isMinValid && isMaxValid;
    }),
  z: zNumeric,
});
type Hp_queryParams = z.infer<typeof Hp_queryParams>;

const QueryParamKey = z.enum(["beds", "lat", "lon", "page", "price", "z"]);
type QueryParamKey = z.infer<typeof QueryParamKey>;

export const Hp_queryParamsSchema = z.preprocess((input, ctx) => {
  if (typeof input === "string" && (input.includes("https://") || input.includes("?"))) {
    ctx.addIssue({
      code: "custom",
      message: `Input must ONLY include the querystring. Input = '${input}'`,
    });
    return z.NEVER;
  }
  // Input = `beds=1-8plus&lat=40.7447&lon=-74.0290&page=2&price=0-3350&z=15`
  const { data: parsedInput, error: inputError } = z.string().safeParse(input);
  if (!parsedInput) {
    inputError?.issues.forEach((i) => ctx.addIssue(i));
    return z.NEVER;
  }
  // @note Returns: ["beds=1-8plus", "lat=40.7447", "lon=-74.0290", "page=2", "price=0-3350", "z=15"]
  const queryParamsSplit = parsedInput.split("&");
  const queryParamsMap: Map<QueryParamKey, string> = new Map(
    queryParamsSplit.map((qp) => qp.split("=") as [QueryParamKey, string])
  );

  const toParse: { [k in QueryParamKey]?: string } = {};
  queryParamsMap.forEach((val, key) => {
    toParse[key] = val;
  });

  return toParse;
}, Hp_queryParams);
