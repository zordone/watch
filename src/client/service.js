import _ from 'lodash';
import { ItemType, NextType, ValiType, FinishedType, StateType } from '../common/enums';
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

const itemSearchText = (item, state) => {
    const fields = [
        item.type,
        item.title,
        item.genres,
        item.notes,
        item.finished === FinishedType.YES ? 'finished' : 'unfinished',
        item.withVali === ValiType.YES ? 'vali' : '',
        state.type
    ];
    return fields.filter(field => field).join(' ').toLowerCase();
};

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
    const searchText = itemSearchText(item, state);
    return {
        // add missing fields
        ...defaultItem,
        // default nulls to empty string
        ..._.mapValues(item, value => value || ''),
        // format dates
        nextDate: parseDate(item.nextDate).input,
        // calculated fields
        state,
        searchText
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

export const listItems = () =>
    fetch(`${BASE_URL}/items`)
        .then(res => res.json())
        .then(res => res.map(parseItem).sort(compareItems));

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
