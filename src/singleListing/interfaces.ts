import type { AxiosRes } from "../reqConfig/interfaces";
import type { SingleListingResBody } from "./response";

export type ISeReqBody = {
  query: string;
  variables: { id: number; width: number; height: number; quality: number };
};

export type SingleListingRes = AxiosRes<SingleListingResBody>;
