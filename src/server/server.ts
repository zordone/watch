import compression from "compression";
import express from "express";
import * as api from "./api";
import { startPeriodicBackups } from "./backups";
import { PORT } from "./config";
import { connectToDatabase } from "./database";

connectToDatabase().then(startPeriodicBackups).catch(console.error);

// middleware
const app = express();
app.use(compression());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
  next();
});

// admin
app.get("/admin/import", api.adminImport);

// client
app.get("/items", api.listItems);
app.post("/items", api.newItem);
app.get("/items/:id", api.getItemById);
app.put("/items/:id", api.updateItemById);
app.delete("/items/:id", api.deleteItemById);
app.get("/searchimages/:query", api.searchImages);
app.get("/imdbdata/:imdbId", api.imdbData);
app.get("/localip", api.localIp);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
