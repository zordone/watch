const compression = require("compression");
const express = require("express");
const api = require("./api");
const backups = require("./backups");
const { PORT } = require("./config");
const db = require("./database");

db.connect().then(backups.startPeriodicBackups).catch(console.error);

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
app.get("/admin/backup", api.adminBackup);

// client
app.get("/items", api.listItems);
app.get("/activeitems", api.listActiveItems);
app.post("/items", api.newItem);
app.get("/items/:id", api.getItemById);
app.put("/items/:id", api.updateItemById);
app.delete("/items/:id", api.deleteItemById);
app.get("/searchimages/:query", api.searchImages);
app.get("/imdbdata/:imdbId", api.imdbData);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
