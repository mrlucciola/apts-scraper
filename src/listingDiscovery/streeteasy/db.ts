import { ExtApiService } from "../../general/enums";
import type { LogRequestFxn } from "../interfaces";
import type { GqlResJson } from "./res";
import RequestLogMultiListingModel, { type RequestLogMultiListing } from "../dbUtils/loggingModel";
import log from "../../logger/loggerUtils";

export const logRequestMultiListingStreeteasy: LogRequestFxn<Response, GqlResJson> = async (
  res,
  reqConfig,
  bodyRes
) => {
  // Filter out unnecessary properties
  const { arrayBuffer, blob, body, clone, formData, json, text, ...resFiltered } = res;
  const logInsert: RequestLogMultiListing = {
    ...resFiltered,
    body: bodyRes,
    serviceName: ExtApiService.enum.streeteasy,
    req: reqConfig,
  };

  try {
    const newLogDoc = await RequestLogMultiListingModel.create(logInsert);

    log.info(`Created request log for 'multi-listing': ${newLogDoc.id}`);
    return newLogDoc;
  } catch (e) {
    log.error(e);
    console.log("Error creating listing:", e);
    throw e;
  }
};
