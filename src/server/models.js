const mongoose = require('mongoose');
const data = require('../common/data.json');

const ItemType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show'
});

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(ItemType) },
    genres: [{ type: String, enum: data.genres }],
    finished: { type: Date },
    lastWatched: { type: Number },
    inProgress: { type: Number },
    created: { type: Date, required: true },
    updated: { type: Date, required: true }
    // TODO: more fields ...
});

const Item = mongoose.model('Item', itemSchema);
Item.dontUpdateFields = ['_id', '__v', 'created', 'updated'];

exports.Item = Item;
