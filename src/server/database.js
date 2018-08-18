/* global console */
/* eslint-disable no-console */

const mongoose = require('mongoose');

exports.connect = () => {
    mongoose.connect('mongodb://localhost:27017/watch', {
        useNewUrlParser: true
    });
    mongoose.connection
        .on('error', error => {
            console.error('Database connection error:', error);
        })
        .once('open', () => {
            console.log('Connected to the database.');
        });
};
