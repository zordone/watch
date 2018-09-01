import _ from 'lodash';
import { ItemType, NextType, ValiType, FinishedType, StateType, SearchKeywords } from '../common/enums';
import { parseDate } from './utils';
import itemState from './itemState';

const BASE_URL = 'http://localhost:3001';

export const defaultItem = {
    title: '',
    type: ItemType.MOVIE,
    genres: [],
    finished: FinishedType.NO,
    lastWatched: '',
    inProgress: '',
    nextDate: '',
    nextType: NextType.END,
    withVali: ValiType.NO,
    notes: '',
    imdbId: '',
    posterUrl: ''
};

const cleanArray = array =>
    array
        .map(item => item.trim().toLowerCase())
        .filter(item => item);

const itemSearchData = (item, state) => ({
    text: `${item.title} ${item.notes}`.toLowerCase(),
    starts: cleanArray(item.genres),
    equals: cleanArray([
        item.type,
        state.type,
        item.finished === FinishedType.YES ? SearchKeywords.FINISHED : SearchKeywords.UNFINISHED,
        item.withVali === ValiType.YES ? SearchKeywords.VALI : '',
        item.withVali === ValiType.NO ? SearchKeywords.CSABA : '',
        !item.posterUrl ? SearchKeywords.NOPOSTER : '',
        !item.imdbId ? SearchKeywords.NOIMDB : ''
    ])
});

const stateNum = {
    [StateType.PROGRESS]: 1,
    [StateType.READY]: 2,
    [StateType.RECHECK]: 3,
    [StateType.WAITING]: 4,
    [StateType.FINISHED]: 5
};

const parseItem = item => {
    const state = itemState(item);
    state.num = stateNum[state.type];
    const searchData = itemSearchData(item, state);
    return {
        // add missing fields
        ...defaultItem,
        // default nulls to empty string
        ..._.mapValues(item, value => value || ''),
        // format dates
        nextDate: parseDate(item.nextDate).input,
        // calculated fields
        state,
        searchData
    };
};

const compareItems = (a, b) => {
    if (a.state.num < b.state.num) {
        return -1;
    }
    if (a.state.num > b.state.num) {
        return 1;
    }
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
};

export const sortItems = items => items.sort(compareItems);

export const listItems = () =>
    fetch(`${BASE_URL}/items`)
        .then(res => res.json())
        .then(res => res.map(parseItem))
        .then(sortItems);

export const getItemById = id =>
    fetch(`${BASE_URL}/items/${id}`)
        .then(res => res.json())
        .then(parseItem);

export const updateItemById = (id, item) => {
    const opts = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    };
    return fetch(`${BASE_URL}/items/${id}`, opts)
        .then(res => res.json())
        .then(parseItem);
};

export const createNewItem = () => (
    parseItem({
        ...defaultItem,
        _id: 'new'
    })
);

export const saveNewItem = item => {
    const opts = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    };
    return fetch(`${BASE_URL}/items`, opts)
        .then(res => res.json())
        .then(parseItem);
};
