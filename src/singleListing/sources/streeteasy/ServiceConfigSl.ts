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

export class ServiceConfigSl<
  TSrv extends ExtApiService,
  TFetchFxn extends FetchFxn<TRes>,
  TRes extends ResType
> {
  readonly serviceName: TSrv;
  readonly fetchListing: TFetchFxn;
  readonly reqConfig: RequestInit;

  // States
  /** Response - defined after fetch is made */
  protected res: TRes | undefined;

  constructor(newConfig: Omit<ServiceConfigSl<TSrv, TFetchFxn, TRes>, "fetchAndInsert">) {
    this.serviceName = newConfig.serviceName;
    this.fetchListing = newConfig.fetchListing;
    this.reqConfig = newConfig.reqConfig;
  }

  /** */
  async fetchAndInsert(...reqParams: Parameters<TFetchFxn>) {
    const [listingId, ...otherReqParams] = reqParams;
    const res = await this.fetchListing(listingId, ...otherReqParams);

    // const body = await this.extractBodyFromRes(response);

    // // @note This may be used in the near future
    // const logDoc = await this.logRequest(response, reqConfig, body);

    // await (this.handleRequestError && this.handleRequestError(response));

    // const listingsRes = this.extractListingsFromBody(body);

    // const listingsDb = this.validateAndTransformToDbModel(listingsRes);

    // // @todo figure this out
    // // const filteredListings = this.filterListingsBy(listingsDb);

    // return await this.insertToDb(listingsDb);
  }
}
