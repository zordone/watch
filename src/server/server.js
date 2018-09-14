const express = require('express');
const api = require('./api');
const db = require('./database');
const { PORT } = require('./config');

db.connect()
    // TODO: when the server will be running non-stop, this won't be enough.
    // we should do daily backups.
    .then(() => api.adminBackup({ isAutoBackup: true }));

// middleware
const app = express();
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
app.post('/items', api.newItem);
app.get('/items/:id', api.getItemById);
app.put('/items/:id', api.updateItemById);
app.delete('/items/:id', api.deleteItemById);
app.get('/searchimages/:query', api.searchImages);
app.get('/imdbdata/:imdbId', api.imdbData);

// ...

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
