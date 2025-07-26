import { proxy, useSnapshot } from "valtio";
import { ItemLoadingFlag, SortComparator } from "@common/enums";
import { ParsedItem } from "@common/types";
import { sortItems, NEW_ID } from "../service/service";

// TypeScript module augmentation for Valtio to overcome the deep readonly issue
declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

interface Snack {
  id: string;
  text: string;
  severity: "error" | "info" | "success" | "warning";
  visible: boolean;
}

interface Store {
  items: ParsedItem[];
  filteredItems: ParsedItem[];
  search: string;
  isLoaderFinished: boolean;
  currentId: string;
  sort: SortComparator;
  resort: boolean;
  snacks: Snack[];
  itemLoadingFlags: Set<ItemLoadingFlag>;
  isItemLoading: boolean;
}

// get initial search term from the URL hash
const initialSearch = decodeURIComponent((location.hash ?? "").slice(1));

// main store proxy with the initial state
const store = proxy<Store>({
  items: [],
  filteredItems: [],
  search: initialSearch,
  isLoaderFinished: false,
  currentId: "",
  sort: SortComparator.DEFAULT,
  resort: false,
  snacks: [],
  itemLoadingFlags: new Set(),
  isItemLoading: false,
});

// hook to get the entire store snapshot
export const useStore = () => useSnapshot(store);

// hook actions to modify the store
export const actions = {
  setItems(items: ParsedItem[]) {
    // only set it the first time, to prevent the local cache overwrite our local mutations
    if (store.items.length > 0) return;
    store.items = items;
  },

  updateItem(newItem: ParsedItem) {
    // if the items are not fetched yet, leave it empty, so it will be fetched later
    if (!store.items.length) return;
    // replace the one updated item in the items array
    store.items = store.items
      .filter((oldItem) => ![NEW_ID, newItem._id].includes(oldItem._id))
      .concat(newItem);
    // we need to re-sort the items, because the updated item might move
    store.resort = true;
  },

  deleteItem(id: string) {
    store.items = store.items.filter((item) => item._id !== id);
  },

  setSearch(search: string) {
    store.search = search;
  },

  setFilteredItems(filteredItems: ParsedItem[]) {
    store.filteredItems = filteredItems;
  },

  setIsLoaderFinished(isLoaderFinished: boolean) {
    store.isLoaderFinished = isLoaderFinished;
  },

  setItemLoadingFlag(flag: ItemLoadingFlag, value: boolean) {
    if (value) {
      store.itemLoadingFlags.add(flag);
    } else {
      store.itemLoadingFlags.delete(flag);
    }
    store.isItemLoading = store.itemLoadingFlags.size > 0;
  },

  setCurrentId(currentId: string) {
    store.currentId = currentId;
  },

  setSort(sort: SortComparator) {
    store.items = sortItems(store.items, sort);
    store.sort = sort;
    // we no longer need to re-sort the items
    store.resort = false;
  },

  showSnack(text: string, severity: Snack["severity"] = "success") {
    const id = window.crypto.randomUUID();
    store.snacks.push({ id, text, severity, visible: true });
  },

  closeSnack(id: string) {
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
