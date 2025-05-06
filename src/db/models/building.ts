import { z } from "zod";

export const BuildingStatus = z.enum(["COMPLETED"]);
export type BuildingStatus = z.infer<typeof BuildingStatus>;
