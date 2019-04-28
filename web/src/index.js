import fs from 'fs'
import path from 'path';
import express from 'express'
import React from 'react';
import {renderToString} from 'react-dom/server'
import App from './components/app'
import {flashApp, initialState} from './reducers'
import {createStore} from "redux";
import {Provider} from "react-redux";

const app = express();
let router = express.Router();

router.use('/assets', express.static(path.resolve(__dirname, '../dist/')));

fs.readFile(path.resolve(__dirname, '../dist/index.html'), (err, template) => {
    if (err) {
        console.log('Could not load `dist/index.html`');
        return;
    }

    router.get('/', (request, response) => {
        const store = createStore(flashApp, initialState);
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
                `<script>window.__STATE__ = ${preloadedState}</script>`
            )
        );
    });

    app.use(router);
    app.listen(process.env.PORT || 3000);
});
