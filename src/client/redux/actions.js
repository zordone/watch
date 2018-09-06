import * as service from '../service';
import * as types from './actionTypes';

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
        .filter(oldItem => !['new', newItem._id].includes(oldItem._id))
        .concat(newItem);
    return {
        type: types.UPDATE_ITEM,
        items: service.sortItems(newItems)
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
