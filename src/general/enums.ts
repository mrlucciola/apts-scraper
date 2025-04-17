import { z } from "zod";

export const ExternalApiService = z.enum(["Streeteasy", "Hotpads", "Zillow"]);
export type ExternalApiService = z.infer<typeof ExternalApiService>;
