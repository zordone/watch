import { Type, Next, Vali, Finished, State } from "@common/enums";
import { Item, ParsedItem } from "@common/types";
import { itemState } from "./itemState";
import { itemSearchData } from "./search";
import { parseDate } from "./utils";

export const defaultItem: Item = {
  _id: "",
  created: new Date(),
  updated: new Date(),
  title: "",
  type: Type.SHOW,
  genres: [],
  finished: Finished.NO,
  nextType: Next.EMPTY,
  withVali: Vali.NO,
  description: "",
  keywords: [],
  notes: "",
  imdbId: "",
  posterUrl: "",
};

export const defaultParsedItem: ParsedItem = {
  ...defaultItem,
  lastWatched: "",
  inProgress: "",
  nextDate: "",
  releaseYear: "",
  rating: "",
  genres: [],
  notes: "",
  keywords: [],
  finished: Finished.NO,
  state: {
    type: State.READY,
    parts: [],
    num: 0,
  },
  searchData: {
    text: "",
    starts: [],
    equals: [],
  },
};

export const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const parseItem = (item: Item): ParsedItem => {
  const state = itemState(item);
  const parsed: ParsedItem = {
    // add missing fields
    ...defaultParsedItem,
    // add incoming fields
    ...item,
    // default undefined fields
    lastWatched: String(item.lastWatched ?? ""),
    inProgress: String(item.inProgress ?? ""),
    releaseYear: String(item.releaseYear ?? ""),
    rating: String(item.rating ?? ""),
    genres: item.genres ?? [],
    notes: item.notes ?? "",
    finished: item.finished ?? Finished.NO,
    keywords: item.keywords ?? [],
    // add parsed fields
    nextDate: parseDate(item.nextDate).input,
    // add calculated fields
    state,
    searchData: {
      text: "",
      starts: [],
      equals: [],
    },
  };
  parsed.searchData = itemSearchData(parsed, state);
  return parsed;
};

export const jsonOrError = <Return = unknown>(res: Response): Promise<Return> =>
  res.text().then((text) => {
    if (!res.ok) throw new Error(`${res.statusText} ${res.status}: ${res.url}`);
    if (!text || text === "OK") text = "{}";
    return JSON.parse(text) as Return;
  });
