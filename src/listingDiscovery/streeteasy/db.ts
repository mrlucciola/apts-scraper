import type { Dayjs } from "dayjs";
import { ExtApiService } from "../../general/enums";
import type { LogRequestFxn } from "../interfaces";
import type { GqlResJson } from "./res";

type RequestLogModel = Pick<
  Response,
  "headers" | "ok" | "redirected" | "status" | "statusText" | "type" | "url" | "bodyUsed"
> & {
  body: GqlResJson | null | undefined;
  // dtAdded
  //
  serviceName: ExtApiService;
  req: RequestInit;
  dtCreated: string | Dayjs;
};
type RequestLogInsertModel = Omit<RequestLogModel, "dtCreated">;

export const logRequestStreeteasy: LogRequestFxn<Response, GqlResJson> = async (
  res,
  reqConfig,
  bodyRes
) => {
  // Filter out unnecessary properties
  const { arrayBuffer, blob, body, clone, formData, json, text, ...resFiltered } = res;
  const logInsert: RequestLogInsertModel = {
    ...resFiltered,
    body: bodyRes,
    serviceName: ExtApiService.enum.streeteasy,
    req: reqConfig,
  };

  // LoggingModel.create({});
};
