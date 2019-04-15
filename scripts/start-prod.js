// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

const openBrowser = require('react-dev-utils/openBrowser');
const express = require('express');
const path = require('path');
const shrinkRay = require('shrink-ray-current');

// Ensure environment variables are read.
require('../config/env');

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost';

if (process.env.HOST) {
    console.log('Attempting to bind to HOST environment variable:', process.env.HOST);
    console.log('If this was unintentional, check that you haven\'t mistakenly set it in your shell.');
    console.log('Learn more here: http://bit.ly/2mwWSwH');
    console.log();
}

const port = process.env.PORT || DEFAULT_PORT;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const buildPath = path.resolve(__dirname, '../build');

const prodApp = express();
prodApp.use(shrinkRay());
prodApp.use(express.static(buildPath));

prodApp.get('*', (request, response) => {
    const url = request.url;
    const isFile = url.includes('.');
    const filePath = isFile
        ? path.resolve(buildPath, url.replace(/^\//, ''))
        : path.resolve(buildPath, 'index.html');
    response.sendFile(filePath);
});

const prodServer = prodApp.listen(port, err => {
    if (err) {
        return console.log(err);
    }
    console.log('Starting the production server...\n');
    openBrowser(`${protocol}://${HOST}:${port}`);
    console.log("Production server started on port " + port);
});

['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        prodServer.close();
        process.exit();
    });
});
