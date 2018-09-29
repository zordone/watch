import * as service from '../service/service';
import * as types from './actionTypes';
import { Const } from '../../common/enums';

export const receiveItems = items => ({
    type: types.RECEIVE_ITEMS,
    items
});

export const fetchItems = () => (
    dispatch => (
        service.listItems()
            .then(items => dispatch(receiveItems(items)))
    )
);

export const addNewItem = item => ({
    type: types.ADD_NEW_ITEM,
    item
});

export const updateItem = (items, newItem) => {
    // replace the one updated item in the items array
    const newItems = items
        .filter(oldItem => ![Const.NEW, newItem._id].includes(oldItem._id))
        .concat(newItem);
    return {
        type: types.UPDATE_ITEM,
        items: newItems
    };
};

export const deleteItem = (items, id) => ({
    type: types.DELETE_ITEM,
    items: items.filter(item => item._id !== id)
});

export const setSearch = (search, filteredItems) => ({
    type: types.SET_SEARCH,
    search,
    filteredItems
});

export const setFirstLoad = firstLoad => ({
    type: types.SET_FIRST_LOAD,
    firstLoad
});

export const setCurrentId = currentId => ({
    type: types.SET_CURRENT_ID,
    currentId
});

export const setSort = (items, sort) => ({
    type: types.SET_SORT,
    items: service.sortItems(items, sort),
    sort
});

export const setSnack = (snackOpen, snackText) => ({
    type: types.SET_SNACK,
    snackOpen,
    snackText
});
