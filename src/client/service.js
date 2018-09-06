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
        .map(item => (item || '').trim().toLowerCase())
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

const jsonOrError = res => (
    res.text()
        .then(text => {
            if (res.ok) {
                return (!text || text === 'OK')
                    ? 'empty response'
                    : JSON.parse(text);
            }
            throw new Error(text);
        })
);

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
        .then(jsonOrError)
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
        .then(jsonOrError)
        .then(parseItem);
};

export const deleteItemById = id => {
    const opts = {
        method: 'DELETE'
    };
    return fetch(`${BASE_URL}/items/${id}`, opts)
        .then(jsonOrError);
};

export const searchImages = query =>
    fetch(`${BASE_URL}/searchimages/${query}`)
        .then(res => res.json());

export const mockSearchImages = timeout =>
    new Promise(resolve => {
        const images = [
            { width: 454, height: 640, ratio: 0.709375, url: 'https://ae01.alicdn.com/kf/HTB1JaX9NVXXXXc6XpXXq6xXFXXXr/The-Big-Bang-Theory-TV-Show-Fabric-poster-36-x-24-Decor-51.jpg_640x640.jpg' },
            { width: 600, height: 798, ratio: 0.7518796992481203, url: 'https://i.pinimg.com/736x/fa/97/8b/fa978bd5c07189751980ad2e961ef536--band-tv-movie.jpg' },
            { width: 300, height: 400, ratio: 0.75, url: 'https://localhost/missing.jpg' },
            { width: 377, height: 500, ratio: 0.754, url: 'http://images6.fanpop.com/image/photos/39400000/The-big-bang-theory-poster-the-big-bang-theory-39458794-377-500.jpg' },
            { width: 310, height: 425, ratio: 0.7294117647058823, url: 'https://vignette.wikia.nocookie.net/bigbangtheory/images/1/1d/Season_7_DVD.jpg/revision/latest/scale-to-width-down/310?cb=20140620225202' },
            { width: 300, height: 400, ratio: 0.75, url: 'https://cdn.mytheatreland.com/images/show/28700_show_portrait_large.jpg' }
        ];
        setTimeout(() => resolve(images), timeout);
    });
