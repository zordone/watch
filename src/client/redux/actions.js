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

export const setSearch = search => ({
    type: types.SET_SEARCH,
    search
});

export const setFirstLoad = firstLoad => ({
    type: types.SET_FIRST_LOAD,
    firstLoad
});
