/* global document */
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import whyDidYouUpdate from 'why-did-you-update';
import configureStore from './redux/configureStore';
import App from './components/App';
import './index.css';

const WHY_UPDATE_ON = false;

if (WHY_UPDATE_ON && process.env.NODE_ENV !== 'production') {
    whyDidYouUpdate(React, {
        exclude: [
            // React Router components
            /^Route$/,
            /^Switch$/
        ]
    });
}

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
