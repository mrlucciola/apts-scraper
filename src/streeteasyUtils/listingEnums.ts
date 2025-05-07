import { z } from "zod";
import { ExtApiService } from "../general/enums";

export const BuildingTypeSeSl = z.enum(["Rental building"]);
export type BuildingTypeSeSl = z.infer<typeof BuildingTypeSeSl>;

export const BuildingTypeDb = z.enum(["HOUSE", "CONDO", "UNKNOWN", "MULTIFAMILY", "RENTAL"]);
export type BuildingTypeDb = z.infer<typeof BuildingTypeDb>;

export const BuildingType = z.preprocess((input) => {
  if (typeof input !== "string") return input;

  // Mappings
  if (input === BuildingTypeSeSl.enum["Rental building"]) return BuildingTypeDb.enum.RENTAL;

  return input;
}, BuildingTypeDb);
export type BuildingType = z.infer<typeof BuildingType>;

export const SourceKey = z.enum(["override", ...ExtApiService.options]);
export type SourceKey = z.infer<typeof SourceKey>;
