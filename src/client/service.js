import moment from 'moment';

const BASE_URL = 'http://localhost:3001';

const parseItem = item => ({
    ...item,
    finished: item.finished
        ? moment(item.finished, moment.ISO_8601).format('YYYY-MM-DD')
        : ''
});

export const listItems = () =>
    fetch(`${BASE_URL}/items`)
        .then(res => res.json())
        .then(res => res.map(parseItem));

export const getItemById = id =>
    fetch(`${BASE_URL}/items/${id}`)
        .then(res => res.json())
        .then(res => {
            window.moment = moment; // eslint-disable-line
            console.log('RES', res);
            return res;
        })
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
