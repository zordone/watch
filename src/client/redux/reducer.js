import * as types from "./actionTypes";

const initialState = {
  items: [],
  filteredItems: [],
  search: "",
  firstLoad: true,
  currentId: "",
  sort: "default",
  resort: false,
  snackOpen: false,
  snackText: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ITEMS:
      return action;
    case types.RECEIVE_ITEMS:
      return {
        ...state,
        // the received items
        items: action.items,
      };
    case types.ADD_NEW_ITEM:
      return {
        ...state,
        // insert the new item in front of the old items
        items: [action.item, ...state.items],
      };
    case types.UPDATE_ITEM:
      return {
        ...state,
        // new items, with the updated item in it
        items: action.items,
        // we need to re-sort the items, because the updated item might move
        resort: true,
      };
    case types.DELETE_ITEM:
      return {
        ...state,
        // items, without the deleted item
        items: action.items,
      };
    case types.SET_SEARCH:
      return {
        ...state,
        // new search term
        search: action.search,
        // items filtered by the new search term
        filteredItems: action.filteredItems,
      };
    case types.SET_FIRST_LOAD:
      return {
        ...state,
        // is this the first load?
        firstLoad: action.firstLoad,
      };
    case types.SET_CURRENT_ID:
      return {
        ...state,
        // id of the currently "selected" item
        currentId: action.currentId,
      };
    case types.SET_SORT:
      return {
        ...state,
        // the newly sorted items
        items: action.items,
        // name of the sorting method
        sort: action.sort,
        // we no longer need to re-sort the items
        resort: false,
      };
    case types.SET_SNACK:
      return {
        ...state,
        // is the snackbar open?
        snackOpen: action.snackOpen,
        // we only update the text if the snackbar is open
        // (leave it there during hide transition)
        snackText: action.snackOpen ? action.snackText : state.snackText,
      };

    default:
      return state;
  }
};
