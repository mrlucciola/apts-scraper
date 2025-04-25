import { z } from "zod";

/** External API Service Provider lookup/key: i.e. Streeteasy, Hotpads, Zillow */
export const ExtApiService = z.enum(["streeteasy", "hotpads", "zillow"]);
/** External API Service Provider lookup/key: i.e. Streeteasy, Hotpads, Zillow */
export type ExtApiService = z.infer<typeof ExtApiService>;
