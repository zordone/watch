import _ from 'lodash';
import { ItemType, NextType, ValiType } from '../common/enums';
import { parseDate } from './utils';
import itemState from './itemState';

const BASE_URL = 'http://localhost:3001';

export const defaultItem = {
    title: '',
    type: ItemType.MOVIE,
    genres: [],
    finished: '',
    lastWatched: '',
    inProgress: '',
    nextDate: '',
    nextType: NextType.END,
    withVali: ValiType.NO,
    notes: '',
    imdbId: '',
    posterUrl: ''
};

const parseItem = item => ({
    // add missing fields
    ...defaultItem,
    // default nulls to empty string
    ..._.mapValues(item, value => value || ''),
    // format dates
    finished: parseDate(item.finished).input,
    nextDate: parseDate(item.nextDate).input,
    // calculated fields
    state: itemState(item)
});

export const listItems = () =>
    fetch(`${BASE_URL}/items`)
        .then(res => res.json())
        .then(res => res.map(parseItem));

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
