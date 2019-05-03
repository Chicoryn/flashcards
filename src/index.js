import fs from 'fs'
import path from 'path';
import express from 'express'
import React from 'react';
import {renderToString} from 'react-dom/server'
import App from './components/app'
import {flashApp, initialState, shuffle} from './reducers'
import Card from './models/card'
import CardsController from './controllers/cards'
import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";

const app = express();
let router = express.Router();

router.use('/assets', express.static(path.resolve(__dirname, '../dist/')));
router.get('/cards', async (request, response) => CardsController.index(request, response));
router.patch('/cards', async (request, response) => CardsController.update(request, response));
router.post('/cards', async (request, response) => CardsController.create(request, response));
router.delete('/cards', async (request, response) => CardsController.destroy(request, response));

fs.readFile(path.resolve(__dirname, '../dist/index.html'), (err, template) => {
    if (err) {
        console.log('Could not load `dist/index.html`');
        return;
    }

    router.get('/', async (request, response) => {
        const store = createStore(
            flashApp,
            Object.assign({}, initialState, { cards: await Card.getAll() }),
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
                `<script>window.__STATE__ = ${preloadedState};</script>`
            )
        );
    });

    app.use(express.json());
    app.use(router);
    app.listen(process.env.PORT || 3000);
});
