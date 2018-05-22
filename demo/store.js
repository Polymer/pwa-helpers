/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// Redux assumes `process.env.NODE_ENV` exists in the ES module build.
// https://github.com/reactjs/redux/issues/2907
window.process = { env: { NODE_ENV: 'production' } };

import createStore from 'https://unpkg.com/redux@3.7.2/es/createStore?module';
import combineReducers from 'https://unpkg.com/redux@3.7.2/es/combineReducers?module';
import origCompose from 'https://unpkg.com/redux@3.7.2/es/compose?module';

import { lazyReducerEnhancer } from '../lazy-reducer-enhancer.js'

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created).
export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers))
);

// Initially loaded reducers.
import counter from './reducers/counter.js';
store.addReducers({
  counter
});
