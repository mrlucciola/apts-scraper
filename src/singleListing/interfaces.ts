import type { DocumentType } from "@typegoose/typegoose/lib/types";
import type { Listing } from "../db/models/listing";

export type FetchParseUpdateListingFxn = (listing: DocumentType<Listing>) => Promise<void>;

/**
 * @todo Support HTML response body/text
 * @todo Support JSON response body
 * @todo Support Response | AxiosResponse
 */
export type SingleListingRes<TResBody extends any = any> = Response;

export type IFetchSingleListing<TResBody = any, TModel = any> = (
  listingIdOrUrl: DocumentType<TModel>
) => Promise<SingleListingRes<TResBody>>;

export type IHandleUnsuccessfulRes<TResBody = any> = (
  res: SingleListingRes<TResBody>
) => Promise<any>;

/** Parse and validate single-listing response body */
export type IParseSingleListing<TResBody = any, TParsed = any> = (
  listingResBody: SingleListingRes<TResBody>
) => Promise<TParsed>;

/** Transform validated single-listing response body to database model */
export type ITransformSingleListing<TParsed = any, TModel = any> = (
  resParsed: TParsed
) => Partial<TModel>;

/** Update 'listing' document in DB */
export type IUpdateSingleListing<
  TModel extends any,
  TDoc = DocumentType<TModel>,
  TOut = Promise<TDoc | void>
> = (doc: TDoc, updatedFields: Partial<TModel>) => TOut;

export class UpdateDocFromSingleListing<TModel = any, TResBody = any, TParsed = any> {
  constructor(
    public fetch: IFetchSingleListing<TResBody, TModel>,
    public handleUnsuccessfulRes: IHandleUnsuccessfulRes<TResBody> | undefined,
    public parse: IParseSingleListing<TResBody, TParsed>,
    public transform: ITransformSingleListing<TParsed, TModel>,
    public update: IUpdateSingleListing<TModel>
  ) {}

  async fetchAndUpdate(listingDoc: DocumentType<TModel>) {
    const res = await this.fetch(listingDoc);

    await (this.handleUnsuccessfulRes && this.handleUnsuccessfulRes(res));

    const parsedResBody = await this.parse(res);

    const dbPayload = this.transform(parsedResBody);

    return await this.update(listingDoc, dbPayload);
  }
}
