import React from 'react'
import { hydrate } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/app'
import {flashApp} from './reducers'

import './assets/style.css'

const store = createStore(
    flashApp,
    window.__STATE__ || {}
);

hydrate(
    <Provider store={store}><App /></Provider>,
    document.getElementById("root")
);

// clean-up the initial state at some later date
setTimeout(() => {
    delete window.__STATE__;
}, 0);
