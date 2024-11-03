import mongoose from "mongoose";
import config from "./config";

async function connectToDb() {
  const dbUri = config.dbUri;
  try {
    await mongoose.connect(dbUri);
  } catch (error) {
    process.exit(1);
  }
}

export default connectToDb;
