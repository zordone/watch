import _ from 'lodash';
import { ItemType, NextType, ValiType, FinishedType } from '../common/enums';
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

const itemSearchText = item => {
    const fields = [
        item.type,
        item.title,
        item.genres,
        item.notes,
        item.finished === FinishedType.YES ? 'finished' : 'unfinished',
        item.withVali === ValiType.YES ? 'vali' : '',
        itemState(item).type
    ];
    return fields.filter(field => field).join(' ').toLowerCase();
};

const parseItem = item => ({
    // add missing fields
    ...defaultItem,
    // default nulls to empty string
    ..._.mapValues(item, value => value || ''),
    // format dates
    nextDate: parseDate(item.nextDate).input,
    // calculated fields
    state: itemState(item),
    searchText: itemSearchText(item)
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
