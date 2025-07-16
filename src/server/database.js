const mongoose = require("mongoose");
const { DATABASE_URL } = require("./config");

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set("strictQuery", false);

exports.connect = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL);
    mongoose.connection
      .on("error", (err) => {
        console.error("Database connection error:", err);
        reject(err);
      })
      .once("open", () => {
        console.log("Connected to the database.");
        resolve();
      });
  });
