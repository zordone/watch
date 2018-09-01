import * as types from './actionTypes';

const initialState = {
    items: [],
    filteredItems: [],
    search: '',
    firstLoad: true
};

export default (state = initialState, action) => {
    switch (action.type) {
    case types.FETCH_ITEMS:
        return action;
    case types.RECEIVE_ITEMS:
        return {
            ...state,
            items: action.items
        };
    case types.ADD_NEW_ITEM:
        return {
            ...state,
            items: [action.item, ...state.items]
        };
    case types.UPDATE_ITEM:
        return {
            ...state,
            items: action.items
        };
    case types.SET_SEARCH:
        return {
            ...state,
            search: action.search,
            filteredItems: action.filteredItems
        };
    case types.SET_FIRST_LOAD:
        return {
            ...state,
            firstLoad: action.firstLoad
        };
    default:
        return state;
    }
};
