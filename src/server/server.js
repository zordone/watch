const express = require('express');
const shrinkRay = require('shrink-ray-current');
const api = require('./api');
const db = require('./database');
const backups = require('./backups');
const { PORT } = require('./config');

db.connect().then(backups.startPeriodicBackups);

// middleware
const app = express();
app.use(shrinkRay());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
    next();
});

// admin
app.get('/admin/import', api.adminImport);
app.get('/admin/backup', api.adminBackup);

// client
app.get('/items', api.listItems);
app.get('/activeitems', api.listActiveItems);
app.post('/items', api.newItem);
app.get('/items/:id', api.getItemById);
app.put('/items/:id', api.updateItemById);
app.delete('/items/:id', api.deleteItemById);
app.get('/searchimages/:query', api.searchImages);
app.get('/imdbdata/:imdbId', api.imdbData);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
