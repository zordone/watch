const omit = require('lodash/omit');
const Scraper = require('images-scraper');
const moment = require('moment');
const fs = require('fs');
const fetch = require('node-fetch');
const { Item } = require('./models');
const { importCsv } = require('./importCsv');
const { IMPORT_DIR, BACKUP_DIR } = require('./config');
const { ItemType } = require('../common/enums');
const { genres, keywords } = require('../common/data.json');

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
    const body = omit((req && req.body) || {}, Item.dontUpdateFields);
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
    const body = omit((req && req.body) || {}, Item.dontUpdateFields);
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

exports.deleteItemById = (req, res) => {
    const { id } = req.params;
    Item.deleteOne({ _id: id })
        .then(() => {
            console.log('[DeleteItemById] Deleted:', id);
            res.sendStatus(200);
        })
        .catch(err => {
            console.error('[DeleteItemById]', err);
            res.sendStatus(404);
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
            console.log('[SearchImages] Found:', images.length);
            const filtered = images
                .map(image => {
                    const { width, height, url } = image;
                    const ratio = width / height;
                    return { width, height, ratio, url };
                })
                .filter(image => (
                    between(image.width, 150, 900) &&
                    between(image.height, 200, 1200) &&
                    between(image.ratio, 0.65, 0.85)
                ));
            console.log('[SearchImages] Filtered:', filtered.length);
            res.send(filtered);
        })
        .catch(err => {
            console.log('[SearchImages]', err);
            res.status(500).send(err.message || 'Unknown scraper error');
        });
};

const makeArray = value => {
    if (Array.isArray(value)) {
        return value;
    }
    return value ? [value] : [];
};

exports.imdbData = (req, res) => {
    const { imdbId } = req.params;
    console.log('[ImdbData] IMDb ID:', imdbId);
    fetch(`http://www.imdb.com/title/${imdbId}/?ref_=fn_tv_tt_1`)
        .then(imdbRes => imdbRes.text())
        .then(html => {
            const imdbDataRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
            const json = (imdbDataRegex.exec(html) || [])[1];
            const data = JSON.parse(json);
            const result = {
                parsed: {
                    type: data['@type'] === 'TVSeries'
                        ? ItemType.SHOW
                        : ItemType.MOVIE,
                    title: data.name || '',
                    genres: makeArray(data.genre)
                        .map(genre => genre.toLowerCase())
                        .filter(genre => {
                            const isValid = genres.includes(genre);
                            if (!isValid) {
                                console.warn('[ImdbData] Invalid genre:', genre);
                            }
                            return isValid;
                        }),
                    description: data.description,
                    keywords: (data.keywords || '')
                        .split(',')
                        .map(keyword => keyword.trim().toLowerCase())
                        .filter(keyword => {
                            const isValid = keywords.includes(keyword);
                            if (!isValid) {
                                console.warn('[ImdbData] Invalid keyword:', keyword);
                            }
                            // TODO: collect a bunch of them
                            //   before applying the filter, or remove it?
                            // return isValid;
                            return Boolean(keyword);
                        }),
                    posterUrl: data.image || '',
                    released: data.datePublished
                        ? data.datePublished
                        : '',
                    releaseYear: data.datePublished
                        ? parseInt(data.datePublished.substr(0, 4), 10)
                        : null,
                    // TODO make use of these (?)
                    actors: makeArray(data.actor)
                        .filter(actor => actor['@type'] === 'Person')
                        .map(actor => actor.name),
                    creators: makeArray(data.creator)
                        .filter(creator => creator['@type'] === 'Person')
                        .map(creator => creator.name),
                    directors: makeArray(data.director)
                        .filter(director => director['@type'] === 'Person')
                        .map(director => director.name),
                    rating: (data.aggregateRating || {}).ratingValue || '',
                    ratingCount: ((data.aggregateRating || {}).ratingCount || 0).toString()
                },
                // TODO: remove raw
                raw: data
            };
            res.send(result);
        })
        .catch(err => {
            console.log('[ImdbData]', err);
            res.status(500).send(err.message || 'Unknown scraper error');
        });
};
