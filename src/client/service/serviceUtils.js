import { ItemType, NextType, ValiType, FinishedType } from "../../common/enums";
import { parseDate } from "./utils";
import itemState from "./itemState";
import itemSearchData from "./search";
import _ from "../../common/lodashReduced";

export const defaultItem = {
  title: "",
  type: ItemType.MOVIE,
  genres: [],
  finished: FinishedType.NO,
  lastWatched: "",
  inProgress: "",
  nextDate: "",
  nextType: NextType.EMPTY,
  withVali: ValiType.NO,
  description: "",
  keywords: [],
  notes: "",
  imdbId: "",
  posterUrl: "",
  releaseYear: "",
  rating: "",
};

export const jsonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const parseItem = (item) => {
  // add missing fields
  const fullItem = {
    ...defaultItem,
    ...item,
  };
  const state = itemState(fullItem);
  const searchData = itemSearchData(fullItem, state);
  return {
    ...fullItem,
    // default nulls to empty string
    ..._.mapValues(item, (value) => value || ""),
    // format dates
    nextDate: parseDate(item.nextDate).input,
    // calculated fields
    state,
    searchData,
  };
};

export const jsonOrError = (res) =>
  res.text().then((text) => {
    if (res.ok) {
      return !text || text === "OK" ? "empty response" : JSON.parse(text);
    }
    throw new Error(text);
  });
