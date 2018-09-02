const mongoose = require('mongoose');
const { DATABASE_URL } = require('./config');

exports.connect = () =>
    new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true
        });
        mongoose.connection
            .on('error', err => {
                console.error('Database connection error:', err);
                reject(err);
            })
            .once('open', () => {
                console.log('Connected to the database.');
                resolve();
            });
    });
