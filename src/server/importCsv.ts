import csv from "csvtojson";
import dayjs from "dayjs";
import { Type, Vali, Next, Finished } from "@common/enums";
import { ItemInstance, ItemModel } from "./models";

const csvDate = (dateStr: string) => (dateStr ? dayjs(dateStr).toDate() : null);

const csvSeason = (seasonStr: string) => (seasonStr ? parseInt(seasonStr.slice(1), 10) || 1 : null);

const csvGenres = (genresStr: string) =>
  (genresStr || "")
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);

const csvNextType = (nextStr: string) => (nextStr === "check" ? Next.RECHECK : nextStr);

export const importCsv = async (filename: string): Promise<ItemInstance[]> => {
  const rows = (await csv().fromFile(filename)) as Record<string, string>[];
  return rows.map((row) => {
    const now = new Date();
    const isFinishedMovie = row.Type === String(Type.MOVIE) && row.LastDone === "watched";
    return new ItemModel({
      title: row.Title,
      type: row.Type,
      genres: csvGenres(row.Genre),
      finished: isFinishedMovie ? Finished.YES : row.Finished || Finished.NO,
      lastWatched: csvSeason(row.LastDone),
      inProgress: csvSeason(row.InProgress),
      nextDate: csvDate(row.NextDate),
      nextType: csvNextType(row.NextType),
      withVali: row.WithVali || Vali.NO,
      notes: row.Notes || "",
      imdbId: row.IMDb || "",
      posterUrl: row.Poster || "",
      created: now,
      updated: now,
    });
  });
};
