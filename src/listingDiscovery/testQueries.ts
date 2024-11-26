import { findAllListings } from "./dbUtils/crud";

export const fetchItems = async () => {
  const allListings = await findAllListings();
  allListings
    .filter((l) => l.listed_price <= 3500)
    .map((l) => ({ ...l, url: `https://${l.listing_id}` }))
    .forEach((l) => console.log(l));
};
