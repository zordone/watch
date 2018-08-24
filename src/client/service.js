import moment from 'moment';
import _ from 'lodash';
import { ItemType, NextType, ValiType } from '../common/enums';

const BASE_URL = 'http://localhost:3001';

const formatDate = dateStr => (
    dateStr
        ? moment(dateStr, moment.ISO_8601).format('YYYY-MM-DD')
        : ''
);

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
    finished: formatDate(item.finished),
    nextDate: formatDate(item.nextDate)
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
