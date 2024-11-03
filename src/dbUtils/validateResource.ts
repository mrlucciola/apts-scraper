import type { AnyZodObject } from "zod";

const validateResource = (schema: AnyZodObject) => (data: any) => {
  const parsed = schema.safeParse(data);
  if (parsed.data) return parsed.data;
  return parsed.error;
};

export default validateResource;
