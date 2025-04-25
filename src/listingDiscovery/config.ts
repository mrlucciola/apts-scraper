import { ExtApiService } from "../general/enums";
import { ServiceConfigMl } from "./interfaces";
import { logRequestMultiListingStreeteasy } from "./streeteasy/db";
import {
  extractListingsFromBodyStreeteasy,
  validateAndTransformToDbModelStreeteasy,
} from "./streeteasy/parse";
import { fetchMultilisting } from "./streeteasy/req";
import type { GqlResJson } from "./streeteasy/res";

export const extApiConfig = {
  streeteasy: ServiceConfigMl.new({
    serviceName: ExtApiService.enum.streeteasy,
    fetch: fetchMultilisting,
    logRequest: logRequestMultiListingStreeteasy,
    // extractBodyFromRes: async (res) => await res.json()
    // extractBodyFromRes: (async (res) => await res.json()) as ExtractBodyFromResFxn<
    //   Response,
    //   GqlResJson
    // >,
    extractBodyFromRes: async (res: Response) => {
      // return (await res.json()) as Promise<GqlResJson>;
      return (await res.json()) as GqlResJson;
    },
    //
    extractListingsFromBody: extractListingsFromBodyStreeteasy,
    validateAndTransformToDbModel: validateAndTransformToDbModelStreeteasy,
    // insertToDb,
    // handleRequestError,
    // @todo figure this out - filterListingsBy,
  }),
};
