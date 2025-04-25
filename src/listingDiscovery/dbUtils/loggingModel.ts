import { prop, modelOptions, Severity, getModelForClass } from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose/lib/types";
// local
import type { GqlResJson } from "../streeteasy/res";
import type { ExtApiService } from "../../general/enums";

@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class RequestLogMultiListing {
  @prop({ required: true })
  headers: Response["headers"];
  ok: Response["ok"];
  redirected: Response["redirected"];
  @prop({ required: true })
  status: Response["status"];
  statusText: Response["statusText"];
  type: Response["type"];
  url: Response["url"];
  bodyUsed: Response["bodyUsed"];

  @prop({ required: false })
  body: GqlResJson | null | undefined;
  @prop({ required: true })
  serviceName: ExtApiService;
  @prop({ required: true })
  req: RequestInit;
}
const RequestLogMultiListingModel = getModelForClass(RequestLogMultiListing, {
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { timestamps: true },
});
export default RequestLogMultiListingModel;
export type RequestLogMultiListingModel = typeof RequestLogMultiListingModel;

export type RequestLogMultiListingDoc = DocumentType<RequestLogMultiListing>;

export type RequestLogMultiListingKey = keyof RequestLogMultiListing;
