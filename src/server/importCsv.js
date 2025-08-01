const csv = require("csvtojson");
const dayjs = require("dayjs");
const { ItemType, ValiType, NextType, FinishedType } = require("../common/enums-node");
const { Item } = require("./models");

const csvDate = (dateStr) => (dateStr ? dayjs(dateStr).toDate() : null);

const csvSeason = (seasonStr) => (seasonStr ? parseInt(seasonStr.substr(1), 10) || 1 : null);

const csvGenres = (genresStr) =>
  (genresStr || "")
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);

const csvNextType = (nextStr) => (nextStr === "check" ? NextType.RECHECK : nextStr);

const importCsv = (filename) =>
  csv()
    .fromFile(filename)
    .then((rows) =>
      rows.map((row) => {
        const now = new Date();
        const isFinishedMovie = row.Type === ItemType.MOVIE && row.LastDone === "watched";
        return new Item({
          title: row.Title,
          type: row.Type,
          genres: csvGenres(row.Genre),
          finished: isFinishedMovie ? FinishedType.YES : row.Finished || FinishedType.NO,
          lastWatched: csvSeason(row.LastDone),
          inProgress: csvSeason(row.InProgress),
          nextDate: csvDate(row.NextDate),
          nextType: csvNextType(row.NextType),
          withVali: row.WithVali || ValiType.NO,
          notes: row.Notes || "",
          imdbId: row.IMDb || "",
          posterUrl: row.Poster || "",
          created: now,
          updated: now,
        });
      }),
    )
    .catch((err) => {
      console.error("[ImportCsv]", err);
      throw err;
    });

exports.importCsv = importCsv;
