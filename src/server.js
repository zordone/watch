/* global console */

// console is ok in this one file for now.
/* eslint-disable no-console */

const PORT = 3001;

const express = require('express');
const mongoose = require('mongoose');

// Database connection

mongoose.connect('mongodb://localhost:27017/watch', {
    useNewUrlParser: true
});

const conn = mongoose.connection;

conn.on('error', error => console.error('Database connection error:', error))
    .once('open', () => {
        console.log('Connected to the database.');
    });

// Models

const ItemType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show'
});

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(ItemType) },
    created: { type: Date, required: true }
    // TODO: add updated-date, ...
});

const Item = mongoose.model('Item', itemSchema);

// just for development
// eslint-disable-next-line no-unused-vars
const removeAllItems = () => {
    Item.remove({})
        .then(() => {
            console.log('Removed all items.');
        })
        .catch(err => {
            console.error('Remove all items:', err);
        });
};

// Express API

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/items', (req, res) => {
    // removeAllItems(); // TODO :remove
    Item.find()
        .then(items => {
            console.log('ITEMS', items);
            res.send(items);
        })
        .catch(err => {
            console.error('Items list error:', err);
            res.sendStatus(500);
        });
});

app.post('/items', (req, res) => {
    const body = (req && req.body) || {};
    const model = new Item({
        title: body.title,
        type: body.type,
        created: new Date()
    });
    model.save((err, saved) => {
        if (err) {
            res.sendStatus(400);
            console.error('Item is not saved:', err);
        } else {
            res.setHeader('Location', `/items/${saved.id}`);
            res.sendStatus(200);
            console.log('Item is saved. ID:', saved.id);
        }
    });
});

// ...

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
