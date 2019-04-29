import fs from 'fs'
import path from 'path';
import express from 'express'
import React from 'react';
import {renderToString} from 'react-dom/server'
import App from './components/app'
import {flashApp, initialState, shuffle} from './reducers'
import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import request from 'request-promise'

const API_SERVER_PORT = process.env.API_SERVER_PORT || 8080;
const PORT = process.env.PORT || 3000;

export const getState = async function() {
    const cardsJson = await request(`http://localhost:${API_SERVER_PORT}`)
        .catch(err => { console.log(err) });
    const cards = shuffle(JSON.parse(cardsJson) || []);

    return Object.assign({}, initialState, { cards });
};


const app = express();
let router = express.Router();

router.use('/assets', express.static(path.resolve(__dirname, '../dist/')));

fs.readFile(path.resolve(__dirname, '../dist/index.html'), (err, template) => {
    if (err) {
        console.log('Could not load `dist/index.html`');
        return;
    }

    router.get('/', async (request, response) => {
        const store = createStore(
            flashApp,
            await getState(),
            applyMiddleware(thunkMiddleware)
        );
        let content = renderToString(
            <Provider store={store}>
                <App/>
            </Provider>
        );
        const preloadedState = JSON.stringify(store.getState()).replace(
            /</g,
            '\\u003c'
        );

        return response.send(
            template.toString().replace(
                /<div id="?root"?><\/div>/,
                `<div id="root">${content}</div>` +
                `<script>window.__STATE__ = ${preloadedState};</script>` +
                `<script>window.__API_SERVER_PORT__ = ${API_SERVER_PORT};</script>`
            )
        );
    });

    app.use(router);
    app.listen(PORT);
});
