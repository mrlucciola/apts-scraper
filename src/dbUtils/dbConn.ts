import type { Mongoose } from "mongoose";
import connectToDb from "../general/dbUtils/connectToDb";

class DbConn {
  conn: Mongoose | null = null;
  constructor() {
    connectToDb().then((conn) => (this.conn = conn));
  }
}
export type IDbConn = DbConn;

const dbConn = new DbConn();
export default dbConn;
