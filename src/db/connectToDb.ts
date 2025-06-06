import mongoose from "mongoose";
import config from "./config";
import log from "../logger/loggerUtils";

export const connectToListingsDb = async () => {
  try {
    const conn = await mongoose.connect(config.dbUri);
    log.info("Connected to 'Listings' DB");
    return conn;
  } catch (error) {
    console.error("Error connecting to 'Listings' DB", error);
    log.error("Error connecting to 'Listings' DB", error);
    process.exit(1);
  }
};

export const connectToRequestLogMultiListingDb = async () => {
  try {
    const conn = await mongoose.connect(config.requestLogMultiUri);
    log.info("Connected to 'Request Log: Multi-Listing' DB");
    return conn;
  } catch (error) {
    console.error("Error connecting to 'Request Log: Multi-Listing' DB", error);
    log.error("Error connecting to 'Request Log: Multi-Listing' DB", error);
    process.exit(1);
  }
};
