const BASE_URL = 'http://localhost:3001';

export const listItems = () =>
    fetch(`${BASE_URL}/items`)
        .then(res => res.json());

export const getItemById = id =>
    fetch(`${BASE_URL}/items/${id}`)
        .then(res => res.json());
