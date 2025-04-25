import { ExtApiService } from "../general/enums";
import { ServiceConfigMl } from "./interfaces";
import { fetchMultilisting } from "./streeteasy/req";

export const extApiConfig: { [key in ExtApiService]: {} } = {
  streeteasy: ServiceConfigMl.new({
    serviceName: ExtApiService.enum.streeteasy,
    fetch: fetchMultilisting,
    logRequest,
    // extractBodyFromRes,
    // extractListingsFromBody,
    // validateAndTransformToDbModel,
    // insertToDb,
    // handleRequestError,
    // @todo figure this out - filterListingsBy,
  }),
};
