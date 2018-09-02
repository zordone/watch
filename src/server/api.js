const _ = require('lodash');
const Scraper = require('images-scraper');
const moment = require('moment');
const fs = require('fs');
const { Item } = require('./models');
const { importCsv } = require('./importCsv');
const { IMPORT_DIR, BACKUP_DIR } = require('./config');

const between = (value, min, max) => (min <= value && value <= max);

const removeAllItems = () =>
    Item.remove({})
        .then(() => {
            console.log('[RemoveAllItems] All items removed.');
        })
        .catch(err => {
            console.error('[RemoveAllItems]', err);
        });

exports.adminImport = (req, res) => {
    removeAllItems()
        .then(() => {
            console.log('[AdminImport] Database cleared.');
            const filename = `${IMPORT_DIR}/import.csv`;
            let done = 0;
            let errors = 0;
            importCsv(filename)
                .then(models => (
                    Promise.all(models.map(model => (
                        model.save()
                            .then(() => {
                                done += 1;
                            })
                            .catch(err => {
                                console.log('[AdminImport] Item to save', model);
                                console.error('[AdminImport] Item is not saved.', err);
                                errors += 1;
                            })
                    )))
                ))
                .then(() => {
                    console.log('[AdminImport] Import finished. Done:', done, 'Errors:', errors);
                    res.sendStatus(200);
                });
        })
        .catch(err => {
            console.error('[AdminImport]', err);
            res.sendStatus(500);
        });
};

exports.adminBackup = (req, res) => {
    const { isAutoBackup } = req;
    const today = moment().format('YYYY-MM-DD');
    const filename = `${BACKUP_DIR}/${today}.json`;
    if (isAutoBackup && fs.existsSync(filename)) {
        console.log('[AdminBackup] Already backed up today.');
        return;
    }
    console.log('[AdminBackup] Backing up...');
    Item.find()
        .then(items => {
            if (isAutoBackup) {
                fs.writeFile(filename, JSON.stringify(items, null, 4), err => {
                    if (err) {
                        throw err;
                    }
                    console.log(`[AdminBackup] Backed up to ${filename}`);
                });
            } else {
                console.log('[AdminBackup] Backup sent to the client.');
                res.send(items);
            }
        })
        .catch(err => {
            console.error('[AdminBackup]', err);
            res.sendStatus(500);
        });
};

exports.listItems = (req, res) => {
    Item.find()
        .then(items => {
            console.log('[ListItems] Found:', items.length);
            res.send(items);
        })
        .catch(err => {
            console.error('[ListItems]', err);
            res.sendStatus(500);
        });
};

exports.newItem = (req, res) => {
    const body = _.omit((req && req.body) || {}, Item.dontUpdateFields);
    const now = new Date();
    const model = new Item({
        ...body,
        created: now,
        updated: now
    });
    model.save((err, saved) => {
        if (err) {
            console.error('[NewItem] Item is not saved.', err);
            res.status(400).send(err.message);
        } else {
            console.log('[NewItem] Item is saved. ID:', saved.id);
            res.setHeader('Location', `/items/${saved.id}`);
            res.send(saved);
        }
    });
};

exports.getItemById = (req, res) => {
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
};

exports.updateItemById = (req, res) => {
    const { id } = req.params;
    const body = _.omit((req && req.body) || {}, Item.dontUpdateFields);
    body.updated = new Date();
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
                    res.status(400).send(err.message);
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
};

exports.searchImages = (req, res) => {
    const { query } = req.params;
    console.log('[SearchImages] Search:', query);
    const google = new Scraper.Google();
    const params = {
        keyword: query,
        num: 20,
        rlimit: 10,
        detail: true,
        advanced: {
            resolution: 'm'
        },
        nightmare: {
            show: false
        }
    };
    google.list(params)
        .then(images => {
            const filtered = images
                .map(image => {
                    const { width, height, url } = image;
                    const ratio = width / height;
                    return { width, height, ratio, url };
                })
                .filter(image => (
                    between(image.width, 150, 600) &&
                    between(image.height, 200, 800) &&
                    between(image.ratio, 0.7, 0.8)
                ));
            console.log('[SearchImages] Filtered:', filtered.length);
            res.send(filtered);
        })
        .catch(err => {
            console.log('[SearchImages]', err);
            res.status(500).send(err.message || 'Unknown scraper error');
        });
};
