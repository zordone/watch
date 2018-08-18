/* eslint-disable no-console */

const express = require('express');
const api = require('./api');
const db = require('./database');

const PORT = 3001;

db.connect();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/items', api.listItems);
app.post('/items', api.newItem);
app.get('/items/:id', api.getItemById);
app.put('/items/:id', api.updateItemById);

// ...

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
