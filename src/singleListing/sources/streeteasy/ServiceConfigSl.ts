import type { DocumentType } from "@typegoose/typegoose/lib/types";
//
import type { ExtApiService } from "../../../general/enums";
import type { ResType } from "../../../listingDiscovery/interfaces";
import type { Listing } from "../../../db/models/listing";
import type { ListingIdField } from "../../../general/commonValidation";

export type FetchFxn<TRes extends ResType = Response> = (
  listingId: ListingIdField, // ListingIdField | DocumentType<Listing>,
  ..._: any
) => Promise<TRes>;

export type ExtractBodyFromResFxn<TRes extends ResType, TBody> = (res: TRes) => Promise<TBody>;

export type ExtractListingFromBodyFxn<TBody, TListingRes> = (body: TBody) => TListingRes;

export class ServiceConfigSl<
  TListingRes,
  TBody,
  TRes extends ResType,
  TFetchFxn extends FetchFxn<TRes>,
  TSrv extends ExtApiService
> {
  readonly serviceName: TSrv;
  readonly reqConfig: RequestInit;
  // Functions
  readonly fetchListing: TFetchFxn;
  readonly extractBodyFromRes: ExtractBodyFromResFxn<TRes, TBody>;
  readonly extractListingFromBody: ExtractListingFromBodyFxn<TBody, TListingRes>;

  constructor(
    newConfig: Omit<ServiceConfigSl<TListingRes, TBody, TRes, TFetchFxn, TSrv>, "fetchAndInsert">
  ) {
    this.serviceName = newConfig.serviceName;
    this.reqConfig = newConfig.reqConfig;
    // Functions
    this.fetchListing = newConfig.fetchListing;
    this.extractBodyFromRes = newConfig.extractBodyFromRes;
    this.extractListingFromBody = newConfig.extractListingFromBody;
  }

  /** */
  async fetchAndInsert(...reqParams: Parameters<TFetchFxn>) {
    const [listingId, ...otherReqParams] = reqParams;
    const res = await this.fetchListing(listingId, ...otherReqParams);

    const body = await this.extractBodyFromRes(res);

    // // @note This may be used in the near future
    // const logDoc = await this.logRequest(response, reqConfig, body);

    // await (this.handleRequestError && this.handleRequestError(response));

    const listingRes = this.extractListingFromBody(body);

    // const listingsDb = this.validateAndTransformToDbModel(listingsRes);

    // // @todo figure this out
    // // const filteredListings = this.filterListingsBy(listingsDb);

    // return await this.insertToDb(listingsDb);
  }
}
