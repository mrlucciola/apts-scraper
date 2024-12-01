import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export const zDayjsInstance = z.instanceof(dayjs as unknown as typeof Dayjs);
export const zDayjs = z.preprocess((val) => {
  const toDayjs = dayjs(val as any);
  return toDayjs.isValid() ? toDayjs : null;
}, zDayjsInstance);

export const zNumeric = z.union([z.number(), z.string()]).pipe(z.coerce.number());
export type Numeric = `${number}` | number;

export const zUrl = z.string().url();
export type zUrl = z.infer<typeof zUrl>;
