export enum Type {
  MOVIE = "movie",
  SHOW = "show",
}

export enum Next {
  EMPTY = "",
  RECHECK = "recheck",
  START = "start",
  END = "end",
  RELEASE = "release",
  AVAILABLE = "available",
}

export enum Vali {
  EMPTY = "",
  YES = "yes",
  NO = "no",
  MAYBE = "maybe",
}

export enum State {
  FINISHED = "finished",
  RECHECK = "recheck",
  WAITING = "waiting",
  READY = "ready",
  PROGRESS = "progress",
  QUIT = "quit",
}

export enum Finished {
  YES = "yes",
  NO = "no",
  MAYBE = "maybe",
  PROBABLY = "probably",
  QUIT = "quit",
}

export enum Rating {
  EMPTY = "",
  DISLIKE = "dislike",
  LIKE = "like",
  FAVORITE = "favorite",
}

export enum Genre {
  ACTION = "action",
  ADVENTURE = "adventure",
  ANIMATION = "animation",
  ANIME = "anime",
  BIKE = "bike",
  BIOGRAPHY = "biography",
  COMEDY = "comedy",
  CRIME = "crime",
  DOCUMENTARY = "documentary",
  DRAMA = "drama",
  FANTASY = "fantasy",
  FAMILY = "family",
  HISTORY = "history",
  HORROR = "horror",
  MYSTERY = "mystery",
  MUSIC = "music",
  ROMANCE = "romance",
  SCI_FI = "sci-fi",
  STANDUP = "standup",
  THRILLER = "thriller",
  WAR = "war",
}

export enum SortComparator {
  DEFAULT = "default",
  CREATED = "created",
  UPDATED = "updated",
}

export enum ItemLoadingFlag {
  ITEM = "item",
  POSTER = "poster",
  POSTER_SEARCH = "posterSearch",
  IMDB_SCRAPE = "imdbScrape",
  SAVE = "save",
  DELETE = "delete",
}
