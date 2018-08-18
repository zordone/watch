const mongoose = require('mongoose');

const ItemType = Object.freeze({
    MOVIE: 'movie',
    SHOW: 'show'
});

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(ItemType) },
    created: { type: Date, required: true },
    updated: { type: Date, required: true }
    // TODO: more fields ...
});

exports.Item = mongoose.model('Item', itemSchema);
