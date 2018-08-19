import moment from 'moment';

const BASE_URL = 'http://localhost:3001';

const formatDate = dateStr => (
    dateStr
        ? moment(dateStr, moment.ISO_8601).format('YYYY-MM-DD')
        : ''
);

const parseItem = item => ({
    ...item,
    finished: formatDate(item.finished),
    nextDate: formatDate(item.nextDate),
    nextType: item.nextType || '',
    withVali: item.withVali || '',
    imdbId: item.imdbId || ''
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
        .then(res => res.json());
};
