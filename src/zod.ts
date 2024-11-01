import { z } from "zod";

export const zNumeric = z
  .union([z.number(), z.string()])
  .pipe(z.coerce.number())
  .nullish()
  .catch(null);

export const zUrl = z.string().url();
export type zUrl = z.infer<typeof zUrl>;
