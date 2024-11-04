import connectToDb from "../general/dbUtils/connectToDb";

/** Polling */
export const main = async () => {
  await connectToDb();

  // Get listings from db
  // Check last update time
  // Check that listing has `rental` prop set
};
