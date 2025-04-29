import { z } from "zod";

export const getFullAddress = ({
  zipCode,
  state,
  city,
  region,
  street,
  unit,
}: AddressDb): string => {
  return `${street} #${unit}, ${city}, ${state} ${zipCode}`;
};

export const AddressDb = z.object({
  state: z.string().nullish(), // "NY",
  city: z.string().nullish(), // "NY",
  region: z.string().nullish(), // "Manhattan",
  street: z.string(), // "78 West 3rd Street",
  buildingNumber: z.string().nullish(), // "78",
  unit: z.string().nullish(), // "2a",
  zipCode: z.string().optional(), // "10012",

  longitude: z.number(),
  latitude: z.number(),
});
export type AddressDb = z.infer<typeof AddressDb>;
