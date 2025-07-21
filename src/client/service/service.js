import { Const, SortComparators } from "../../common/enums";
import sortComparators from "./sort";
import { defaultItem, jsonHeaders, parseItem, jsonOrError } from "./serviceUtils";

const BASE_URL = window.location.origin.replace(/:3000$/, ":3001");
console.debug("Backend URL", BASE_URL);

export const sortItems = (items, sort = SortComparators.DEFAULT) => [
  ...items.toSorted(sortComparators[sort]),
];

export const listItems = (all) =>
  fetch(`${BASE_URL}/${all ? "items" : "activeitems"}`)
    .then((res) => res.json())
    .then((res) => res.map(parseItem))
    .then(sortItems);

export const getItemById = (id) =>
  fetch(`${BASE_URL}/items/${id}`)
    .then((res) => res.json())
    .then(parseItem);

export const updateItemById = (id, item) => {
  const opts = {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(item),
  };
  return fetch(`${BASE_URL}/items/${id}`, opts).then(jsonOrError).then(parseItem);
};

export const createNewItem = () =>
  parseItem({
    ...defaultItem,
    _id: Const.NEW,
  });

export const saveNewItem = (item) => {
  const opts = {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(item),
  };
  return fetch(`${BASE_URL}/items`, opts).then(jsonOrError).then(parseItem);
};

export const deleteItemById = (id) => {
  const opts = {
    method: "DELETE",
  };
  return fetch(`${BASE_URL}/items/${id}`, opts).then(jsonOrError);
};

export const searchImages = (query) => fetch(`${BASE_URL}/searchimages/${query}`).then(jsonOrError);

export const imdbData = (id) => fetch(`${BASE_URL}/imdbdata/${id}`).then(jsonOrError);
