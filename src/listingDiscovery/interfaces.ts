import { z } from "zod";
import type { AxiosResponse } from "axios";
import type { ExtApiService } from "../general/enums";

/** @deprecated - this is for pre-v6 streeteasy */
export const MultiListingReqBody = z.object({
  operationName: z.enum(["searchOrganicRentals"]),
  variables: z.object({
    /** "status:open|price:500-10000|area:1004000|beds:1-2|baths>=1" */
    query: z.string(),
  }),
  /** "query searchOrganicRentals($query: String) {\n  search_organic_rentals(input: {limit: 500, query: $query}) {\n    listing_id\n    listing_type\n    longitude\n    latitude\n    listed_price\n    __typename\n  }\n}\n" */
  query: z.string(),
});
/** @deprecated - this is for pre-v6 streeteasy */
export type MultiListingReqBody = z.infer<typeof MultiListingReqBody>;

export type ResType = Response | AxiosResponse;

export type FetchReturnBody<TRes extends ResType = Response> = Promise<{
  response: TRes;
  reqConfig: RequestInit;
}>;

export type LogRequestFxn<TRes extends ResType, TBody> = (
  res: TRes,
  reqConfig: RequestInit,
  bodyRes?: TBody | null | undefined
) => Promise<void>;

export class ServiceConfigMl<
  TBody,
  TListingRes,
  TListingDb,
  // TFilterValue,
  TReqFxn extends (..._: any) => FetchReturnBody<TRes>,
  TSrv extends ExtApiService,
  TRes extends ResType
> {
  constructor(
    public serviceName: TSrv,
    public fetch: TReqFxn,
    public logRequest: LogRequestFxn<TRes, TBody>,
    public extractBodyFromRes: (res: TRes) => TBody,
    public extractListingsFromBody: (body: TBody) => TListingRes[],
    public validateAndTransformToDbModel: (listings: TListingRes[]) => TListingDb[],
    // @todo figure this out - public filterListingsBy: (listing: TListingDb) => TFilterValue,
    public insertToDb: (listings: TListingDb[]) => void,
    public handleRequestError?: (...params: any) => Promise<void>
  ) {}

  /**
   *
   * @todo add parameters to customize fetch query
   *  - query: ReqBodyGql["query"] = defaultQuery,
   *  - queryVariables: Partial<ReqBodyGqlVariablesInput> = defaultQueryInputVariables
   */
  async fetchAndInsert(...reqParams: Parameters<TReqFxn>) {
    const { reqConfig, response } = await this.fetch(...reqParams);

    const body = await this.extractBodyFromRes(response);

    await this.logRequest(response, reqConfig, body);

    await (this.handleRequestError && this.handleRequestError(response));

    const listingsRes = this.extractListingsFromBody(body);

    const listingsDb = this.validateAndTransformToDbModel(listingsRes);

    // @todo figure this out
    // const filteredListings = this.filterListingsBy(listingsDb);

    return await this.insertToDb(listingsDb);
  }

  /** ### Create a new instance of ServiceConfigMl */
  static new<
    TBody,
    TListingRes,
    TListingDb,
    // TFilterValue,
    TReqFxn extends (..._: any) => Promise<TRes>,
    TSrv extends ExtApiService,
    TRes
  >(
    params: ServiceConfigMl<TBody, TListingRes, TListingDb, TReqFxn, TSrv, TRes>
  ): ServiceConfigMl<TBody, TListingRes, TListingDb, TReqFxn, TSrv, TRes> {
    return new ServiceConfigMl<TBody, TListingRes, TListingDb, TReqFxn, TSrv, TRes>(
      //   params: ServiceConfigMl<TBody, TListingRes, TListingDb, TFilterValue, TSrv>
      // ): ServiceConfigMl<TBody, TListingRes, TListingDb, TFilterValue, TSrv> {
      //   return new ServiceConfigMl<TBody, TListingRes, TListingDb, TFilterValue, TSrv>(
      params.serviceName,
      params.fetch,
      params.logRequest,
      params.extractBodyFromRes,
      params.extractListingsFromBody,
      params.validateAndTransformToDbModel,
      // @todo figure this out - params.filterListingsBy,
      params.insertToDb,
      params.handleRequestError
    );
  }
}
