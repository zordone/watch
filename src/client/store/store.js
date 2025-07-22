import { proxy, useSnapshot } from "valtio";
import * as service from "../service/service";
import { Const } from "../../common/enums";

// get initial search term from the URL hash
const initialSearch = decodeURIComponent((location.hash || "").slice(1));

// main store proxy with the initial state
const store = proxy({
  items: [],
  filteredItems: [],
  search: initialSearch,
  isLoaderFinished: false,
  currentId: "",
  sort: "default",
  resort: false,
  snacks: [],
  itemLoadingFlags: new Set(),
  isItemLoading: false,
});

// hook to get the entire store snapshot
export const useStore = () => useSnapshot(store);

// hook actions to modify the store
export const actions = {
  setItems(items) {
    // only set it the first time, to prevent the local cache overwrite our local mutations
    if (store.items.length > 0) return;
    store.items = items;
  },

  addNewItem(item) {
    // insert the new item in front of the old items
    store.items = [item, ...store.items];
  },

  updateItem(newItem) {
    // if the items are not fetched yet, leave it empty, so it will be fetched later
    if (!store.items.length) return;
    // replace the one updated item in the items array
    store.items = store.items
      .filter((oldItem) => ![Const.NEW, newItem._id].includes(oldItem._id))
      .concat(newItem);
    // we need to re-sort the items, because the updated item might move
    store.resort = true;
  },

  deleteItem(items, id) {
    store.items = items.filter((item) => item._id !== id);
  },

  setSearch(search) {
    store.search = search;
  },

  setFilteredItems(filteredItems) {
    store.filteredItems = filteredItems;
  },

  setIsLoaderFinished(isLoaderFinished) {
    store.isLoaderFinished = isLoaderFinished;
  },

  setItemLoadingFlag(flag, value) {
    if (value) {
      store.itemLoadingFlags.add(flag);
    } else {
      store.itemLoadingFlags.delete(flag);
    }
    store.isItemLoading = store.itemLoadingFlags.size > 0;
  },

  setCurrentId(currentId) {
    store.currentId = currentId;
  },

  setSort(items, sort) {
    store.items = service.sortItems(items, sort);
    store.sort = sort;
    // we no longer need to re-sort the items
    store.resort = false;
  },

  showSnack(text, severity = "success") {
    const id = window.crypto.randomUUID();
    store.snacks.push({ id, text, severity, visible: true });
  },

  closeSnack(id) {
    const snack = store.snacks.find((snack) => snack.id === id);
    if (!snack) return;
    snack.visible = false;
  },

  clearSnacks() {
    if (store.snacks.some((snack) => snack.visible)) {
      return;
    }
    store.snacks = [];
  },
};
