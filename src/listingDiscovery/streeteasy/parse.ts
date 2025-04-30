import ListingModel, { type Listing } from "../../db/models/listing";
import { ExtApiService } from "../../general/enums";
import log from "../../logger/loggerUtils";
import type { RequestLogMultiListing } from "../dbUtils/loggingModel";
import RequestLogMultiListingModel from "../dbUtils/loggingModel";
import {
  ServiceConfigMl,
  type ExtractBodyFromResFxn,
  type ExtractListingsFromBodyFxn,
  type FetchReturnBody,
  type InsertToDbFxn,
  type LogRequestFxn,
  type ValidateAndTransformToDbModel,
} from "../interfaces";
import { ReqBodyGqlVariablesInput, newReqBodyMlStreeteasy, type ReqBodyGql } from "./gqlConfig";
import { apiEndpoint, defaultQuery, reqConfigDefault } from "./reqConfig";
import { edgeNodeToListingAdapter, type GqlResJson } from "./res";

type TBody = GqlResJson;
type TListingRes = NonNullable<GqlResJson["data"]>["searchRentals"]["edges"][number];
type TReqFxn = (
  query?: ReqBodyGql["query"],
  queryVariables?: Partial<ReqBodyGqlVariablesInput>
) => FetchReturnBody<TRes>;
type TRes = Response;
type TListingDb = Listing;
// TFilterValue,

const defaultQueryInputVariables = ReqBodyGqlVariablesInput.parse({});
/** @todo
 * @deprecated add customizable gql query-interface
 */
const fetchStreeteasy: TReqFxn = async (
  query: ReqBodyGql["query"] = defaultQuery,
  queryVariables: Partial<ReqBodyGqlVariablesInput> = defaultQueryInputVariables
): FetchReturnBody => {
  // 1. Config & send request
  const input: ReqBodyGqlVariablesInput = { ...defaultQueryInputVariables, ...queryVariables };
  const reqConfig: RequestInit = {
    ...reqConfigDefault,
    body: newReqBodyMlStreeteasy({ query, variables: { input } }),
  };

  const response = await fetch(apiEndpoint, reqConfig);

  return { reqConfig, response };
};

const extractBodyFromRes: ExtractBodyFromResFxn<TRes, TBody> = async (res) => await res.json();

// LogRequestFxn<TRes extends ResType, TBody>
const logRequest: LogRequestFxn<TRes, TBody> = async (res, reqConfig, bodyRes) => {
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

const extractListingsFromBody: ExtractListingsFromBodyFxn<TBody, TListingRes> = (body) => {
  if (body.errors || !body.data) throw new Error(JSON.stringify(body.errors));

  return body.data.searchRentals.edges;
};

const validateAndTransformToDbModel: ValidateAndTransformToDbModel<TListingRes, TListingDb> = (
  listings
) =>
  listings.map(({ node: l }) => {
    const current: TListingDb["current"] = edgeNodeToListingAdapter(l);

    return { current, sources: { streeteasy: current } };
  });

const insertToDb: InsertToDbFxn<TListingDb> = async (listings) => {
  const listingIds = [...new Set(listings.map((l) => l.current.id))];

  // Find all documents that match any of these IDs
  const existingListings = await ListingModel.find(
    { "sources.streeteasy": { $in: listingIds } },
    // Only get the listing_id field
    { "sources.streeteasy": 1, _id: 0 }
  );

  // Create a set of existing IDs for faster lookup
  const existingIdsSet = new Set(existingListings.map((l) => l.current.id));

  // Filter the API IDs to find those that don't exist in the database
  const missingIds = listingIds.filter((id) => !existingIdsSet.has(id!));

  const filteredNewListings = listings.filter((l) => missingIds.includes(l.current.id));

  await ListingModel.insertMany(filteredNewListings);
};

export const streeteasyMultiListingConfig = ServiceConfigMl.new({
  serviceName: ExtApiService.enum.streeteasy,
  // req
  fetch: fetchStreeteasy,
  logRequest,
  // parse
  extractBodyFromRes,
  extractListingsFromBody,
  validateAndTransformToDbModel,
  insertToDb,
});
