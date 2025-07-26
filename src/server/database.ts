import mongoose from "mongoose";
import { DATABASE_URL } from "./config";

// set strictQuery to false to prepare for Mongoose 7
mongoose.set("strictQuery", false);

export const connectToDatabase = (): Promise<void> =>
  new Promise((resolve, reject) => {
    mongoose
      .connect(DATABASE_URL, { family: 4 })
      .catch((err: unknown) => reject(new Error("Connect", { cause: err })));
    mongoose.connection
      .on("error", (err) => reject(new Error("Connection", { cause: err })))
      .once("open", () => {
        console.log("Connected to the database.");
        resolve();
      });
  });
