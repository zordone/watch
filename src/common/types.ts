import { Finished, Genre, Type, Next, Rating, State, Vali } from "./enums";

export interface Item {
  _id: string;
  title: string;
  type: Type;
  genres?: Genre[];
  finished?: Finished;
  lastWatched?: number;
  inProgress?: number;
  nextDate?: Date;
  nextType?: Next;
  withVali?: Vali;
  rating?: Rating;
  description?: string;
  keywords?: string[];
  notes?: string;
  imdbId?: string;
  posterUrl?: string;
  releaseYear?: number;
  created: Date;
  updated: Date;
}

export interface ItemSearchData {
  text: string;
  starts: string[];
  equals: string[];
}

export interface ParsedItem
  // exclude all the optional fields from Item, and change the types of fields that are stringified for the form.
  extends Omit<
    Item,
    | "lastWatched"
    | "inProgress"
    | "nextDate"
    | "rating"
    | "releaseYear"
    | "genres"
    | "finished"
    | "keywords"
    | "notes"
  > {
  lastWatched: string;
  inProgress: string;
  nextDate: string;
  rating: string;
  releaseYear: string;
  genres: Genre[];
  finished: Finished;
  keywords: string[];
  notes: string;
  state: {
    type: State;
    parts: string[];
    num: number;
  };
  searchData: ItemSearchData;
}

export interface ParsedImdbData {
  parsed: {
    type: Type;
    title: string;
    genres: Genre[];
    description: string;
    keywords: string[];
    posterUrl: string;
    released: string;
    releaseYear: number | null;
  };
  extra: {
    rating: string;
    ratingCount: string;
  };
}

export interface NetworkInfo {
  ip: string;
}

export interface StateInfo {
  type: State;
  num: number;
  parts: string[];
}

export interface DateInfo {
  date: Date | null;
  input: string;
  display: string;
}
