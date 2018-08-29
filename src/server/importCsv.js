const csv = require('csvtojson');
const moment = require('moment');
const { Item } = require('./models');
const { ItemType, ValiType, NextType, FinishedType } = require('../common/enums');

const csvDate = dateStr => (
    dateStr
        ? moment(dateStr, 'YYYY-MM-DD').toDate()
        : null
);

const csvSeason = seasonStr => (
    seasonStr
        ? parseInt(seasonStr.substr(1), 10) || 1
        : null
);

const csvGenres = genresStr =>
    (genresStr || '').split(',')
        .map(genre => genre.trim())
        .filter(genre => Boolean(genre));

const csvNextType = nextStr => (
    nextStr === 'check'
        ? NextType.RECHECK
        : nextStr
);

const importCsv = filename => (
    csv()
        .fromFile(filename)
        .then(rows => (
            rows.map(row => {
                const now = new Date();
                const isFinishedMovie = (
                    row.Type === ItemType.MOVIE &&
                    row.LastDone === 'watched'
                );
                return new Item({
                    title: row.Title,
                    type: row.Type,
                    genres: csvGenres(row.Genre),
                    finished: isFinishedMovie
                        ? FinishedType.YES
                        : row.Finished || FinishedType.NO,
                    lastWatched: csvSeason(row.LastDone),
                    inProgress: csvSeason(row.InProgress),
                    nextDate: csvDate(row.NextDate),
                    nextType: csvNextType(row.NextType),
                    withVali: row.WithVali || ValiType.NO,
                    notes: row.Notes || '',
                    imdbId: row.IMDb || '',
                    imdbId: row['# IMDb id'] || '',
                    posterUrl: '',
                    created: now,
                    updated: now
                });
            })
        ))
        .catch(err => {
            console.error('[ImportCsv]', err);
            throw err;
        })
);

exports.importCsv = importCsv;
