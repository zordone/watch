import { SortComparator } from "@common/enums";
import { Item, ParsedImdbData, ParsedItem } from "@common/types";
import { defaultItem, jsonHeaders, parseItem, jsonOrError } from "./serviceUtils";
import { sortComparators } from "./sort";

const BASE_URL = window.location.origin.replace(/:3000$/, ":3001");
console.debug("Backend URL", BASE_URL);

export const NEW_ID = "new";

export const sortItems = (items: ParsedItem[], sort = SortComparator.DEFAULT) => [
  ...items.toSorted(sortComparators[sort]),
];

export const listItems = (): Promise<ParsedItem[]> =>
  fetch(`${BASE_URL}/items`)
    .then(jsonOrError<Item[]>)
    .then((res) => res.map(parseItem))
    .then(sortItems);

export const getItemById = (id: string): Promise<ParsedItem> =>
  fetch(`${BASE_URL}/items/${id}`)
    .then(jsonOrError<Item>)
    .then(parseItem);

export const updateItemById = (id: string, item: ParsedItem): Promise<ParsedItem> => {
  const opts = {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(item),
  };
  return fetch(`${BASE_URL}/items/${id}`, opts)
    .then(jsonOrError<Item>)
    .then(parseItem);
};

export const createNewItem = (): ParsedItem =>
  parseItem({
    ...defaultItem,
    _id: NEW_ID,
  });

export const saveNewItem = (item: ParsedItem): Promise<ParsedItem> => {
  const opts = {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(item),
  };
  return fetch(`${BASE_URL}/items`, opts)
    .then(jsonOrError<Item>)
    .then(parseItem);
};

export const deleteItemById = (id: string): Promise<void> => {
  const opts = {
    method: "DELETE",
  };
  return fetch(`${BASE_URL}/items/${id}`, opts).then(jsonOrError<void>);
};

export const searchImages = (query: string): Promise<string[]> =>
  fetch(`${BASE_URL}/searchimages/${query}`).then(jsonOrError<string[]>);

export const imdbData = (id: string): Promise<ParsedImdbData> =>
  fetch(`${BASE_URL}/imdbdata/${id}`).then(jsonOrError<ParsedImdbData>);
