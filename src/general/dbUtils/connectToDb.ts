import mongoose from "mongoose";
import config from "../../dbUtils/config";
import log from "../../logger/loggerUtils";

async function connectToDb() {
  const dbUri = config.dbUri;
  try {
    await mongoose.connect(dbUri);
    log.info("Connected to DB");
  } catch (error) {
    process.exit(1);
  }
}

export default connectToDb;
