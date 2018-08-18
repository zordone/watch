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

// RemoveAllItems - just for development
// eslint-disable-next-line no-unused-vars
const removeAllItems = () => {
    Item.remove({})
        .then(() => {
            console.log('[RemoveAllItems] All items removed.');
        })
        .catch(err => {
            console.error('[RemoveAllItems]', err);
        });
};

// Express API

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ListItems
app.get('/items', (req, res) => {
    // removeAllItems(); // TODO :remove
    Item.find()
        .then(items => {
            console.log('[ListItems] Found:', items.length);
            res.send(items);
        })
        .catch(err => {
            console.error('[ListItems]', err);
            res.sendStatus(500);
        });
});

// NewItem
app.post('/items', (req, res) => {
    const body = (req && req.body) || {};
    const model = new Item({
        title: body.title,
        type: body.type,
        created: new Date()
    });
    model.save((err, saved) => {
        if (err) {
            console.error('[NewItem] Item is not saved.', err);
            res.sendStatus(400);
        } else {
            console.log('[NewItem] Item is saved. ID:', saved.id);
            res.setHeader('Location', `/items/${saved.id}`);
            res.sendStatus(200);
        }
    });
});

// GetItemById
app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    Item.findById(id)
        .then(item => {
            if (!item) {
                console.log('[GetItemById] Not found.');
                res.sendStatus(404);
                return;
            }
            console.log('[GetItemById] Found.');
            res.send(item);
        })
        .catch(err => {
            console.error('[GetItemById]', err);
            res.sendStatus(500);
        });
});

// UpdateItemById
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const body = (req && req.body) || {};
    // TODO: remove "readonly" fields, like _id, created, etc...
    Item.findById(id)
        .then(item => {
            if (!item) {
                console.log('[UpdateItemById] Not found.');
                res.sendStatus(404);
                return;
            }
            console.log('[UpdateItemById] Found.');
            item.set(body);
            item.save((err, saved) => {
                if (err) {
                    console.error('[UpdateItemById] Item is not updated.', err);
                    res.sendStatus(400);
                } else {
                    console.log('[UpdateItemById] Item is updated.');
                    res.send(saved);
                }
            });
        })
        .catch(err => {
            console.error('[UpdateItemById]', err);
            res.sendStatus(500);
        });
});

// ...

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
