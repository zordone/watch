import _ from 'lodash';

export const getItems = state => state.items;
export const getItemById = (state, id) => _.find(state.items, { _id: id });
export const getSearch = state => state.search;
export const getFilteredItems = state => state.filteredItems;
export const getFirstLoad = state => state.firstLoad;
export const getCurrentId = state => state.currentId;
