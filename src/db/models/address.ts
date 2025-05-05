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

export const AddressFull = z.object({
  city: z.string(), // "NEW YORK" | "NY"
  houseNumber: z.string(), // "145"
  state: z.string(), // "NY"
  street: z.string(), // "145 4th Avenue" | "78 West 3rd Street"
  streetName: z.string(), // "4 AVENUE"
  unit: z.string(), // "16A" | "2a"
  zipCode: z.string(), // "10003" | "10012"
});
export type AddressFull = z.infer<typeof AddressFull>;

export const AddressDb = AddressFull.partial().extend({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  region: z.string().nullish(), // "Manhattan",
});
export type AddressDb = z.infer<typeof AddressDb>;

export const LatLon = AddressDb.pick({ longitude: true, latitude: true });
