import mongoose from "mongoose";
import config from "./config";
import log from "../logger/loggerUtils";

const connectToDb = async () => {
  const dbUri = config.dbUri;
  try {
    const conn = await mongoose.connect(dbUri);
    log.info("Connected to DB");
    return conn;
  } catch (error) {
    console.error("Error connecting to DB", error);
    log.error("Error connecting to DB", error);
    process.exit(1);
  }
};

export default connectToDb;
