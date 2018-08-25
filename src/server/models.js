const mongoose = require('mongoose');
const data = require('../common/data.json');
const { ItemType, NextType, ValiType, FinishedType } = require('../common/enums');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(ItemType) },
    genres: [{ type: String, enum: data.genres }],
    finished: { type: String, enum: Object.values(FinishedType) },
    lastWatched: { type: Number },
    inProgress: { type: Number },
    nextDate: { type: Date },
    nextType: { type: String, enum: Object.values(NextType) },
    withVali: { type: String, enum: Object.values(ValiType) },
    notes: { type: String },
    imdbId: { type: String },
    posterUrl: { type: String },
    created: { type: Date, required: true },
    updated: { type: Date, required: true }
});

const Item = mongoose.model('Item', itemSchema);
Item.dontUpdateFields = ['_id', '__v', 'created', 'updated'];

exports.Item = Item;
