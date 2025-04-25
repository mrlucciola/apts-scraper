import type { Listing } from "../../db/models/listing";
import ListingModel from "../../db/models/listing";
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
import {
  newReqBodyMlStreeteasy,
  type ReqBodyGql,
  type ReqBodyGqlVariablesInput,
} from "./gqlConfig";
import {
  apiEndpoint,
  defaultQuery,
  defaultQueryInputVariables,
  reqConfigDefault,
} from "./reqConfig";
import type { GqlResJson } from "./res";

type TBody = GqlResJson;
type TListingRes = GqlResJson["data"]["searchRentals"]["edges"][number];
type TListingDb = Omit<Partial<Listing>, "rental"> & Partial<{ rental: RentalDb }>;
type TReqFxn = (
  query?: ReqBodyGql["query"],
  queryVariables?: Partial<ReqBodyGqlVariablesInput>
) => FetchReturnBody<TRes>;
type TRes = Response;
// TFilterValue,

type RentalDb = Omit<Partial<Listing["rental"]>, "building" | "address"> & {
  building: Partial<Listing["rental"]["building"]>;
  address: Partial<Listing["rental"]["address"]>;
};

/** @todo
 * @deprecated add customizable gql query-interface
 */
const fetchStreeteasy: TReqFxn = async (
  query: ReqBodyGql["query"] = defaultQuery,
  queryVariables: Partial<ReqBodyGqlVariablesInput> = defaultQueryInputVariables
): FetchReturnBody => {
  // 1. Config & send request
  const reqConfig: RequestInit = {
    ...reqConfigDefault,
    body: newReqBodyMlStreeteasy({
      query,
      /** @todo Remove type bypass */
      variables: { input: queryVariables as ReqBodyGqlVariablesInput },
    }),
  };

  const response = await fetch(apiEndpoint, reqConfig);

  return { reqConfig, response };
};

const extractBodyFromRes: ExtractBodyFromResFxn<TRes, TBody> = async (res) => await res.json();

const logRequest: LogRequestFxn<Response, GqlResJson> = async (res, reqConfig, bodyRes) => {
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

const extractListingsFromBody: ExtractListingsFromBodyFxn<TBody, TListingRes> = (body) =>
  body.data.searchRentals.edges;

/**
 * @deprecated Needs to be updated to new DB model for `Listing`
 * @todo Update for new model
 * @todo Add validation
 */
const validateAndTransformToDbModel: ValidateAndTransformToDbModel<TListingRes, TListingDb> = (
  listings
) =>
  listings.map(({ node: l }) => ({
    listing_id: l.id,
    latitude: l.geoPoint.latitude,
    longitude: l.geoPoint.longitude,
    listed_price: l.price,
    rental: {
      id: l.id,
      listingPrice: l.price,
      building: { url: l.urlPath },
      address: { unit: l.unit },
      source: l.urlPath,
      listingBaths: `${l.fullBathroomCount + Math.round((l.halfBathroomCount * 10) / 2) / 10}`,
      listingBeds: `${l.bedroomCount}`,
      listingAddress: `${l.street} ${l.unit}`,
    },
  }));

const insertToDb: InsertToDbFxn<TListingDb> = async (listings) => {
  const listingIds = [...new Set(listings.map((l) => l.listing_id))];

  // Find all documents that match any of these IDs
  const existingListings = await ListingModel.find(
    { listing_id: { $in: listingIds } },
    // Only get the listing_id field
    { listing_id: 1, _id: 0 }
  );

  // Create a set of existing IDs for faster lookup
  const existingIdsSet = new Set(existingListings.map((l) => l.listing_id));

  // Filter the API IDs to find those that don't exist in the database
  const missingIds = listingIds.filter((id) => !existingIdsSet.has(id!));

  const filteredNewListings = listings.filter((l) => missingIds.includes(l.listing_id));

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
  validateAndTransformToDbModel: validateAndTransformToDbModel,
  insertToDb,
});
