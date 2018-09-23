/* globals window */

import { ItemType, NextType, ValiType, FinishedType, StateType, SearchKeywords, Const, SortComparators } from '../../common/enums';
import { parseDate } from './utils';
import itemState from './itemState';
import _ from '../../common/lodashReduced';

const BASE_URL = window.location.origin.replace(/:3000$/, ':3001');
console.debug('Backend URL', BASE_URL);

export const defaultItem = {
    title: '',
    type: ItemType.MOVIE,
    genres: [],
    finished: FinishedType.NO,
    lastWatched: '',
    inProgress: '',
    nextDate: '',
    nextType: NextType.EMPTY,
    withVali: ValiType.NO,
    description: '',
    keywords: [],
    notes: '',
    imdbId: '',
    posterUrl: '',
    releaseYear: ''
};

const jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

const cleanArray = array =>
    array
        .map(item => (item || '').trim().toLowerCase())
        .filter(Boolean);

const itemSearchData = (item, state) => ({
    text: `${item.title} ${item.notes} ${item.description}`.toLowerCase(),
    starts: cleanArray(item.genres),
    equals: cleanArray([
        item.type,
        state.type,
        item.finished === FinishedType.YES ? SearchKeywords.FINISHED : SearchKeywords.UNFINISHED,
        [ValiType.YES, ValiType.MAYBE].includes(item.withVali) ? SearchKeywords.VALI : '',
        item.withVali === ValiType.NO ? SearchKeywords.CSABA : '',
        !item.posterUrl ? SearchKeywords.NOPOSTER : '',
        !item.imdbId ? SearchKeywords.NOIMDB : '',
        (item.keywords.length || item.description.length) ? '' : SearchKeywords.UNSCRAPED,
        ...item.keywords
    ])
});

const stateNum = {
    [StateType.PROGRESS]: 1,
    [StateType.READY]: 2,
    [StateType.RECHECK]: 3,
    [StateType.WAITING]: 4,
    [StateType.FINISHED]: 5,
    [StateType.QUIT]: 6
};

const parseItem = item => {
    // add missing fields
    const fullItem = {
        ...defaultItem,
        ...item
    };
    const state = itemState(fullItem);
    state.num = stateNum[state.type];
    const searchData = itemSearchData(fullItem, state);
    return {
        ...fullItem,
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

const compareValues = (a, b, asc = true) => {
    if (a < b) {
        return asc ? -1 : 1;
    }
    if (a > b) {
        return asc ? 1 : -1;
    }
    return 0;
};

const compareItemsDefault = (a, b) => (
    compareValues(a.state.num, b.state.num, true) ||
    compareValues(a.title, b.title, true)
);

const compareItemsCreated = (a, b) => (
    compareValues(a.created, b.created, false) ||
    compareValues(a.title, b.title, true)
);

const compareItemsUpdated = (a, b) => (
    compareValues(a.updated, b.updated, false) ||
    compareValues(a.title, b.title, true)
);

const sortComparators = {
    [SortComparators.DEFAULT]: compareItemsDefault,
    [SortComparators.CREATED]: compareItemsCreated,
    [SortComparators.UPDATED]: compareItemsUpdated
};

export const sortItems = (items, sort = SortComparators.DEFAULT) =>
    [...items.sort(sortComparators[sort])];

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
        headers: jsonHeaders,
        body: JSON.stringify(item)
    };
    return fetch(`${BASE_URL}/items/${id}`, opts)
        .then(jsonOrError)
        .then(parseItem);
};

export const createNewItem = () => (
    parseItem({
        ...defaultItem,
        _id: Const.NEW
    })
);

export const saveNewItem = item => {
    const opts = {
        method: 'POST',
        headers: jsonHeaders,
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
            { width: 300, height: 400, ratio: 0.75, url: 'https://cdn.mytheatreland.com/images/show/28700_show_portrait_large.jpg' },
            { width: 300, height: 400, ratio: 0.75, url: 'https://cdn.mytheatreland.com/images/show/28700_show_portrait_large.jpg' },
            { width: 300, height: 400, ratio: 0.75, url: 'https://cdn.mytheatreland.com/images/show/28700_show_portrait_large.jpg' },
            { width: 300, height: 400, ratio: 0.75, url: 'https://cdn.mytheatreland.com/images/show/28700_show_portrait_large.jpg' }
        ];
        setTimeout(() => resolve(images), timeout);
    });

export const imdbData = id =>
    fetch(`${BASE_URL}/imdbdata/${id}`)
        .then(res => res.json());
