/* global it,document,jest */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

global.fetch = jest.fn(() => Promise.resolve());
console.error = jest.fn();

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
