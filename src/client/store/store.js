import { proxy, useSnapshot } from "valtio";
import * as service from "../service/service";
import { Const } from "../../common/enums";

// main store proxy with the initial state
const store = proxy({
  items: [],
  filteredItems: [],
  search: "",
  firstLoad: true,
  currentId: "",
  sort: "default",
  resort: false,
  snackOpen: false,
  snackText: "",
});

// hook to get the entire store snapshot
export const useStore = () => useSnapshot(store);

// hook actions to modify the store
export const actions = {
  async fetchItems(all) {
    try {
      const items = await service.listItems(all);
      store.items = items;
      return items;
    } catch (error) {
      console.error("Failed to fetch items:", error);
      throw error;
    }
  },

  addNewItem(item) {
    // insert the new item in front of the old items
    store.items = [item, ...store.items];
  },

  updateItem(items, newItem) {
    // replace the one updated item in the items array
    const newItems = items
      .filter((oldItem) => ![Const.NEW, newItem._id].includes(oldItem._id))
      .concat(newItem);
    store.items = newItems;
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

  setFirstLoad(firstLoad) {
    store.firstLoad = firstLoad;
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

  setSnack(snackOpen, snackText) {
    store.snackOpen = snackOpen;
    // we only update the text if the snackbar is open
    // (leave it there during hide transition)
    if (snackOpen) {
      store.snackText = snackText;
    }
  },
};
