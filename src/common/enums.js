// TODO: find a way so we can use this from both node and browser. (remove enums-node.js)

export const ItemType = Object.freeze({
  MOVIE: "movie",
  SHOW: "show",
});

export const NextType = Object.freeze({
  EMPTY: "",
  RECHECK: "recheck",
  START: "start",
  END: "end",
  RELEASE: "release",
  AVAILABLE: "available",
});

export const ValiType = Object.freeze({
  EMPTY: "",
  YES: "yes",
  NO: "no",
  MAYBE: "maybe",
});

export const StateType = Object.freeze({
  FINISHED: "finished",
  RECHECK: "recheck",
  WAITING: "waiting",
  READY: "ready",
  PROGRESS: "progress",
  QUIT: "quit",
});

export const FinishedType = Object.freeze({
  YES: "yes",
  NO: "no",
  MAYBE: "maybe",
  PROBABLY: "probably",
  QUIT: "quit",
});

export const RatingType = Object.freeze({
  EMPTY: "",
  DISLIKE: "dislike",
  LIKE: "like",
  FAVORITE: "favorite",
});

export const SearchKeywords = Object.freeze({
  // primary keywords (without prefix)
  ...ItemType,
  ...StateType,
  VALI: "vali",
  CSABA: "csaba",
  // secondary keywors (with # prefix)
  FINISHED: "#finished",
  UNFINISHED: "#unfinished",
  NOPOSTER: "#noposter",
  NOIMDB: "#noimdb",
  UNSCRAPED: "#unscraped",
  DISLIKE: `#${RatingType.DISLIKE}`,
  LIKE: `#${RatingType.LIKE}`,
  FAVORITE: `#${RatingType.FAVORITE}`,
});

export const SortComparators = Object.freeze({
  DEFAULT: "default",
  CREATED: "created",
  UPDATED: "updated",
});

export const ItemLoadingFlags = Object.freeze({
  ITEM: "item",
  POSTER: "poster",
  POSTER_SEARCH: "posterSearch",
  IMDB_SCRAPE: "imdbScrape",
  SAVE: "save",
  DELETE: "delete",
});

export const Const = Object.freeze({
  NEW: "new",
});
