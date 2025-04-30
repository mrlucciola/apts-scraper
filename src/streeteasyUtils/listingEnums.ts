import { z } from "zod";
import { ExtApiService } from "../general/enums";

export const BuildingType = z.enum(["HOUSE", "CONDO", "UNKNOWN", "MULTIFAMILY", "RENTAL"]);
export type BuildingType = z.infer<typeof BuildingType>;

export const SourceKey = z.enum(["override", ...ExtApiService.options]);
export type SourceKey = z.infer<typeof SourceKey>;
